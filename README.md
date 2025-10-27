# VidhiSetu - Legal Assistant for India ⚖️

An AI-powered legal assistant providing guidance on Indian law. Built with Next.js, TypeScript, and Google Gemini API.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- **AI-Powered** - Google Gemini API for intelligent legal guidance
- **Chat Interface** - Natural conversation with context awareness
- **Modern UI** - Clean design with dark mode support
- **Responsive** - Works on all devices
- **India-Specific** - Specialized in Indian legal system

## Quick Start

1. **Clone and install**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
legal_assistant/
├── app/
│   ├── api/chat/route.ts         # Gemini API integration
│   ├── components/               # React components
│   ├── chat/page.tsx            # Chat interface
│   └── page.tsx                 # Landing page
├── .env.local                    # Environment variables
└── package.json
```

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Google Gemini API
- Lucide React Icons

## Disclaimer

This assistant provides **general legal information only**. It is **not a substitute for professional legal advice**. Always consult a qualified lawyer for specific legal matters.

##  Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

---

Built with ❤️ for the Indian legal community
