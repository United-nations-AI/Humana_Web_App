# Humana AI

A free, globally accessible AI-powered human rights assistant built for Qatar CPD, with a self-paced learning platform that issues certificates of completion. No login required. Supports 6 languages with RTL (Arabic).

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
LEARN_CERT_SECRET=<random-string-16+chars>
LEARN_ADMIN_KEY=<random-string-16+chars>
```

> `LEARN_CERT_SECRET` signs learning-platform certificates. Generate one with
> `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
> See `.env.example` for the full list.

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
| `/learn` | Learning platform — course catalogue |
| `/learn/[courseId]` | Course player: modules, YouTube lessons, progress |
| `/learn/[courseId]/quiz` | Final questionnaire (unlocked after all modules) |
| `/learn/[courseId]/certificate` | Certificate of completion (requires a server-signed pass token) |
| `/about` | About Humana AI and Qatar CPD |
| `/contact` | Contact form |
| `/terms` | Terms & Conditions |
| `/api/chat` | POST — sends message to AI via Supabase Edge Function |
| `/api/process-url` | POST — fetches and extracts text from a public URL (SSRF-guarded) |
| `/api/transcribe` | POST — voice → text via Supabase Edge Function (Whisper) |
| `/api/tts` | POST — text → speech via Supabase Edge Function |
| `/api/learn/quiz` | POST — grades a questionnaire server-side, issues a signed certificate token on a pass |
| `/api/learn/certificate` | POST — verifies a certificate token |
| `/admin/learn` | Admin dashboard: exam attempts, students, certificates issued (needs `LEARN_ADMIN_KEY`) |
| `/api/admin/learn-stats` | GET — statistics JSON, `Authorization: Bearer <LEARN_ADMIN_KEY>` |

---

## Features

- **AI chat** — ask questions about human rights, UDHR, treaties, asylum rights
- **File attachments** — PDF, images, Word docs, CSV, JSON, code files
- **URL analysis** — paste any URL to have the AI analyse its content
- **Language switcher** — English, العربية (RTL), Français, Español, 中文, हिन्दी
- **Chat history** — threads saved to localStorage, grouped by date
- **No login required** — fully anonymous, free for everyone
- **Learning platform** — video courses split into modules, progress tracking, a 30-question final questionnaire (80% pass mark), and a printable certificate. Answer keys stay server-side; certificates are HMAC-signed so they cannot be forged from the browser.

---

## Project Structure

```
src/
├── app/
│   ├── (site)/           # Pages that share the Navbar + Footer
│   │   ├── page.tsx      #   Home
│   │   ├── about/ contact/ terms/
│   │   └── learn/        #   Learning platform (catalogue, [courseId], quiz, certificate)
│   ├── chat/             # Chat (full-screen, no site chrome)
│   ├── api/
│   │   ├── chat/ transcribe/ tts/   # Proxies to Supabase Edge Functions
│   │   ├── process-url/             # URL fetch + text extraction (SSRF-guarded)
│   │   └── learn/                   # quiz grading + certificate verification
│   └── globals.css       # All styles (Tailwind v4 + custom classes)
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── chat/             # ChatLayout, ChatSidebar, ChatMessage, ChatInput, ChatDisclaimer
│   └── learn/            # LearnCatalog, CoursePlayer, CourseQuiz, CourseCertificate, NameModal
├── context/              # LanguageContext (useLang), GlobalAudioContext
├── lib/
│   ├── i18n.ts           # Translations for 6 languages
│   ├── courses.ts        # Course / module / lesson / question content (public — no answers)
│   ├── learn-server.ts   # SERVER ONLY: answer keys, grading, certificate token signing
│   ├── learn-storage.ts  # localStorage learner name + progress
│   ├── chat-storage.ts   # localStorage thread persistence
│   ├── file-processor.ts # Client-side file/PDF extraction
│   └── supabase.ts       # Supabase client
├── types/                # chat.ts, learn.ts
scripts/
└── copy-pdf-worker.mjs   # postinstall: copies the pdf.js worker into /public (self-hosted, no CDN)
```

---

## Adding or Editing Courses

1. Add the course, modules, lessons (YouTube links) and questions in `src/lib/courses.ts`. Questions carry no answers.
2. Add the matching answer key (`questionId → correct option index`) in `src/lib/learn-server.ts` under `QUIZ_ANSWERS`.
3. `passMark` on the course sets the pass threshold (0.8 = 80%). Scores of 60–79% show "Retake recommended", below 60% "Review course content".

## Admin Dashboard

Every graded questionnaire is recorded in the Supabase table `learn_assessments` (created by `supabase/migrations/003_learn_assessments.sql` — run it once in the SQL editor). Open `/admin/learn` and enter `LEARN_ADMIN_KEY` to see attempts, students who attempted and passed, certificates issued, pass rate, and the latest 100 attempts. The same data is visible in Supabase → Table Editor, and the `learn_course_stats` view gives per-course totals.

## Security Notes

- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
- `/api/process-url` only fetches public http(s) hosts; private, loopback, link-local and cloud-metadata addresses are refused on every redirect hop, and responses are size-capped.
- Learning-platform answer keys never reach the browser; certificates are HMAC-SHA256 signed with `LEARN_CERT_SECRET` and verified server-side before rendering.
- Never commit `.env.local`. Rotate `LEARN_CERT_SECRET` if it is ever exposed (existing certificates will stop verifying).

---

## Powered by Qatar CPD

Humana AI is an initiative of [Qatar CPD](https://qatarcpd.com), committed to accessible education worldwide.
