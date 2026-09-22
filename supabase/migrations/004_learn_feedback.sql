-- Migration 004: Learning platform — post-course feedback
-- Run once in Supabase → SQL Editor (after 003). Written by the server only when LEARN_DB_TRACKING=on.

CREATE TABLE IF NOT EXISTS public.learn_feedback (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id       TEXT NOT NULL,
  certificate_id  TEXT,
  ratings         JSONB NOT NULL,          -- {"q1":5,...,"q6":4}
  overall         TEXT NOT NULL,           -- Poor | Fair | Good | Very Good | Excellent
  recommend       TEXT NOT NULL,           -- Yes | Maybe | No
  most_useful     TEXT,
  improve         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_learn_feedback_course ON public.learn_feedback(course_id);
ALTER TABLE public.learn_feedback ENABLE ROW LEVEL SECURITY;   -- no public policies: service role only
