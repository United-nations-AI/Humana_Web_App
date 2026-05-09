# Humana AI

A free, globally accessible AI-powered human rights assistant built for Qatar CPD. No login required. Supports 6 languages with RTL (Arabic).

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · Supabase · OpenAI (via Supabase Edge Functions)

---

## Prerequisites

- Node.js 18+ (tested on v25)
- npm 9+
- A Supabase project (see Environment Variables below)

---

## Quick Start

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> The OpenAI API key is stored as a Supabase Edge Function secret — **not** in `.env.local`.
> Set it once with: `supabase secrets set OPENAI_API_KEY=sk-...`

**3. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — hero, features, principles, CTA |
| `/chat` | AI chat interface (sidebar + message thread) |
| `/about` | About Humana AI and Qatar CPD |
| `/contact` | Contact form |
| `/terms` | Terms & Conditions |
| `/api/chat` | POST — sends message to AI via Supabase Edge Function |
| `/api/process-url` | POST — fetches and extracts text from a URL |

---

## Features

- **AI chat** — ask questions about human rights, UDHR, treaties, asylum rights
- **File attachments** — PDF, images, Word docs, CSV, JSON, code files
- **URL analysis** — paste any URL to have the AI analyse its content
- **Language switcher** — English, العربية (RTL), Français, Español, 中文, हिन्दी
- **Chat history** — threads saved to localStorage, grouped by date
- **No login required** — fully anonymous, free for everyone

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home page
│   ├── chat/page.tsx     # Chat page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   ├── api/chat/         # AI API route
│   ├── api/process-url/  # URL fetch API route
│   └── globals.css       # All styles (Tailwind v4 + custom classes)
├── components/
│   ├── layout/           # Navbar, Footer, FooterWrapper
│   └── chat/             # ChatLayout, ChatSidebar, ChatMessage, ChatInput
├── context/
│   └── LanguageContext.tsx  # Language switcher (useLang hook)
├── lib/
│   ├── i18n.ts           # Translations for 6 languages
│   ├── chat-storage.ts   # localStorage thread persistence
│   ├── file-processor.ts # Client-side file/PDF extraction
│   └── supabase.ts       # Supabase client
└── types/
    └── chat.ts           # ChatThread, Message, Attachment types
```

---

## Powered by Qatar CPD

Humana AI is an initiative of [Qatar CPD](https://qatarcpd.com), committed to accessible education worldwide.
