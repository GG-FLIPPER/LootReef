-- ============================================================
-- Migration: Create sponsor_slots table
-- Description: Stores sponsored card/deal placements for LootReef
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- --------------------------------------------------------
-- 1. Custom ENUM types
-- --------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE sponsor_placement AS ENUM ('deal_card', 'todays_deal');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sponsor_tier AS ENUM ('3day', '7day', '14day', '30day');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sponsor_status AS ENUM ('pending', 'approved', 'active', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- --------------------------------------------------------
-- 2. Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS sponsor_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sponsor info
  company_name    TEXT        NOT NULL,
  contact_email   TEXT        NOT NULL,

  -- Card content
  card_title      TEXT        NOT NULL,
  card_description TEXT,
  image_url       TEXT,
  target_url      TEXT        NOT NULL,

  -- Placement & tier
  placement       sponsor_placement NOT NULL,
  tier            sponsor_tier      NOT NULL,

  -- Billing
  price_paid      NUMERIC(10, 2)    NOT NULL DEFAULT 0,
  currency        TEXT              NOT NULL DEFAULT 'USD',

  -- Schedule
  start_date      DATE,
  end_date        DATE,

  -- State
  active          BOOLEAN           NOT NULL DEFAULT false,
  status          sponsor_status    NOT NULL DEFAULT 'pending',

  -- Analytics counters
  impressions     INTEGER           NOT NULL DEFAULT 0,
  clicks          INTEGER           NOT NULL DEFAULT 0,

  -- Timestamps
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ       NOT NULL DEFAULT now()
);

-- --------------------------------------------------------
-- 3. Index for the common query: "active slots by placement"
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sponsor_slots_placement_active
  ON sponsor_slots (placement, active, status);

-- --------------------------------------------------------
-- 4. Auto-update updated_at on row change
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION update_sponsor_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sponsor_slots_updated_at ON sponsor_slots;

CREATE TRIGGER trg_sponsor_slots_updated_at
  BEFORE UPDATE ON sponsor_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_sponsor_slots_updated_at();

-- ============================================================
-- 5. Row Level Security
-- ============================================================
-- Enable RLS with NO public policies.
-- Only the service_role key (used by the server) can read/write.
-- The anon key and authenticated users get zero rows.
-- ============================================================
ALTER TABLE sponsor_slots ENABLE ROW LEVEL SECURITY;

-- No CREATE POLICY statements — intentionally locked down.
-- All access goes through the server's service_role Supabase client.
