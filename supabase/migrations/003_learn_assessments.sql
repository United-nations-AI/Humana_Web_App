-- Migration 003: Learning platform — assessment attempts + certificates
-- Run once in Supabase → SQL Editor. Rows are written by the Next.js server with the
-- service-role key; nothing is readable by the anon key.

CREATE TABLE IF NOT EXISTS public.learn_assessments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id       TEXT NOT NULL,
  learner_name    TEXT NOT NULL,
  correct         INTEGER NOT NULL,
  total           INTEGER NOT NULL,
  score           NUMERIC(5,4) NOT NULL,          -- 0..1
  passed          BOOLEAN NOT NULL DEFAULT false,
  band            TEXT NOT NULL,                  -- pass | retake | review
  certificate_id  TEXT,                           -- set only when a certificate was issued
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_learn_assessments_course     ON public.learn_assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_learn_assessments_created_at ON public.learn_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learn_assessments_passed     ON public.learn_assessments(passed) WHERE passed;

-- Lock down: no anon/authenticated access. Service role bypasses RLS.
ALTER TABLE public.learn_assessments ENABLE ROW LEVEL SECURITY;

-- Per-course summary for the admin dashboard (and for Supabase Table Editor viewing)
CREATE OR REPLACE VIEW public.learn_course_stats AS
SELECT
  course_id,
  COUNT(*)                                        AS attempts,
  COUNT(DISTINCT lower(learner_name))             AS learners,
  COUNT(*) FILTER (WHERE passed)                  AS passed_attempts,
  COUNT(DISTINCT lower(learner_name)) FILTER (WHERE passed) AS learners_passed,
  COUNT(certificate_id)                           AS certificates_issued,
  ROUND(AVG(score) * 100, 1)                      AS avg_score_pct,
  MAX(created_at)                                 AS last_attempt_at
FROM public.learn_assessments
GROUP BY course_id;

REVOKE ALL ON public.learn_course_stats FROM anon, authenticated;
