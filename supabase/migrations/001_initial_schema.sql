-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CELEBRITIES
-- ============================================
CREATE TABLE celebrities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('entertainer', 'politician', 'athlete')),
  sub_category TEXT,
  profile_image_url TEXT,
  description TEXT,
  property_count INTEGER NOT NULL DEFAULT 0,
  total_asset_value BIGINT NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_celebrities_category ON celebrities(category);
CREATE INDEX idx_celebrities_property_count ON celebrities(property_count DESC);
CREATE INDEX idx_celebrities_name ON celebrities(name);

-- ============================================
-- PROPERTIES
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'apartment'
    CHECK (property_type IN ('apartment', 'house', 'villa', 'officetel', 'building', 'land', 'other')),
  exclusive_area DOUBLE PRECISION,
  floor_info TEXT,
  building_year INTEGER,
  dong_code TEXT,
  latest_transaction_price BIGINT,
  latest_transaction_date DATE,
  comment_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  checkin_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_dong_code ON properties(dong_code);
CREATE INDEX idx_properties_type ON properties(property_type);

-- ============================================
-- CELEBRITY_PROPERTIES (Many-to-Many)
-- ============================================
CREATE TABLE celebrity_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  celebrity_id UUID NOT NULL REFERENCES celebrities(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  ownership_type TEXT NOT NULL DEFAULT 'owner'
    CHECK (ownership_type IN ('owner', 'tenant', 'former_owner')),
  acquisition_date DATE,
  acquisition_price BIGINT,
  source_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('verified', 'reported', 'unverified')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(celebrity_id, property_id)
);

CREATE INDEX idx_celebrity_properties_celebrity ON celebrity_properties(celebrity_id);
CREATE INDEX idx_celebrity_properties_property ON celebrity_properties(property_id);

-- ============================================
-- TRANSACTIONS (국토교통부 실거래가 캐시)
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  transaction_amount BIGINT NOT NULL,
  transaction_year INTEGER NOT NULL,
  transaction_month INTEGER NOT NULL,
  transaction_day INTEGER NOT NULL,
  exclusive_area DOUBLE PRECISION,
  floor INTEGER,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_year DESC, transaction_month DESC);

-- ============================================
-- COMMENTS (대댓글 지원)
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_property ON comments(property_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- ============================================
-- LIKES
-- ============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================
-- CHECKINS
-- ============================================
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================
-- USER_SUBMISSIONS (제보)
-- ============================================
CREATE TABLE user_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  celebrity_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_user_submissions_status ON user_submissions(status);

-- ============================================
-- QUIZ_ATTEMPTS
-- ============================================
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_score ON quiz_attempts(score DESC);

-- ============================================
-- VIEWS
-- ============================================
CREATE VIEW v_multi_owner_celebrities AS
SELECT
  id,
  name,
  category,
  property_count,
  total_asset_value,
  profile_image_url
FROM celebrities
WHERE property_count >= 2
ORDER BY property_count DESC, total_asset_value DESC;

CREATE VIEW v_neighborhood_density AS
SELECT
  p.dong_code,
  SPLIT_PART(p.address, ' ', 1) || ' ' || SPLIT_PART(p.address, ' ', 2) || ' ' || SPLIT_PART(p.address, ' ', 3) AS address_prefix,
  COUNT(DISTINCT cp.celebrity_id) AS celebrity_count,
  COUNT(DISTINCT p.id) AS property_count
FROM properties p
JOIN celebrity_properties cp ON cp.property_id = p.id
WHERE cp.ownership_type = 'owner'
GROUP BY p.dong_code, address_prefix
ORDER BY celebrity_count DESC;

-- ============================================
-- TRIGGERS: Auto-update celebrity property_count & total_asset_value
-- ============================================
CREATE OR REPLACE FUNCTION update_celebrity_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update for the celebrity affected by INSERT or DELETE
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE celebrities SET
      property_count = (
        SELECT COUNT(*) FROM celebrity_properties
        WHERE celebrity_id = NEW.celebrity_id AND ownership_type = 'owner'
      ),
      total_asset_value = (
        SELECT COALESCE(SUM(
          COALESCE(cp.acquisition_price, p.latest_transaction_price, 0)
        ), 0)
        FROM celebrity_properties cp
        JOIN properties p ON p.id = cp.property_id
        WHERE cp.celebrity_id = NEW.celebrity_id AND cp.ownership_type = 'owner'
      ),
      updated_at = NOW()
    WHERE id = NEW.celebrity_id;
  END IF;

  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.celebrity_id != NEW.celebrity_id) THEN
    UPDATE celebrities SET
      property_count = (
        SELECT COUNT(*) FROM celebrity_properties
        WHERE celebrity_id = OLD.celebrity_id AND ownership_type = 'owner'
      ),
      total_asset_value = (
        SELECT COALESCE(SUM(
          COALESCE(cp.acquisition_price, p.latest_transaction_price, 0)
        ), 0)
        FROM celebrity_properties cp
        JOIN properties p ON p.id = cp.property_id
        WHERE cp.celebrity_id = OLD.celebrity_id AND cp.ownership_type = 'owner'
      ),
      updated_at = NOW()
    WHERE id = OLD.celebrity_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_celebrity_stats
AFTER INSERT OR UPDATE OR DELETE ON celebrity_properties
FOR EACH ROW EXECUTE FUNCTION update_celebrity_stats();

-- ============================================
-- TRIGGERS: Auto-update property social counts
-- ============================================
CREATE OR REPLACE FUNCTION update_property_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET comment_count = comment_count + 1 WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET comment_count = comment_count - 1 WHERE id = OLD.property_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_property_comment_count();

CREATE OR REPLACE FUNCTION update_property_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET like_count = like_count + 1 WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET like_count = like_count - 1 WHERE id = OLD.property_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_property_like_count();

CREATE OR REPLACE FUNCTION update_property_checkin_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET checkin_count = checkin_count + 1 WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET checkin_count = checkin_count - 1 WHERE id = OLD.property_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_checkin_count
AFTER INSERT OR DELETE ON checkins
FOR EACH ROW EXECUTE FUNCTION update_property_checkin_count();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE celebrity_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read celebrities" ON celebrities FOR SELECT USING (true);
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read celebrity_properties" ON celebrity_properties FOR SELECT USING (true);
CREATE POLICY "Public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth toggle likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth read own likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Auth delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth toggle checkins" ON checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth read checkins" ON checkins FOR SELECT USING (true);
CREATE POLICY "Auth delete own checkins" ON checkins FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth submit" ON user_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth read own submissions" ON user_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Auth insert quiz" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public read quiz" ON quiz_attempts FOR SELECT USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_celebrities_updated_at BEFORE UPDATE ON celebrities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
