-- NDP V2.0 PostgreSQL target schema (design skeleton; not executed by GitHub Pages)
CREATE TABLE IF NOT EXISTS tracks (
  ndp_id text PRIMARY KEY,
  isrc text UNIQUE,
  title text NOT NULL,
  artist text NOT NULL,
  status text NOT NULL,
  ndt_version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rights_splits (
  id bigserial PRIMARY KEY,
  track_id text NOT NULL REFERENCES tracks(ndp_id) ON DELETE CASCADE,
  party_id text NOT NULL,
  role text NOT NULL,
  share numeric(7,4) NOT NULL CHECK (share >= 0 AND share <= 100),
  payment_reference text,
  license_reference text
);

CREATE TABLE IF NOT EXISTS derivation_edges (
  id bigserial PRIMARY KEY,
  source_track text NOT NULL REFERENCES tracks(ndp_id),
  derived_track text NOT NULL REFERENCES tracks(ndp_id),
  relation_type text NOT NULL,
  share numeric(7,4) NOT NULL DEFAULT 0 CHECK (share >= 0 AND share <= 100),
  license text,
  verification text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (source_track <> derived_track)
);

CREATE TABLE IF NOT EXISTS usage_events (
  event_id text PRIMARY KEY,
  track_id text NOT NULL REFERENCES tracks(ndp_id),
  source text NOT NULL,
  occurred_at timestamptz NOT NULL,
  territory text,
  usage_type text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  gross_amount numeric(18,4) NOT NULL,
  currency char(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  entity_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
