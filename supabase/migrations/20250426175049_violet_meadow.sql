/*
  # Initial Schema Setup for E-Voting Platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Supabase Auth user ID
      - `name` (text) - User's full name
      - `voter_id` (text) - Unique voter identification number
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `candidates`
      - `id` (uuid, primary key)
      - `name` (text) - Candidate's full name
      - `party` (text) - Political party affiliation
      - `position` (text) - Position running for
      - `image_url` (text) - Profile image URL
      - `bio` (text) - Candidate biography
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `candidate_id` (uuid) - References candidates.id
      - `created_at` (timestamp)
      
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text) - Setting key
      - `value` (jsonb) - Setting value
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users
    - Add policies for public access to settings
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  name text NOT NULL,
  voter_id text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  party text NOT NULL,
  position text NOT NULL,
  image_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id) -- Ensure one vote per user
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Admin can manage users" ON users;
  
  -- Candidates policies
  DROP POLICY IF EXISTS "Anyone can view candidates" ON candidates;
  DROP POLICY IF EXISTS "Admin can manage candidates" ON candidates;
  
  -- Votes policies
  DROP POLICY IF EXISTS "Users can view all votes" ON votes;
  DROP POLICY IF EXISTS "Users can insert own vote" ON votes;
  
  -- Settings policies
  DROP POLICY IF EXISTS "Public can view election config" ON settings;
  DROP POLICY IF EXISTS "Public can create initial election config" ON settings;
  DROP POLICY IF EXISTS "Admin can manage all settings" ON settings;
END $$;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage users"
  ON users
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Candidates policies
CREATE POLICY "Anyone can view candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage candidates"
  ON candidates
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Votes policies
CREATE POLICY "Users can view all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own vote"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Public can view election config"
  ON settings
  FOR SELECT
  TO public
  USING (key = 'election_config');

CREATE POLICY "Public can create initial election config"
  ON settings
  FOR INSERT
  TO public
  WITH CHECK (
    key = 'election_config' 
    AND NOT EXISTS (
      SELECT 1 FROM settings WHERE key = 'election_config'
    )
  );

CREATE POLICY "Admin can manage all settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('election_config', '{"isVotingOpen": true, "showResults": true, "electionTitle": "General Election 2025", "electionDescription": "Vote for the candidate who will represent your interests."}'::jsonb)
ON CONFLICT (key) DO NOTHING;