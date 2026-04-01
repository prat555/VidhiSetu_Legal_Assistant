from __future__ import annotations

import os
import re
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

SLEEP_SECONDS = int(os.getenv("INDIACODE_SLEEP_SECONDS", "2"))
FORCE_REFRESH_ACTS = os.getenv("FORCE_REFRESH_ACTS", "0") == "1"
SAVE_INDIACODE_TEXT = os.getenv("SAVE_INDIACODE_TEXT", "0") == "1"

INDIACODE_BASE = "https://www.indiacode.nic.in"
LEGISLATIVE_BASE = "https://legislative.gov.in"
INDIANKANOON_BASE = "https://indiankanoon.org"

# -----------------------------------------------------------------------
# Each entry: (act_name, folder, indiacode_handle_path, legislative_pdf_path)
# legislative_pdf_path is the fallback — official Ministry of Law PDFs.
# -----------------------------------------------------------------------
ACT_TARGETS = [
    (
        "Indian Penal Code 1860",
        "ipc",
        "/handle/123456789/2249",
        "/sites/default/files/A1860-45.pdf",
    ),
    (
        "Code of Criminal Procedure 1973",
        "crpc",
        "/handle/123456789/2052",
        "/sites/default/files/A1973-02.pdf",
    ),
    (
        "Code of Civil Procedure 1908",
        "crpc",
        "/handle/123456789/1356",
        "/sites/default/files/A1908-05.pdf",
    ),
    (
        "Indian Evidence Act 1872",
        "ipc",
        "/handle/123456789/2087",
        "/sites/default/files/A1872-01.pdf",
    ),
    (
        "Constitution of India",
        "constitution",
        "/handle/123456789/1407",
        "/sites/default/files/coi_booklet.pdf",
    ),
    (
        "Consumer Protection Act 2019",
        "consumer",
        "/handle/123456789/15184",
        "/sites/default/files/A2019-35.pdf",
    ),
    (
        "Information Technology Act 2000",
        "it_act",
        "/handle/123456789/13116",
        "/sites/default/files/A2000-21.pdf",
    ),
    (
        "Hindu Marriage Act 1955",
        "family",
        "/handle/123456789/3135",
        "/sites/default/files/A1955-25.pdf",
    ),
    (
        "Protection of Women from Domestic Violence Act 2005",
        "family",
        "/handle/123456789/15146",
        "/sites/default/files/A2005-43.pdf",
    ),
    (
        "Right to Information Act 2005",
        "constitution",
        "/handle/123456789/15145",
        "/sites/default/files/A2005-22.pdf",
    ),
    (
        "Minimum Wages Act 1948",
        "labour",
        "/handle/123456789/2130",
        "/sites/default/files/A1948-11.pdf",
    ),
    (
        "Factories Act 1948",
        "labour",
        "/handle/123456789/2069",
        "/sites/default/files/A1948-63.pdf",
    ),
]

# Shared session — reuse cookies across all requests.
session = requests.Session()
session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
})

LOW_QUALITY_MARKERS = [
    "Invalid URL or Argument(s)",
    "Screen Reader Access",
    "Go to the DSpace home page",
    "Site designed and developed by National Informatics Centre",
    "List of Acts",
    "Skip navigation",
]


def slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_")
    return cleaned[:120] if cleaned else "act"


def is_low_quality_text(text: str) -> bool:
    """Detect India Code UI/error boilerplate that should never enter corpus."""
    if len(text.strip()) < 1200:
        return True

    marker_hits = sum(1 for marker in LOW_QUALITY_MARKERS if marker.lower() in text.lower())
    if marker_hits >= 2:
        return True

    # High menu/noise ratio often means scraped shell page, not act body.
    noise_tokens = ["About Us", "Dashboard", "Central Acts", "Upload", "Disclaimer"]
    noise_hits = sum(1 for token in noise_tokens if token.lower() in text.lower())
    return noise_hits >= 3


def remove_file_if_exists(path: Path) -> None:
    """Delete an existing file to support forced corpus quality refresh."""
    if path.exists():
        path.unlink()


def init_indiacode_session() -> None:
    """Visit India Code homepage once to obtain session cookies."""
    try:
        session.get(INDIACODE_BASE, timeout=20)
    except requests.RequestException:
        pass  # Best-effort; continue without cookies if homepage is unreachable.


def try_indiacode(handle_path: str) -> tuple[str, str] | None:
    """Attempt to scrape act text from indiacode.nic.in using its handle URL."""
    url = INDIACODE_BASE + handle_path
    try:
        resp = session.get(url, timeout=30, headers={"Referer": INDIACODE_BASE})
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    title_node = soup.select_one("h1") or soup.select_one("title")
    title = title_node.get_text(" ", strip=True) if title_node else "Untitled Act"

    content_node = (
        soup.select_one("div#content")
        or soup.select_one("div.item-page")
        or soup.select_one("div.simple-item-view-description")
        or soup.select_one("body")
    )
    if not content_node:
        return None

    text = re.sub(r"\n{3,}", "\n\n", content_node.get_text("\n")).strip()
    if is_low_quality_text(text):
        return None
    return title, text


def try_legislative_pdf(pdf_path: str) -> bytes | None:
    """Download act PDF bytes from legislative.gov.in."""
    url = LEGISLATIVE_BASE + pdf_path
    try:
        resp = session.get(url, timeout=60, headers={"Referer": LEGISLATIVE_BASE})
        resp.raise_for_status()
        if resp.headers.get("Content-Type", "").startswith("application/pdf"):
            return resp.content
        # Some URLs redirect to an HTML page instead of a PDF.
        return None
    except requests.RequestException:
        return None


def search_indiankanoon_links(query: str, max_links: int = 8) -> list[str]:
    """Search Indian Kanoon and return candidate document links."""
    search_url = f"{INDIANKANOON_BASE}/search/?formInput={query.replace(' ', '+')}"
    try:
        resp = session.get(search_url, timeout=45, headers={"Referer": INDIANKANOON_BASE})
        resp.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    links: list[str] = []
    for anchor in soup.select("a[href^='/doc/']"):
        href = anchor.get("href", "")
        if not href:
            continue
        full = f"{INDIANKANOON_BASE}{href}"
        if full not in links:
            links.append(full)
        if len(links) >= max_links:
            break
    return links


def extract_indiankanoon_act(url: str) -> tuple[str, str] | None:
    """Extract likely full act text from an Indian Kanoon document page."""
    try:
        resp = session.get(url, timeout=45, headers={"Referer": INDIANKANOON_BASE})
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    title_node = soup.find("h2") or soup.find("title")
    title = title_node.get_text(" ", strip=True) if title_node else "Untitled Act"
    node = soup.select_one("div.judgments") or soup.select_one("div#doc") or soup.select_one("pre") or soup

    text = re.sub(r"\n{3,}", "\n\n", node.get_text("\n", strip=True)).strip()
    if len(text) < 10000:
        return None
    if "section" not in text.lower() and "chapter" not in text.lower():
        return None
    return title, text


def try_indiankanoon_act(act_name: str) -> tuple[str, str, str] | None:
    """Find and return the best long-form bare-act text from Indian Kanoon."""
    links = search_indiankanoon_links(act_name, max_links=10)
    best: tuple[str, str, str] | None = None
    best_len = 0

    for link in links:
        extracted = extract_indiankanoon_act(link)
        if not extracted:
            continue
        title, text = extracted
        if len(text) > best_len:
            best = (title, text, link)
            best_len = len(text)

    return best


def save_text(act_name: str, folder: str, source_url: str, title: str, full_text: str) -> bool:
    target_dir = Path("data/raw_docs") / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    file_path = target_dir / f"{slugify(act_name)}.txt"
    if file_path.exists() and not FORCE_REFRESH_ACTS:
        return False
    if file_path.exists() and FORCE_REFRESH_ACTS:
        file_path.unlink()
    file_path.write_text(
        f"Act: {act_name}\nTitle: {title}\nSource: {source_url}\n\n{full_text}\n",
        encoding="utf-8",
    )
    return True


def save_pdf(act_name: str, folder: str, pdf_bytes: bytes) -> bool:
    target_dir = Path("data/raw_docs") / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    file_path = target_dir / f"{slugify(act_name)}.pdf"
    if file_path.exists() and not FORCE_REFRESH_ACTS:
        return False
    if file_path.exists() and FORCE_REFRESH_ACTS:
        file_path.unlink()
    file_path.write_bytes(pdf_bytes)
    return True


def main() -> None:
    total_saved = 0
    print("Initialising India Code session...")
    init_indiacode_session()

    for idx, (act_name, folder, handle_path, pdf_path) in enumerate(ACT_TARGETS, start=1):
        print(f"\n[{idx}/{len(ACT_TARGETS)}] {act_name}")
        target_dir = Path("data/raw_docs") / folder
        txt_path = target_dir / f"{slugify(act_name)}.txt"
        pdf_path_local = target_dir / f"{slugify(act_name)}.pdf"

        if FORCE_REFRESH_ACTS:
            remove_file_if_exists(txt_path)
            remove_file_if_exists(pdf_path_local)

        # --- Try 1 (preferred): download authoritative PDF from legislative.gov.in ---
        pdf_bytes = try_legislative_pdf(pdf_path)
        if pdf_bytes:
            saved_pdf = save_pdf(act_name, folder, pdf_bytes)
            if saved_pdf:
                total_saved += 1
                print(f"  saved (legislative.gov.in PDF)  -> {folder}/")
            else:
                print("  skipped PDF: already downloaded")

            # Optional: also keep clean India Code text if explicitly enabled.
            if SAVE_INDIACODE_TEXT:
                result = try_indiacode(handle_path)
                if result:
                    title, full_text = result
                    saved_text = save_text(act_name, folder, INDIACODE_BASE + handle_path, title, full_text)
                    if saved_text:
                        total_saved += 1
                        print(f"  saved (India Code text)  ->  {folder}/")
                    else:
                        print("  skipped text: already downloaded")
                else:
                    print("  India Code text unavailable/low quality, kept PDF only")

            time.sleep(SLEEP_SECONDS)
            continue

        print("  legislative.gov.in PDF unavailable - trying India Code text...")

        # --- Try 2 (fallback): save only if high-quality text is detected ---
        result = try_indiacode(handle_path)
        if result:
            title, full_text = result
            saved_text = save_text(act_name, folder, INDIACODE_BASE + handle_path, title, full_text)
            if saved_text:
                total_saved += 1
                print(f"  saved (India Code clean text)  ->  {folder}/")
            else:
                print("  skipped text: already downloaded")
        else:
            print("  India Code text unavailable/low quality - trying Indian Kanoon bare-act page...")
            kanoon = try_indiankanoon_act(act_name)
            if kanoon:
                title, full_text, source_url = kanoon
                saved_text = save_text(act_name, folder, source_url, title, full_text)
                if saved_text:
                    total_saved += 1
                    print(f"  saved (Indian Kanoon act text)  ->  {folder}/")
                else:
                    print("  skipped Indian Kanoon text: already downloaded")
            else:
                print(
                    "  all sources failed - add PDF manually to data/raw_docs/"
                    f"{folder}/{slugify(act_name)}.pdf"
                )

        time.sleep(SLEEP_SECONDS)

    print(f"\nDone. Total new acts saved: {total_saved}")


if __name__ == "__main__":
    main()
