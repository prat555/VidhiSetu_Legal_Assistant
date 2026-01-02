# VidhiSetu - Legal Assistant for India ⚖️

A comprehensive AI-powered legal assistant platform for Indian law. Built with Next.js 16, TypeScript, Tailwind CSS 4, and Google Gemini API.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0-4285F4?style=flat-square)

## 🎨 Design

VidhiSetu features a **minimalist, professional design system** with:
- Clean zinc-based color palette
- Consistent dark mode support
- Accessible, high-contrast interface
- Professional legal aesthetics

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design guidelines.

## ✨ Features

### 🤖 AI Legal Assistant
- **Smart Chat Interface** - Natural conversation with context awareness
- **Indian Law Expert** - Specialized in IPC, CrPC, Constitution, and more
- **Chat History** - Save and manage multiple conversations

### 📄 Document Analyzer
- **Upload Documents** - Support for PDF, text files, and images
- **AI-Powered Analysis** - Get insights on contracts, agreements, notices
- **Risk Assessment** - Identify potential issues and unfair clauses
- **Detailed Reports** - Comprehensive analysis with recommendations

### 📝 Legal Forms Generator
- **FIR Generator** - Create police complaints
- **Legal Notices** - Generate formal legal notices
- **RTI Applications** - Right to Information requests
- **Bail Applications** - Format bail applications
- **Consumer Complaints** - File consumer grievances
- **Download** - Get documents in text format

### 🔍 Case Law Search
- **Search Judgments** - Find relevant Supreme Court and High Court cases
- **AI-Powered** - Intelligent search using legal knowledge
- **Case Details** - Citations, court names, dates, and summaries

### 🛡️ Know Your Rights
- **Interactive Scenarios** - Learn rights in common situations
- **Comprehensive Guides** - Step-by-step what to do
- **Emergency Helplines** - Quick access to important numbers
- **Legal Provisions** - Relevant laws and sections explained

### ⚖️ Court Case Tracker (Coming Soon)
- Real-time case tracking across Indian courts
- Hearing date reminders
- eCourts API integration

## 🎯 India-Specific
- **Specialized in Indian Law** - IPC, BNS, CrPC, Constitution
- **Indian Court System** - Supreme Court, High Courts
- **Legal Procedures** - Based on Indian legal framework
- **Helplines** - Indian emergency and legal aid numbers

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
