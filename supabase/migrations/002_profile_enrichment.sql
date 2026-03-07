-- Profile enrichment columns for celebrity data pipeline
-- Adds Wikipedia/Wikidata/나무위키 links, birth year, agency, and social links

ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS birth_year INTEGER;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS agency TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS wikipedia_url TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS namuwiki_url TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS wikidata_id TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ;
