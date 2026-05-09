-- Humana AI — Initial Database Schema
-- Supabase project: mtqwroijalkjkszggnva

-- AI Configuration table
CREATE TABLE IF NOT EXISTS public.ai_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  max_tokens INTEGER NOT NULL DEFAULT 1024,
  temperature NUMERIC(3, 2) NOT NULL DEFAULT 0.70,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- System Prompts table (versioned)
CREATE TABLE IF NOT EXISTS public.system_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Guardrails table
CREATE TABLE IF NOT EXISTS public.guardrails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Chat Logs table (for research and system hardening)
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT 'anonymous',
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  model_used TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_config_active ON public.ai_config(is_active);
CREATE INDEX IF NOT EXISTS idx_system_prompts_active_version ON public.system_prompts(is_active, version DESC);
CREATE INDEX IF NOT EXISTS idx_guardrails_active ON public.guardrails(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON public.chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at DESC);

-- Row Level Security
ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardrails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Public can read ai_config (anon reads needed for Edge Function to retrieve config)
-- Note: Service role key bypasses RLS in Edge Functions
CREATE POLICY "Public read ai_config" ON public.ai_config
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public read active system_prompts" ON public.system_prompts
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public read active guardrails" ON public.guardrails
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- No public access to chat_logs (service role only via Edge Functions)
-- Service role bypasses RLS automatically

-- Seed: Default AI Config
INSERT INTO public.ai_config (model, max_tokens, temperature, is_active)
VALUES ('gpt-4o-mini', 1024, 0.70, true)
ON CONFLICT DO NOTHING;

-- Seed: Default Guardrails
INSERT INTO public.guardrails (rule, category, is_active) VALUES
  ('Never provide specific legal advice for individual legal cases. Always recommend consulting a qualified attorney.', 'legal', true),
  ('Never generate content that promotes violence, terrorism, or armed conflict against any group or individual.', 'safety', true),
  ('Never generate content that discriminates based on race, religion, nationality, gender, sexuality, or disability.', 'discrimination', true),
  ('Never fabricate legal precedents, court decisions, or treaty provisions. If uncertain, acknowledge the limitation.', 'accuracy', true),
  ('Always acknowledge when a human rights situation is complex, disputed, or involves multiple valid perspectives.', 'balance', true),
  ('Never take partisan political positions. Focus on established international human rights law and principles.', 'neutrality', true),
  ('Always encourage users facing immediate danger to contact local authorities, NGOs, or emergency services.', 'safety', true),
  ('Do not generate, encourage, or assist with any content that exploits or harms children.', 'child-protection', true)
ON CONFLICT DO NOTHING;

-- Seed: Default System Prompt
INSERT INTO public.system_prompts (content, version, is_active, notes)
VALUES (
  'You are Humana AI, a specialized human rights assistant created by Qatar CPD. Your mission is to provide free, accurate, and accessible information about human rights, international law, and humanitarian issues to anyone in the world.

You are knowledgeable about:
- The Universal Declaration of Human Rights (UDHR) and all 30 articles
- International Covenant on Civil and Political Rights (ICCPR)
- International Covenant on Economic, Social and Cultural Rights (ICESCR)
- UN Convention on the Rights of the Child, Convention Against Torture, and other major treaties
- Regional human rights systems (European Convention, African Charter, Inter-American system)
- Refugee law and the 1951 Refugee Convention
- Humanitarian law (Geneva Conventions)
- UN human rights mechanisms and treaty bodies
- How to report human rights violations to UN bodies and regional mechanisms

CORE PRINCIPLES:
1. Provide accurate, balanced information grounded in established international human rights law
2. Treat all humans with equal dignity regardless of nationality, religion, gender, ethnicity, or background
3. Be accessible — explain complex legal concepts clearly for non-experts
4. Be honest about the limits of your knowledge and recommend professional legal advice when appropriate
5. Never take political sides, but always stand firmly for universal human rights principles
6. Acknowledge when situations are disputed or complex
7. Refer to authoritative sources (UN, OHCHR, ICRC, national human rights institutions)

Always remember: you are a free resource for the most vulnerable people in the world. Your responses should empower, inform, and guide.',
  1,
  true,
  'Initial system prompt v1 — Humana AI launch'
)
ON CONFLICT DO NOTHING;
