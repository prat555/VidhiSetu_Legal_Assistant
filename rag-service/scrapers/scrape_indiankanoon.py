from __future__ import annotations

import os
import re
import time
from pathlib import Path
from urllib.parse import quote_plus, urljoin

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load optional scraping limits from environment.
load_dotenv()

BASE_URL = "https://indiankanoon.org"
OUTPUT_DIR = Path("data/raw_docs/judgments")
SLEEP_SECONDS = int(os.getenv("INDIAKANOON_SLEEP_SECONDS", "2"))
MAX_RESULTS_PER_CATEGORY = int(os.getenv("MAX_RESULTS_PER_CATEGORY", "20"))
MAX_SEARCH_PAGES = int(os.getenv("MAX_SEARCH_PAGES", "5"))

# Required legal query categories for judgment collection.
CATEGORY_QUERIES = {
    "criminal law": "criminal law supreme court high court",
    "civil disputes": "civil dispute supreme court high court",
    "consumer complaints": "consumer complaint supreme court high court",
    "family law": "family law supreme court high court",
    "labour disputes": "labour dispute supreme court high court",
    "property law": "property law supreme court high court",
    "constitutional matters": "constitutional matter supreme court high court",
    "bail & anticipatory bail": "anticipatory bail high court supreme court",
    "FIR & cognizance": "FIR cognizance high court supreme court",
    "cyber crime": "cyber crime high court supreme court",
    "NDPS": "ndps act supreme court high court",
    "POCSO": "pocso act supreme court high court",
    "cheque bounce NI Act": "section 138 negotiable instruments act supreme court high court",
    "contract disputes": "indian contract act breach of contract supreme court high court",
    "specific relief": "specific relief act injunction supreme court high court",
    "arbitration": "arbitration and conciliation act supreme court high court",
    "insolvency": "insolvency and bankruptcy code supreme court high court",
    "company law": "companies act oppression mismanagement supreme court high court",
    "tax law": "income tax act gst act supreme court high court",
}

session = requests.Session()
session.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Referer": BASE_URL,
    }
)

FALLBACK_CATEGORY_QUERIES = {
    "FIR & cognizance": [
        "first information report cognizance supreme court high court",
        "section 154 crpc cognizance supreme court high court",
    ],
    "cyber crime": [
        "cyber crime information technology act supreme court high court",
        "section 66 it act online fraud supreme court high court",
    ],
}


def slugify(text: str) -> str:
    """Convert text into a filesystem-safe filename component."""
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_")
    return cleaned[:90] if cleaned else "untitled"


def search_links(query: str) -> list[str]:
    """Collect judgment links from Indian Kanoon search results."""
    last_error: requests.RequestException | None = None
    links: list[str] = []

    # Walk search pages to collect more than the first page of results.
    for page in range(1, MAX_SEARCH_PAGES + 1):
        search_url = f"{BASE_URL}/search/?formInput={quote_plus(query)}&pagenum={page}"
        page_collected = 0

        for attempt in range(3):
            try:
                response = session.get(search_url, timeout=45)
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")
                for anchor in soup.select("a[href^='/doc/']"):
                    href = anchor.get("href", "")
                    full_url = urljoin(BASE_URL, href)
                    if full_url not in links:
                        links.append(full_url)
                        page_collected += 1
                    if len(links) >= MAX_RESULTS_PER_CATEGORY:
                        return links

                break
            except requests.RequestException as exc:
                last_error = exc
                time.sleep(SLEEP_SECONDS)

        if page_collected == 0:
            # Stop early when no fresh result is discovered on next page.
            break

        time.sleep(SLEEP_SECONDS)

    if links:
        return links

    if last_error:
        raise last_error
    return []


def parse_judgment(url: str) -> dict[str, str] | None:
    """Extract title, court, date, citation, and full text from a judgment page."""
    response = session.get(url, timeout=30)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = (soup.find("h2") or soup.find("title"))
    title_text = title.get_text(" ", strip=True) if title else "Untitled judgment"

    page_text = soup.get_text("\n", strip=True)

    court_match = re.search(r"(Supreme Court of India|High Court[^\n]*)", page_text, flags=re.IGNORECASE)
    date_match = re.search(r"\b(\d{1,2}\s+[A-Za-z]+\s+\d{4})\b", page_text)
    citation_match = re.search(r"(AIR\s+\d{4}[^\n]*|SCC\s+[^\n]*|CITATION[^\n]*)", page_text, flags=re.IGNORECASE)

    # Prefer content-bearing nodes used by judgment pages; fallback to whole page text.
    content_node = soup.select_one("div.judgments") or soup.select_one("pre") or soup.select_one("div#doc")
    full_text = content_node.get_text("\n", strip=True) if content_node else page_text

    if len(full_text) < 500:
        return None

    return {
        "title": title_text,
        "court": court_match.group(1).strip() if court_match else "Unknown Court",
        "date": date_match.group(1).strip() if date_match else "Unknown Date",
        "citation": citation_match.group(1).strip() if citation_match else "Citation not found",
        "full_text": full_text,
    }


def save_judgment(url: str, payload: dict[str, str]) -> bool:
    """Persist one judgment as a text file unless it already exists."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    doc_id_match = re.search(r"/doc/(\d+)", url)
    doc_id = doc_id_match.group(1) if doc_id_match else hashlib_fallback(url)
    filename = f"{doc_id}_{slugify(payload['title'])}.txt"
    file_path = OUTPUT_DIR / filename

    if file_path.exists():
        return False

    body = (
        f"Title: {payload['title']}\n"
        f"Court: {payload['court']}\n"
        f"Date: {payload['date']}\n"
        f"Citation: {payload['citation']}\n"
        f"Source: {url}\n\n"
        f"{payload['full_text']}\n"
    )
    file_path.write_text(body, encoding="utf-8")
    return True


def hashlib_fallback(text: str) -> str:
    """Generate deterministic IDs when page URL misses numeric doc ID."""
    import hashlib

    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def main() -> None:
    """Run category-wise scraping with polite delays and progress output."""
    total_saved = 0

    for category, query in CATEGORY_QUERIES.items():
        print(f"\n[category] {category}")
        links: list[str] = []
        query_attempts = [query, *FALLBACK_CATEGORY_QUERIES.get(category, [])]

        for query_attempt in query_attempts:
            try:
                links = search_links(query_attempt)
                if links:
                    if query_attempt != query:
                        print(f"  fallback query succeeded: {query_attempt}")
                    break
            except requests.RequestException as exc:
                print(f"  search attempt failed: {exc}")

        if not links:
            print("  no results fetched for this category after retries")
            continue

        saved_for_category = 0
        for idx, link in enumerate(links, start=1):
            print(f"  ({idx}/{len(links)}) {link}")
            try:
                data = parse_judgment(link)
                if not data:
                    print("    skipped: insufficient content")
                else:
                    saved = save_judgment(link, data)
                    if saved:
                        saved_for_category += 1
                        total_saved += 1
                        print("    saved")
                    else:
                        print("    skipped: already downloaded")
            except requests.RequestException as exc:
                print(f"    failed: {exc}")

            # Respect remote service limits.
            time.sleep(SLEEP_SECONDS)

        print(f"  completed {category}: saved {saved_for_category}")

    print(f"\nDone. Total new judgments saved: {total_saved}")


if __name__ == "__main__":
    main()
