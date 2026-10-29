-- Sports Club Management System - Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to initialize your database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'member' CHECK(role IN ('admin', 'coach', 'member')),
  sport TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  date_of_birth DATE,
  join_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  description TEXT DEFAULT '',
  max_members INT DEFAULT 20,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position TEXT DEFAULT '',
  jersey_number TEXT DEFAULT '',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 4. EVENTS & MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('match', 'training', 'tournament', 'meeting', 'other')),
  sport TEXT DEFAULT '',
  description TEXT DEFAULT '',
  venue TEXT DEFAULT '',
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  team_id BIGINT REFERENCES public.teams(id) ON DELETE SET NULL,
  opponent TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  result TEXT DEFAULT '',
  score TEXT DEFAULT '',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'absent' CHECK(status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT DEFAULT '',
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 6. FEES & PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.fees (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('monthly', 'annual', 'registration', 'equipment', 'other')),
  description TEXT DEFAULT '',
  due_date DATE NOT NULL,
  paid_date DATE DEFAULT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'overdue', 'waived')),
  payment_method TEXT DEFAULT '',
  transaction_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.tournaments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  format TEXT DEFAULT 'knockout' CHECK(format IN ('knockout', 'league', 'round-robin', 'swiss')),
  description TEXT DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue TEXT DEFAULT '',
  max_teams INT DEFAULT 8,
  prize TEXT DEFAULT '',
  status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TOURNAMENT TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.tournament_teams (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  seed INT DEFAULT 0,
  UNIQUE(tournament_id, team_id)
);

-- 9. TOURNAMENT MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id BIGSERIAL PRIMARY KEY,
  tournament_id BIGINT NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INT NOT NULL,
  match_number INT NOT NULL,
  team1_id BIGINT REFERENCES public.teams(id) ON DELETE SET NULL,
  team2_id BIGINT REFERENCES public.teams(id) ON DELETE SET NULL,
  winner_id BIGINT REFERENCES public.teams(id) ON DELETE SET NULL,
  score TEXT DEFAULT '',
  match_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'scheduled', 'completed', 'walkover'))
);

-- 10. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK(category IN ('general', 'urgent', 'event', 'achievement', 'other')),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Simple public access policies (read and write allowed for authorized clients)
CREATE POLICY "Public Read Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public Teams Read" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public Teams Write" ON public.teams FOR ALL USING (true);

CREATE POLICY "Public Team Members Read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public Team Members Write" ON public.team_members FOR ALL USING (true);

CREATE POLICY "Public Events Read" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Events Write" ON public.events FOR ALL USING (true);

CREATE POLICY "Public Attendance Read" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Public Attendance Write" ON public.attendance FOR ALL USING (true);

CREATE POLICY "Public Fees Read" ON public.fees FOR SELECT USING (true);
CREATE POLICY "Public Fees Write" ON public.fees FOR ALL USING (true);

CREATE POLICY "Public Tournaments Read" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public Tournaments Write" ON public.tournaments FOR ALL USING (true);

CREATE POLICY "Public Matches Read" ON public.tournament_matches FOR SELECT USING (true);
CREATE POLICY "Public Matches Write" ON public.tournament_matches FOR ALL USING (true);

CREATE POLICY "Public Announcements Read" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public Announcements Write" ON public.announcements FOR ALL USING (true);

-- Insert Default Seed Data
INSERT INTO public.profiles (id, name, email, role, sport, phone, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin Director', 'admin@sportsclub.com', 'admin', 'Multi-Sport', '+1-555-0100', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'John Smith', 'john@example.com', 'member', 'Football', '+1-555-0101', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Sarah Connor', 'sarah@example.com', 'member', 'Basketball', '+1-555-0102', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'Mike Johnson', 'mike@example.com', 'coach', 'Football', '+1-555-0103', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'Emma Davis', 'emma@example.com', 'member', 'Tennis', '+1-555-0104', 'active'),
  ('66666666-6666-6666-6666-666666666666', 'Carlos Rivera', 'carlos@example.com', 'member', 'Cricket', '+1-555-0105', 'active'),
  ('77777777-7777-7777-7777-777777777777', 'Lisa Park', 'lisa@example.com', 'coach', 'Basketball', '+1-555-0106', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.teams (id, name, sport, coach_id, description, max_members) VALUES
  (1, 'Thunder Hawks', 'Football', '44444444-4444-4444-4444-444444444444', 'Premier Football First XI squad', 22),
  (2, 'Sky Blazers', 'Basketball', '77777777-7777-7777-7777-777777777777', 'Division 1 Basketball squad', 15),
  (3, 'Court Kings', 'Tennis', NULL, 'Varsity competitive tennis squad', 10),
  (4, 'Royal Strikers', 'Cricket', NULL, 'T20 & Weekend cricket squad', 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, position, jersey_number) VALUES
  (1, '22222222-2222-2222-2222-222222222222', 'Striker', '10'),
  (2, '33333333-3333-3333-3333-333333333333', 'Point Guard', '5'),
  (3, '55555555-5555-5555-5555-555555555555', 'Singles 1', '1'),
  (4, '66666666-6666-6666-6666-666666666666', 'All-Rounder', '7')
ON CONFLICT DO NOTHING;

INSERT INTO public.events (id, title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent, status) VALUES
  (1, 'Thunder Hawks vs Metro FC', 'match', 'Football', 'League championship match day', 'Main Stadium Pitch A', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', 1, 'Metro FC', 'scheduled'),
  (2, 'Weekly First XI Tactical Session', 'training', 'Football', 'Set piece drills and endurance conditioning', 'Practice Ground 2', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 1, '', 'scheduled'),
  (3, 'Sky Blazers vs City Knights', 'match', 'Basketball', 'Inter-city tournament clash', 'Arena Indoor Court 1', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 2 hours', 2, 'City Knights', 'scheduled'),
  (4, 'Club Annual General Meeting', 'meeting', 'All Sports', 'All athletes and coaching staff review', 'Grand Pavilion Hall', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 2 hours', NULL, '', 'scheduled')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fees (id, user_id, amount, type, description, due_date, status, payment_method, paid_date) VALUES
  (1, '22222222-2222-2222-2222-222222222222', 75.00, 'monthly', 'November Monthly Training Fee', CURRENT_DATE + 15, 'pending', '', NULL),
  (2, '33333333-3333-3333-3333-333333333333', 75.00, 'monthly', 'October Monthly Training Fee', CURRENT_DATE - 5, 'paid', 'Credit Card', CURRENT_DATE - 5),
  (3, '55555555-5555-5555-5555-555555555555', 600.00, 'annual', 'Annual Club Membership 2026', CURRENT_DATE + 30, 'pending', '', NULL),
  (4, '66666666-6666-6666-6666-666666666666', 75.00, 'monthly', 'September Fee', CURRENT_DATE - 20, 'overdue', '', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tournaments (id, name, sport, format, description, start_date, end_date, venue, max_teams, prize, status) VALUES
  (1, 'Premier Autumn Cup 2026', 'Football', 'knockout', 'Annual 8-team knockout trophy tournament', CURRENT_DATE + 10, CURRENT_DATE + 20, 'Olympic Arena', 8, '$2,500 + Cup', 'upcoming'),
  (2, 'Inter-Club Basketball League', 'Basketball', 'league', 'Season 5 Championship round', CURRENT_DATE - 10, CURRENT_DATE + 25, 'Sports Complex Hall A', 6, '$1,500', 'ongoing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tournament_matches (id, tournament_id, round, match_number, team1_id, team2_id, winner_id, score, status) VALUES
  (101, 1, 1, 1, 1, 4, 1, '3 - 1', 'completed'),
  (102, 1, 1, 2, 2, 3, 2, '2 - 0', 'completed'),
  (201, 1, 2, 1, 1, 2, NULL, '', 'scheduled'),
  (301, 1, 3, 1, NULL, NULL, NULL, '', 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.announcements (id, title, content, category, author_id, pinned) VALUES
  (1, 'Welcome to the Sports Club Management Portal!', 'Our newly upgraded club management portal powered by Supabase is live. Track fixtures, manage your squads, view fees, and monitor tournament standings in real-time.', 'general', '11111111-1111-1111-1111-111111111111', true),
  (2, 'Autumn Cup 2026 Registration Notice', 'Squad rosters for the Autumn Cup 2026 must be finalized with the head coaches by this Friday. Make sure medical clearance forms are submitted.', 'event', '44444444-4444-4444-4444-444444444444', false),
  (3, 'Thunder Hawks Regional Victory!', 'Congratulations to our Thunder Hawks for their hard-fought victory this past weekend. MVP honors went to our starting forward!', 'achievement', '11111111-1111-1111-1111-111111111111', false)
ON CONFLICT (id) DO NOTHING;

-- Optional Auth Link: Auto-create public.profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, sport, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(NEW.raw_user_meta_data->>'sport', 'Multi-Sport'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users (guarded against missing auth schema in test environments)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
