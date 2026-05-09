# Humana AI — Setup Guide

## 1. Add Supabase Keys to `.env.local`

Get your keys from the [Supabase Dashboard API Settings](https://supabase.com/dashboard/project/mtqwroijalkjkszggnva/settings/api):

```env
NEXT_PUBLIC_SUPABASE_URL=https://mtqwroijalkjkszggnva.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon/public key here>
```

## 2. Apply Database Schema (One-Time)

Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/mtqwroijalkjkszggnva/sql/new) and paste + run the contents of:
```
supabase/migrations/001_initial_schema.sql
```

This creates 4 tables: `ai_config`, `system_prompts`, `guardrails`, `chat_logs` — seeded with defaults.

## 3. Store OpenAI API Key as Edge Function Secret

**Via Supabase Dashboard:**
Project Settings → Edge Functions → Secrets → Add New Secret:
- Name: `OPENAI_API_KEY`  
- Value: `sk-proj-...`

**Or via Supabase CLI:**
```bash
supabase secrets set OPENAI_API_KEY=sk-... --project-ref mtqwroijalkjkszggnva
```

## 4. Deploy Edge Function (if not already done via MCP)

```bash
# If you have Supabase CLI:
supabase functions deploy chat --project-ref mtqwroijalkjkszggnva --no-verify-jwt

# Or use the Supabase Dashboard → Edge Functions → Deploy
# Upload: supabase/functions/chat/index.ts
```

## 5. Authenticate Supabase MCP (for Claude Code)

```bash
claude /mcp
# Select "supabase" server → Authenticate
```

## 6. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Architecture

```
User Browser
    │
    ▼
Next.js App (Vercel / any host)
    │
    ├─ /           → Home page (hero, features, stats, CTA)
    ├─ /chat       → Full AI chat interface
    ├─ /about      → Mission, values, Qatar CPD
    ├─ /contact    → Contact form + channels
    └─ /terms      → Terms & Conditions
    │
    ▼
/api/chat  (Next.js API Route — proxies to Supabase)
    │
    ▼
Supabase Edge Function: `chat`  (Deno runtime)
    │
    ├─ Reads:   ai_config        → model, max_tokens, temperature
    ├─ Reads:   system_prompts   → active human rights AI prompt
    ├─ Reads:   guardrails       → safety rules injected into prompt
    ├─ Calls:   OpenAI API       → gpt-4o-mini (key stored as secret)
    └─ Writes:  chat_logs        → session_id, message, response, tokens
```

## Updating the AI Without Redeploying

Everything is DB-driven from the Supabase dashboard:

| What | Where | How |
|------|-------|-----|
| AI Model | `ai_config` table | Edit `model`, `max_tokens`, `temperature` |
| System Prompt | `system_prompts` table | Insert new row, set `is_active=true`, deactivate old |
| Guardrails | `guardrails` table | Add new rules or toggle `is_active` |

## Deploy to Vercel

```bash
npx vercel

# Add these env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```
