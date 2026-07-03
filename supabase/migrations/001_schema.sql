-- ═══════════════════════════════════════════════════════════
--  J+ Jaidad Group — Complete Database Schema
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────
CREATE TYPE property_purpose AS ENUM ('sale', 'rent', 'construction');
CREATE TYPE property_status  AS ENUM ('available', 'sold', 'rented', 'under_construction', 'off_plan');
CREATE TYPE property_type    AS ENUM ('residential', 'commercial', 'apartment', 'plot', 'agricultural', 'industrial', 'farmhouse', 'shop', 'office', 'warehouse', 'building');
CREATE TYPE area_unit        AS ENUM ('marla', 'kanal', 'sqft', 'sqm', 'sqyd');
CREATE TYPE blog_status      AS ENUM ('draft', 'published', 'archived');
CREATE TYPE inquiry_status   AS ENUM ('new', 'in_progress', 'resolved', 'closed');
CREATE TYPE project_status   AS ENUM ('completed', 'ongoing', 'upcoming');
CREATE TYPE gallery_type     AS ENUM ('image', 'video');

-- ─── CITIES ─────────────────────────────────────────────────
CREATE TABLE cities (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  province   TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true
);

-- ─── SOCIETIES ──────────────────────────────────────────────
CREATE TABLE societies (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      TEXT NOT NULL,
  city_id   UUID REFERENCES cities(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ─── AGENTS ─────────────────────────────────────────────────
CREATE TABLE agents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  designation      TEXT NOT NULL DEFAULT 'Property Advisor',
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT NOT NULL,
  whatsapp         TEXT,
  image            TEXT,
  bio              TEXT,
  languages        TEXT[]  NOT NULL DEFAULT '{}',
  specializations  TEXT[]  NOT NULL DEFAULT '{}',
  social_links     JSONB   NOT NULL DEFAULT '{}',
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PROPERTIES ─────────────────────────────────────────────
CREATE TABLE properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  property_type     property_type    NOT NULL,
  property_purpose  property_purpose NOT NULL,
  property_status   property_status  NOT NULL DEFAULT 'available',
  price             NUMERIC(15,2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'PKR',
  area              NUMERIC(10,2) NOT NULL,
  area_unit         area_unit NOT NULL DEFAULT 'marla',
  bedrooms          SMALLINT,
  bathrooms         SMALLINT,
  garage            SMALLINT,
  kitchen           SMALLINT,
  year_built        SMALLINT,
  city_id           UUID REFERENCES cities(id),
  society_id        UUID REFERENCES societies(id),
  address           TEXT NOT NULL,
  latitude          NUMERIC(9,6),
  longitude         NUMERIC(9,6),
  images            TEXT[]  NOT NULL DEFAULT '{}',
  videos            TEXT[]  NOT NULL DEFAULT '{}',
  floor_plans       TEXT[]  NOT NULL DEFAULT '{}',
  brochure_url      TEXT,
  tour_360_url      TEXT,
  features          TEXT[]  NOT NULL DEFAULT '{}',
  amenities         TEXT[]  NOT NULL DEFAULT '{}',
  nearby_places     JSONB   NOT NULL DEFAULT '[]',
  agent_id          UUID REFERENCES agents(id),
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  view_count        INTEGER NOT NULL DEFAULT 0,
  meta_title        TEXT,
  meta_description  TEXT,
  tags              TEXT[]  NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_type    ON properties(property_type);
CREATE INDEX idx_properties_purpose ON properties(property_purpose);
CREATE INDEX idx_properties_status  ON properties(property_status);
CREATE INDEX idx_properties_city    ON properties(city_id);
CREATE INDEX idx_properties_price   ON properties(price);
CREATE INDEX idx_properties_featured ON properties(is_featured) WHERE is_active = true;
CREATE INDEX idx_properties_slug    ON properties(slug);

-- ─── PROJECTS ───────────────────────────────────────────────
CREATE TABLE projects (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                 TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  description           TEXT,
  project_status        project_status NOT NULL DEFAULT 'upcoming',
  location              TEXT NOT NULL,
  city_id               UUID REFERENCES cities(id),
  images                TEXT[] NOT NULL DEFAULT '{}',
  videos                TEXT[] NOT NULL DEFAULT '{}',
  completion_date       DATE,
  completion_percentage SMALLINT DEFAULT 0,
  total_units           INTEGER,
  available_units       INTEGER,
  starting_price        NUMERIC(15,2),
  investment_details    TEXT,
  timeline              JSONB NOT NULL DEFAULT '[]',
  downloads             JSONB NOT NULL DEFAULT '[]',
  is_featured           BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── CONSTRUCTION SERVICES ──────────────────────────────────
CREATE TABLE construction_services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  image       TEXT,
  features    TEXT[]  NOT NULL DEFAULT '{}',
  packages    JSONB   NOT NULL DEFAULT '[]',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── BLOG AUTHORS ────────────────────────────────────────────
CREATE TABLE blog_authors (
  id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name   TEXT NOT NULL,
  bio    TEXT,
  image  TEXT,
  email  TEXT UNIQUE
);

-- ─── BLOGS ──────────────────────────────────────────────────
CREATE TABLE blogs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  cover_image      TEXT,
  author_id        UUID REFERENCES blog_authors(id),
  category         TEXT NOT NULL,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  status           blog_status NOT NULL DEFAULT 'draft',
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  view_count       INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blogs_status   ON blogs(status);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_slug     ON blogs(slug);

-- ─── TESTIMONIALS ───────────────────────────────────────────
CREATE TABLE testimonials (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               TEXT NOT NULL,
  designation        TEXT,
  company            TEXT,
  image              TEXT,
  video_url          TEXT,
  rating             SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review             TEXT NOT NULL,
  property_purchased TEXT,
  is_featured        BOOLEAN NOT NULL DEFAULT false,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── GALLERY ────────────────────────────────────────────────
CREATE TABLE gallery_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  type        gallery_type NOT NULL DEFAULT 'image',
  url         TEXT NOT NULL,
  thumbnail   TEXT,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── INQUIRIES ──────────────────────────────────────────────
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  message      TEXT NOT NULL,
  property_id  UUID REFERENCES properties(id),
  inquiry_type TEXT NOT NULL DEFAULT 'general',
  status       inquiry_status NOT NULL DEFAULT 'new',
  source       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);

-- ─── FAQS ───────────────────────────────────────────────────
CREATE TABLE faqs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'general',
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── SITE SETTINGS ──────────────────────────────────────────
CREATE TABLE site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT UNIQUE NOT NULL,
  value      JSONB NOT NULL DEFAULT 'null',
  "group"    TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated_at   BEFORE UPDATE ON projects   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blogs_updated_at      BEFORE UPDATE ON blogs      FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE properties          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities              ENABLE ROW LEVEL SECURITY;
ALTER TABLE societies           ENABLE ROW LEVEL SECURITY;

-- Public can read active/published content
CREATE POLICY "Public read properties"     ON properties           FOR SELECT USING (is_active = true);
CREATE POLICY "Public read projects"       ON projects             FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services"       ON construction_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read blogs"          ON blogs                FOR SELECT USING (status = 'published');
CREATE POLICY "Public read testimonials"   ON testimonials         FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery"        ON gallery_items        FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faqs"           ON faqs                 FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings"       ON site_settings        FOR SELECT USING (true);
CREATE POLICY "Public read agents"         ON agents               FOR SELECT USING (is_active = true);
CREATE POLICY "Public read cities"         ON cities               FOR SELECT USING (is_active = true);
CREATE POLICY "Public read societies"      ON societies            FOR SELECT USING (is_active = true);

-- Public can insert inquiries
CREATE POLICY "Public insert inquiries"    ON inquiries            FOR INSERT WITH CHECK (true);

-- Admin (authenticated) can do everything
CREATE POLICY "Admin all properties"       ON properties           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects"         ON projects             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all services"         ON construction_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all blogs"            ON blogs                FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all testimonials"     ON testimonials         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery"          ON gallery_items        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all inquiries"        ON inquiries            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all faqs"             ON faqs                 FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings"         ON site_settings        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all agents"           ON agents               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all cities"           ON cities               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all societies"        ON societies            FOR ALL USING (auth.role() = 'authenticated');
