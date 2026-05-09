-- Migration 002: Add thread_id to chat_logs for URL-based chat history
-- Nullable UUID column; populated for new rows where session_id is a valid UUID.
-- Old rows (session_id = 'anonymous' etc.) are left NULL.

ALTER TABLE public.chat_logs
  ADD COLUMN IF NOT EXISTS thread_id UUID;

-- Back-fill rows where session_id is already a valid UUID
UPDATE public.chat_logs
SET thread_id = session_id::uuid
WHERE thread_id IS NULL
  AND session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Index for fast /chat/[threadId] lookups
CREATE INDEX IF NOT EXISTS idx_chat_logs_thread_id
  ON public.chat_logs(thread_id)
  WHERE thread_id IS NOT NULL;
