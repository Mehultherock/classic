-- ============================================
-- FIX: RLS Infinite Recursion
-- The admin-check policies query the `users` table
-- from within policies on `users` itself, causing
-- infinite recursion. Fix: use a security definer
-- helper function instead.
-- ============================================

-- Create a security definer function to check admin status
-- (This bypasses RLS because it runs with definer privileges)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND plan = 'enterprise'
  );
$$;

-- ============================================
-- Fix users table policies
-- ============================================
DROP POLICY IF EXISTS users_admin_read_all ON users;
CREATE POLICY users_admin_read_all ON users
  FOR SELECT USING (
    public.is_admin()
  );

-- ============================================
-- Fix templates table policies
-- ============================================
DROP POLICY IF EXISTS templates_admin_insert ON templates;
DROP POLICY IF EXISTS templates_admin_update ON templates;
DROP POLICY IF EXISTS templates_admin_delete ON templates;

CREATE POLICY templates_admin_insert ON templates
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY templates_admin_update ON templates
  FOR UPDATE USING (public.is_admin());

CREATE POLICY templates_admin_delete ON templates
  FOR DELETE USING (public.is_admin());

-- ============================================
-- Fix ai_generations table policies
-- ============================================
DROP POLICY IF EXISTS ai_generations_admin_select_all ON ai_generations;
CREATE POLICY ai_generations_admin_select_all ON ai_generations
  FOR SELECT USING (public.is_admin());

-- ============================================
-- Fix subscriptions table policies
-- ============================================
DROP POLICY IF EXISTS subscriptions_admin_select_all ON subscriptions;
CREATE POLICY subscriptions_admin_select_all ON subscriptions
  FOR SELECT USING (public.is_admin());

-- ============================================
-- Fix teams table policies
-- ============================================
DROP POLICY IF EXISTS teams_admin_update ON teams;
DROP POLICY IF EXISTS teams_admin_delete ON teams;

CREATE POLICY teams_admin_update ON teams
  FOR UPDATE USING (public.is_admin());

CREATE POLICY teams_admin_delete ON teams
  FOR DELETE USING (public.is_admin());

-- ============================================
-- Fix team_members table policies
-- ============================================
DROP POLICY IF EXISTS team_members_admin_insert ON team_members;
DROP POLICY IF EXISTS team_members_admin_update ON team_members;
DROP POLICY IF EXISTS team_members_admin_delete ON team_members;

CREATE POLICY team_members_admin_insert ON team_members
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY team_members_admin_update ON team_members
  FOR UPDATE USING (public.is_admin());

CREATE POLICY team_members_admin_delete ON team_members
  FOR DELETE USING (public.is_admin());

-- ============================================
-- Fix payments table policies
-- ============================================
DROP POLICY IF EXISTS payments_admin_select_all ON payments;
CREATE POLICY payments_admin_select_all ON payments
  FOR SELECT USING (public.is_admin());

-- ============================================
-- Fix get_user_plan function ambiguity
-- ============================================
DROP FUNCTION IF EXISTS public.get_user_plan(uuid);
CREATE OR REPLACE FUNCTION public.get_user_plan(target_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT plan FROM public.subscriptions WHERE user_id = target_user_id AND status = 'active' LIMIT 1),
    (SELECT plan FROM public.users WHERE id = target_user_id)
  );
$$;

-- ============================================
-- Fix is_team_member function — DROP then recreate with unique
-- param name to avoid ambiguity. Must be defined BEFORE any
-- policy that references it.
-- ============================================
DROP FUNCTION IF EXISTS public.is_team_member(uuid);
CREATE OR REPLACE FUNCTION public.is_team_member(target_team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = target_team_id
    AND user_id = auth.uid()
  );
$$;

-- ============================================
-- Fix: projects_select_team policy (references is_team_member)
-- ============================================
DROP POLICY IF EXISTS projects_select_team ON projects;
CREATE POLICY projects_select_team ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.owner_id = projects.user_id
      AND public.is_team_member(t.id)
    )
  );

-- ============================================
-- Fix: team_members select policy recursion (references is_team_member)
-- ============================================
DROP POLICY IF EXISTS team_members_select ON team_members;
CREATE POLICY team_members_select ON team_members
  FOR SELECT USING (
    public.is_team_member(team_id)
    OR EXISTS (
      SELECT 1 FROM public.teams WHERE id = team_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- Add missing INSERT policy for users table
-- Allows new users to create their own record
-- ============================================
CREATE POLICY users_insert_own ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- Sync auth.users → public.users on signup
-- Trigger that auto-creates public.user when auth user signs up
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
