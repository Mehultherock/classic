-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  plan TEXT CHECK (plan IN ('free', 'pro', 'enterprise')) DEFAULT 'free',
  email_verified BOOLEAN DEFAULT FALSE,
  ai_generations_today INT DEFAULT 0,
  last_generation_date TIMESTAMPTZ
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  description TEXT,
  type TEXT,
  thumbnail_url TEXT,
  width INT,
  height INT,
  elements JSONB DEFAULT '[]'::jsonb,
  ai_generated BOOLEAN DEFAULT FALSE,
  template_id TEXT,
  folder_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  type TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  width INT,
  height INT,
  elements JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  premium BOOLEAN DEFAULT FALSE,
  popular BOOLEAN DEFAULT FALSE,
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  result JSONB,
  model TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT,
  event_name TEXT,
  event_date DATE,
  event_time TIME,
  venue TEXT,
  theme TEXT,
  color_palette JSONB DEFAULT '[]'::jsonb,
  style_preference TEXT,
  custom_instructions TEXT,
  project_id UUID,
  rsvp_enabled BOOLEAN DEFAULT FALSE,
  qr_enabled BOOLEAN DEFAULT FALSE,
  share_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  status TEXT CHECK (status IN ('accepted', 'declined', 'pending')) DEFAULT 'pending',
  guests_count INT DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  payment_method TEXT,
  payment_intent_id TEXT UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_users INT DEFAULT 0,
  new_users INT DEFAULT 0,
  active_users INT DEFAULT 0,
  total_projects INT DEFAULT 0,
  ai_generations INT DEFAULT 0,
  downloads INT DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  conversions INT DEFAULT 0
);

CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_folder_id ON projects(folder_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_premium ON templates(premium);
CREATE INDEX idx_templates_popular ON templates(popular);

CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at DESC);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_event_date ON invitations(event_date);

CREATE INDEX idx_rsvp_responses_invitation_id ON rsvp_responses(invitation_id);

CREATE INDEX idx_teams_owner_id ON teams(owner_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(read);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);

CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_project_id ON downloads(project_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ADMIN CHECK FUNCTION (security definer to avoid RLS recursion)
-- ============================================

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
-- TEAM MEMBER CHECK FUNCTION (security definer to avoid RLS recursion)
-- ============================================

CREATE OR REPLACE FUNCTION public.is_team_member(team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = is_team_member.team_id
    AND user_id = auth.uid()
  );
$$;

-- ============================================
-- SYNC FUNCTION: auth.users → public.users
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

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users
CREATE POLICY users_read_own ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY users_insert_own ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY users_admin_read_all ON users
  FOR SELECT USING (public.is_admin());

-- Projects
CREATE POLICY projects_insert_own ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY projects_select_own ON projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY projects_update_own ON projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY projects_delete_own ON projects
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY projects_select_team ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.owner_id = projects.user_id
      AND public.is_team_member(t.id)
    )
  );

-- Templates
CREATE POLICY templates_select_all ON templates
  FOR SELECT USING (TRUE);
CREATE POLICY templates_admin_insert ON templates
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY templates_admin_update ON templates
  FOR UPDATE USING (public.is_admin());
CREATE POLICY templates_admin_delete ON templates
  FOR DELETE USING (public.is_admin());

-- AI Generations
CREATE POLICY ai_generations_select_own ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_generations_insert_own ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ai_generations_admin_select_all ON ai_generations
  FOR SELECT USING (
    public.is_admin()
  );

-- Subscriptions
CREATE POLICY subscriptions_select_own ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY subscriptions_admin_select_all ON subscriptions
  FOR SELECT USING (
    public.is_admin()
  );

-- Teams
CREATE POLICY teams_select_member ON teams
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_id = id AND user_id = auth.uid())
    OR owner_id = auth.uid()
  );
CREATE POLICY teams_admin_update ON teams
  FOR UPDATE USING (
    public.is_admin()
  );
CREATE POLICY teams_admin_delete ON teams
  FOR DELETE USING (
    public.is_admin()
  );

-- Team Members
CREATE POLICY team_members_select ON team_members
  FOR SELECT USING (
    public.is_team_member(team_id)
    OR EXISTS (SELECT 1 FROM teams WHERE id = team_id AND owner_id = auth.uid())
  );
CREATE POLICY team_members_admin_insert ON team_members
  FOR INSERT WITH CHECK (
    public.is_admin()
  );
CREATE POLICY team_members_admin_update ON team_members
  FOR UPDATE USING (
    public.is_admin()
  );
CREATE POLICY team_members_admin_delete ON team_members
  FOR DELETE USING (
    public.is_admin()
  );

-- Notifications
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Payments
CREATE POLICY payments_select_own ON payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY payments_admin_select_all ON payments
  FOR SELECT USING (
    public.is_admin()
  );

-- Folders
CREATE POLICY folders_insert_own ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY folders_select_own ON folders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY folders_update_own ON folders
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY folders_delete_own ON folders
  FOR DELETE USING (auth.uid() = user_id);

-- Downloads
CREATE POLICY downloads_select_own ON downloads
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION increment_ai_generations(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET
    ai_generations_today = ai_generations_today + 1,
    last_generation_date = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_ai_generation_limit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  daily_limit INT;
  current_count INT;
BEGIN
  SELECT plan INTO user_plan FROM users WHERE id = user_id;

  daily_limit := CASE user_plan
    WHEN 'free' THEN 5
    WHEN 'pro' THEN 50
    WHEN 'enterprise' THEN 500
    ELSE 5
  END;

  SELECT ai_generations_today INTO current_count
  FROM users
  WHERE id = user_id
    AND last_generation_date::date = CURRENT_DATE;

  IF current_count IS NULL THEN
    RETURN TRUE;
  END IF;

  RETURN current_count < daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_plan(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (SELECT plan FROM subscriptions WHERE user_id = get_user_plan.user_id AND status = 'active' LIMIT 1),
      (SELECT plan FROM users WHERE id = get_user_plan.user_id)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_daily_generations(user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT ai_generations_today
    FROM users
    WHERE id = user_id
      AND last_generation_date::date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_analytics_daily()
RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics (date, total_users, new_users, active_users, total_projects, ai_generations, downloads)
  VALUES (
    CURRENT_DATE,
    (SELECT COUNT(*) FROM users),
    (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE),
    (SELECT COUNT(*) FROM users WHERE last_generation_date::date = CURRENT_DATE),
    (SELECT COUNT(*) FROM projects),
    (SELECT COUNT(*) FROM ai_generations WHERE created_at::date = CURRENT_DATE),
    (SELECT COUNT(*) FROM downloads WHERE created_at::date = CURRENT_DATE)
  )
  ON CONFLICT (date)
  DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    total_projects = EXCLUDED.total_projects,
    ai_generations = EXCLUDED.ai_generations,
    downloads = EXCLUDED.downloads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
