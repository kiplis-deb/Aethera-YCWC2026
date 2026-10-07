-- ============================================================================
-- AETHERA DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)
-- Run this SQL in your Supabase Project Dashboard -> "SQL Editor" -> "New Query"
-- ============================================================================

-- 1. Table for Registered Users & Synced Workspace Data
CREATE TABLE IF NOT EXISTS public.aethera_users (
  username TEXT PRIMARY KEY,
  id TEXT NOT NULL,
  display_name TEXT,
  salt TEXT NOT NULL,
  hash TEXT NOT NULL,
  data JSONB DEFAULT '{"calendar": [], "chats": [], "notes": []}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Active Session Tokens (Fast Cross-Device Auth)
CREATE TABLE IF NOT EXISTS public.aethera_tokens (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL REFERENCES public.aethera_users(username) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Helpful Indices for Fast Queries
CREATE INDEX IF NOT EXISTS idx_aethera_tokens_username ON public.aethera_tokens(username);
CREATE INDEX IF NOT EXISTS idx_aethera_users_updated_at ON public.aethera_users(updated_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.aethera_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aethera_tokens ENABLE ROW LEVEL SECURITY;

-- 5. Security Policies: Allow Service Role (Backend API) Full Read/Write Access
DROP POLICY IF EXISTS "Service role full access on aethera_users" ON public.aethera_users;
CREATE POLICY "Service role full access on aethera_users"
  ON public.aethera_users
  FOR ALL
  TO authenticated, service_role, anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on aethera_tokens" ON public.aethera_tokens;
CREATE POLICY "Service role full access on aethera_tokens"
  ON public.aethera_tokens
  FOR ALL
  TO authenticated, service_role, anon
  USING (true)
  WITH CHECK (true);

-- 6. Trigger to automatically update "updated_at" timestamp on user changes
CREATE OR REPLACE FUNCTION public.handle_aethera_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_aethera_users_updated_at ON public.aethera_users;
CREATE TRIGGER trg_aethera_users_updated_at
  BEFORE UPDATE ON public.aethera_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_aethera_updated_at();

COMMENT ON TABLE public.aethera_users IS 'Aethera User Accounts and Synced Workspace State (Notes, Calendar, Chats)';
COMMENT ON TABLE public.aethera_tokens IS 'Aethera Active Session Bearer Tokens';
