-- Supabase 데이터베이스 설정 스크립트

-- 1. 관리자 테이블 생성
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 사이트 설정 테이블 생성
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 동호회 테이블 생성
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  dance_types TEXT[],
  google_calendar_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 라틴바 테이블 생성
CREATE TABLE latin_bars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  address TEXT NOT NULL,
  address_en TEXT,
  description TEXT,
  description_en TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  map_provider VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 소셜 링크 테이블 생성
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. 이미지 테이블 생성
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_data BYTEA,
  file_size INTEGER,
  mime_type VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. 수정 요청 테이블 생성
CREATE TABLE update_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  request_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  requested_by VARCHAR(255),
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. bcrypt 확장 설치
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 9. 관리자 비밀번호 검증 함수 생성
CREATE OR REPLACE FUNCTION verify_admin(
  p_email VARCHAR,
  p_password VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_hash VARCHAR;
BEGIN
  SELECT password INTO v_hash
  FROM admins
  WHERE email = p_email;

  IF v_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN crypt(p_password, v_hash) = v_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RLS 정책 설정
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE latin_bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_requests ENABLE ROW LEVEL SECURITY;

-- 사이트 설정 조회 정책 (누구나 조회 가능)
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- 사이트 설정 수정 정책 (관리자만)
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- 동호회 조회 정책 (승인된 것만)
CREATE POLICY "Public can view approved clubs"
  ON clubs FOR SELECT
  USING (status = 'approved');

-- 동호회 등록 정책 (누구나 등록 가능)
CREATE POLICY "Anyone can insert clubs"
  ON clubs FOR INSERT
  WITH CHECK (true);

-- 라틴바 조회 정책 (승인된 것만)
CREATE POLICY "Public can view approved bars"
  ON latin_bars FOR SELECT
  USING (status = 'approved');

-- 라틴바 등록 정책 (누구나 등록 가능)
CREATE POLICY "Anyone can insert bars"
  ON latin_bars FOR INSERT
  WITH CHECK (true);

-- 수정 요청 등록 정책 (누구나 등록 가능)
CREATE POLICY "Public can insert update requests"
  ON update_requests FOR INSERT
  WITH CHECK (true);

-- 수정 요청 조회 정책 (관리자만)
CREATE POLICY "Admins can view all update requests"
  ON update_requests FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- 수정 요청 수정 정책 (관리자만)
CREATE POLICY "Admins can update update requests"
  ON update_requests FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- 11. 초기 데이터 삽입
-- 관리자 오픈카톡 링크 설정
INSERT INTO site_settings (key, value, description)
VALUES 
  (
    'admin_openchat_url',
    'https://open.kakao.com/o/YOUR_CHAT_ID',
    '관리자 오픈카톡 링크'
  ),
  (
    'default_locale',
    'ko',
    '기본 언어 설정 (ko, en)'
  ),
  (
    'supported_locales',
    'ko,en',
    '지원하는 언어 목록'
  );

-- 관리자 계정 생성 (비밀번호: admin123)
-- bcrypt 해시: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO admins (email, password)
VALUES (
  'admin@latindance.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- 12. 기존 데이터 마이그레이션 (locale 필드 추가 후 실행)
-- 기존 clubs 테이블에 name_en 필드가 없는 경우 추가
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'clubs' AND column_name = 'name_en') THEN
    ALTER TABLE clubs ADD COLUMN name_en VARCHAR(255);
    ALTER TABLE clubs ADD COLUMN description TEXT;
    ALTER TABLE clubs ADD COLUMN description_en TEXT;
  END IF;
END $$;

-- 기존 latin_bars 테이블에 name_en 필드가 없는 경우 추가
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'latin_bars' AND column_name = 'name_en') THEN
    ALTER TABLE latin_bars ADD COLUMN name_en VARCHAR(255);
    ALTER TABLE latin_bars ADD COLUMN address_en TEXT;
    ALTER TABLE latin_bars ADD COLUMN description TEXT;
    ALTER TABLE latin_bars ADD COLUMN description_en TEXT;
  END IF;
END $$;
