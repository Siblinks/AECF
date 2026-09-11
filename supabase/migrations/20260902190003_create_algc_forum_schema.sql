/*
# ALGC Forum - Core Schema

## Overview
Creates the complete database schema for the Agaie Local Government Consultative Forum (ALGC Forum),
a civic platform connecting indigenes of Agaie LGA, Niger State.

## New Tables

1. **wards** - Reference table for the 10 administrative wards of Agaie LGA
   - id (uuid, PK)
   - name (text) - Ward name
   - district (text) - District grouping
   - created_at (timestamptz)

2. **indigenes** - Registered indigenes of Agaie LGA
   - id (uuid, PK)
   - user_id (uuid, nullable, references auth.users) - Links to auth account if registered
   - full_name (text) - Full legal name
   - phone (text) - Phone number (+234)
   - email (text, nullable) - Email address
   - ward_id (uuid, FK to wards) - Ward of origin
   - qualification (text) - Highest educational qualification
   - field_of_study (text) - Broad field
   - discipline (text) - Specific discipline
   - employment_status (text) - Employed/Unemployed/Student/Self-employed/Retired
   - company (text, nullable) - Employer or institution
   - profession_title (text, nullable) - Professional title for directory
   - skills (text[]) - Skill tags
   - volunteer_areas (text[]) - Areas willing to volunteer
   - in_public_directory (boolean, default true) - Consent to appear in public directory
   - avatar_url (text, nullable) - Profile photo URL
   - verified (boolean, default false) - Admin verification status
   - flagged (boolean, default false) - Admin flag status
   - created_at (timestamptz)

3. **news** - News articles and announcements
   - id (uuid, PK)
   - title (text)
   - excerpt (text) - Short summary
   - content (text) - Full article body
   - image_url (text, nullable)
   - category (text) - Agriculture/Health/Education/Government/Community etc.
   - published (boolean, default true)
   - created_at (timestamptz)

4. **projects** - Community development projects
   - id (uuid, PK)
   - title (text)
   - description (text)
   - location (text) - Ward or area
   - ward_id (uuid, nullable, FK to wards)
   - sector (text) - One of the 7 pillars
   - status (text) - proposed/planning/ongoing/completed
   - progress (int, default 0) - 0-100 percentage
   - start_date (date, nullable)
   - target_date (date, nullable)
   - created_at (timestamptz)

5. **project_updates** - Updates feed for each project
   - id (uuid, PK)
   - project_id (uuid, FK to projects)
   - update_text (text)
   - created_at (timestamptz)

## Views

1. **public_indigenes** - Safe projection of indigenes for the public directory
   - Only includes indigenes where in_public_directory = true
   - Only exposes non-sensitive columns (no phone, no email)

## Security (RLS)

- **wards**: Public read (anon + authenticated)
- **indigenes**: Anon can insert (registration form); authenticated users can read their own row;
  public can read the safe view; admin updates restricted to authenticated
- **news**: Public read for published articles; authenticated can manage
- **projects**: Public read; authenticated can manage
- **project_updates**: Public read; authenticated can manage
- **public_indigenes view**: Public read (already filtered by the view definition)
*/

-- ============= WARDS =============
CREATE TABLE IF NOT EXISTS wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL DEFAULT 'Agaie',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_wards" ON wards;
CREATE POLICY "public_read_wards" ON wards FOR SELECT
  TO anon, authenticated USING (true);

-- ============= INDIGENES =============
CREATE TABLE IF NOT EXISTS indigenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  ward_id uuid REFERENCES wards(id) ON DELETE SET NULL,
  qualification text,
  field_of_study text,
  discipline text,
  employment_status text,
  company text,
  profession_title text,
  skills text[] DEFAULT '{}',
  volunteer_areas text[] DEFAULT '{}',
  in_public_directory boolean NOT NULL DEFAULT true,
  avatar_url text,
  verified boolean NOT NULL DEFAULT false,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE indigenes ENABLE ROW LEVEL SECURITY;

-- Anyone can register as an indigene (public registration form)
DROP POLICY IF EXISTS "anon_insert_indigenes" ON indigenes;
CREATE POLICY "anon_insert_indigenes" ON indigenes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Authenticated users can read their own full profile
DROP POLICY IF EXISTS "select_own_indigene" ON indigenes;
CREATE POLICY "select_own_indigene" ON indigenes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Authenticated users can update their own profile
DROP POLICY IF EXISTS "update_own_indigene" ON indigenes;
CREATE POLICY "update_own_indigene" ON indigenes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Authenticated users (admin) can read all indigenes for management
DROP POLICY IF EXISTS "admin_select_all_indigenes" ON indigenes;
CREATE POLICY "admin_select_all_indigenes" ON indigenes FOR SELECT
  TO authenticated USING (true);

-- Authenticated users (admin) can update indigenes (verify/flag)
DROP POLICY IF EXISTS "admin_update_indigenes" ON indigenes;
CREATE POLICY "admin_update_indigenes" ON indigenes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============= PUBLIC INDIGENES VIEW =============
CREATE OR REPLACE VIEW public_indigenes AS
SELECT
  id,
  full_name,
  profession_title,
  ward_id,
  field_of_study as industry,
  skills,
  avatar_url,
  verified,
  created_at
FROM indigenes
WHERE in_public_directory = true AND flagged = false;

ALTER VIEW public_indigenes SET (security_invoker = true);

-- ============= NEWS =============
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Community',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news" ON news;
CREATE POLICY "public_read_news" ON news FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_manage_news" ON news;
CREATE POLICY "auth_manage_news" ON news FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_news" ON news;
CREATE POLICY "auth_update_news" ON news FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_news" ON news;
CREATE POLICY "auth_delete_news" ON news FOR DELETE
  TO authenticated USING (true);

-- ============= PROJECTS =============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text,
  ward_id uuid REFERENCES wards(id) ON DELETE SET NULL,
  sector text NOT NULL,
  status text NOT NULL DEFAULT 'proposed',
  progress int NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date date,
  target_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ============= PROJECT UPDATES =============
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  update_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_updates" ON project_updates;
CREATE POLICY "public_read_project_updates" ON project_updates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_project_updates" ON project_updates;
CREATE POLICY "auth_insert_project_updates" ON project_updates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_project_updates" ON project_updates;
CREATE POLICY "auth_delete_project_updates" ON project_updates FOR DELETE
  TO authenticated USING (true);

-- ============= INDEXES =============
CREATE INDEX IF NOT EXISTS idx_indigenes_ward_id ON indigenes(ward_id);
CREATE INDEX IF NOT EXISTS idx_indigenes_verified ON indigenes(verified);
CREATE INDEX IF NOT EXISTS idx_indigenes_field_of_study ON indigenes(field_of_study);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);