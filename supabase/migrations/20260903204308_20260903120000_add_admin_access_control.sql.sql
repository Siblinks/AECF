/*
# Admin Access Control for ALGC Forum

## Overview
Adds an admin allowlist table and a helper function so the application can
distinguish administrators from regular registered indigenes. Tightens RLS
policies so only designated admins can manage news, projects, and indigene
verification — not just any logged-in user.

## New Objects

1. **admins** — small allowlist table linking auth.users to admin privileges
   - user_id (uuid, PK, references auth.users ON DELETE CASCADE)
   - created_at (timestamptz)

2. **is_current_user_admin()** — SECURITY DEFINER function
   Returns true when the calling session's auth.uid() appears in the admins
   table. Used by RLS policies and by the frontend to gate the admin portal.

## Security Changes (RLS)

- **admins**: Only admins can read the table. No INSERT/UPDATE/DELETE through
  the data API — admin records are managed via SQL/Supabase dashboard only.
- **indigenes**: SELECT narrowed so authenticated non-admins can read only
  their own row. Admins can read all rows. UPDATE restricted to admins for
  verification/flagging; users can still update their own profile row.
- **news**: INSERT/UPDATE/DELETE restricted to admins only. Public SELECT unchanged.
- **projects**: INSERT/UPDATE/DELETE restricted to admins only. Public SELECT unchanged.
- **project_updates**: INSERT/DELETE restricted to admins only. Public SELECT unchanged.

## Important Notes
1. To grant someone admin access, insert their auth.users ID into the admins
   table: `INSERT INTO admins (user_id) VALUES ('<uuid>');`
2. The is_current_user_admin() function is SECURITY DEFINER so it can read
   the admins table even when the caller's RLS would deny it.
3. Regular indigenes who register and log in will NOT see the admin panel.
*/

-- ============= ADMINS TABLE (must exist before function references it) =============
CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ============= IS_CURRENT_USER_ADMIN FUNCTION =============
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_current_user_admin FROM anon;
GRANT EXECUTE ON FUNCTION is_current_user_admin TO authenticated;

-- ============= ADMINS POLICIES =============
-- Only admins can read the admins table (to verify their own status)
DROP POLICY IF EXISTS "admins_select_self" ON admins;
CREATE POLICY "admins_select_self" ON admins FOR SELECT
  TO authenticated USING (is_current_user_admin());

-- No INSERT/UPDATE/DELETE policies: admin records are managed via SQL only

-- ============= TIGHTEN INDIGENES POLICIES =============

-- Remove the overly broad "admin_select_all_indigenes" that let ANY authenticated user read all rows
DROP POLICY IF EXISTS "admin_select_all_indigenes" ON indigenes;

-- Admins can read all indigenes; regular users can read only their own row
DROP POLICY IF EXISTS "admin_select_all_indigenes_v2" ON indigenes;
CREATE POLICY "admin_select_all_indigenes_v2" ON indigenes FOR SELECT
  TO authenticated USING (is_current_user_admin() OR auth.uid() = user_id);

-- Replace the overly broad admin_update with admin-only (plus self-update)
DROP POLICY IF EXISTS "admin_update_indigenes" ON indigenes;
CREATE POLICY "admin_update_indigenes" ON indigenes FOR UPDATE
  TO authenticated
  USING (is_current_user_admin() OR auth.uid() = user_id)
  WITH CHECK (is_current_user_admin() OR auth.uid() = user_id);

-- ============= TIGHTEN NEWS POLICIES =============

DROP POLICY IF EXISTS "auth_manage_news" ON news;
CREATE POLICY "auth_insert_news" ON news FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "auth_update_news" ON news;
CREATE POLICY "auth_update_news" ON news FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "auth_delete_news" ON news;
CREATE POLICY "auth_delete_news" ON news FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- ============= TIGHTEN PROJECTS POLICIES =============

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- ============= TIGHTEN PROJECT UPDATES POLICIES =============

DROP POLICY IF EXISTS "auth_insert_project_updates" ON project_updates;
CREATE POLICY "auth_insert_project_updates" ON project_updates FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "auth_delete_project_updates" ON project_updates;
CREATE POLICY "auth_delete_project_updates" ON project_updates FOR DELETE
  TO authenticated USING (is_current_user_admin());
