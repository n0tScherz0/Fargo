-- FARGO — Supabase Database Schema
-- DIT-FORENSICS-2.0 Case Persistence
-- Dead Internet Theory
--
-- Apply this in your Supabase project's SQL Editor (Database > SQL Editor > New query).
-- No authentication required; this is a public demo table.

CREATE TABLE IF NOT EXISTS analyses (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  filename      TEXT,
  media_type    TEXT,
  file_size     BIGINT,
  mime_type     TEXT,
  verdict       TEXT,
  confidence    INTEGER,
  risk_level    TEXT,
  analysis_json JSONB,
  report_status TEXT        DEFAULT 'finalized'
);

-- Index for fast history queries
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses (created_at DESC);

-- Enable Row Level Security but allow public anon access for the demo.
-- (Adjust if you add authentication later.)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read" ON analyses
  FOR SELECT USING (true);

CREATE POLICY "Allow anon insert" ON analyses
  FOR INSERT WITH CHECK (true);
