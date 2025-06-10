/*
  # Complete E-Voting Platform Database Setup

  1. New Tables
    - `users` - User profiles with phone verification
    - `candidates` - Election candidates
    - `votes` - Vote records
    - `settings` - Election configuration
    - `phone_verification` - Phone verification codes

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies
    - Support for phone authentication

  3. Functions
    - Phone verification helpers
    - Vote counting functions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS phone_verification CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  voter_id text UNIQUE NOT NULL,
  phone text UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE candidates (
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
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id) -- Ensure one vote per user
);

-- Create settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create phone verification table
CREATE TABLE phone_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_voter_id ON users(voter_id);
CREATE INDEX idx_phone_verification_phone ON phone_verification(phone);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_settings_key ON settings(key);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verification ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.id = auth.uid() AND users_1.is_admin = true
  ));

-- Candidates policies
CREATE POLICY "Anyone can view candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage candidates"
  ON candidates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.is_admin = true
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
      SELECT 1 FROM settings settings_1
      WHERE settings_1.key = 'election_config'
    )
  );

CREATE POLICY "Admin can manage all settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Phone verification policies
CREATE POLICY "Users can verify own phone"
  ON phone_verification
  FOR ALL
  TO authenticated
  USING (phone = (
    SELECT users.phone
    FROM users
    WHERE users.id = auth.uid()
  ));

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('election_config', '{
    "isVotingOpen": true, 
    "showResults": true, 
    "electionTitle": "General Election 2025", 
    "electionDescription": "Vote for the candidate who will represent your interests."
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert sample candidates
INSERT INTO candidates (name, party, position, bio, image_url) VALUES
  (
    'John Smith',
    'Democratic Party',
    'President',
    'Experienced leader with 20 years in public service, focusing on healthcare reform and economic growth.',
    'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
  ),
  (
    'Sarah Johnson',
    'Republican Party',
    'President',
    'Business executive turned politician, advocating for fiscal responsibility and job creation.',
    'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400'
  ),
  (
    'Michael Davis',
    'Independent',
    'President',
    'Former military officer committed to transparency, national security, and bipartisan cooperation.',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  )
ON CONFLICT DO NOTHING;

-- Insert admin user (you'll need to update this with actual auth user ID)
-- This is a placeholder - you'll need to create the auth user first, then update this
INSERT INTO users (id, name, voter_id, is_admin, phone) VALUES
  (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual auth user ID
    'Admin User',
    'ADMIN001',
    true,
    '+1234567890'
  )
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  name = EXCLUDED.name,
  voter_id = EXCLUDED.voter_id,
  phone = EXCLUDED.phone;

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS text AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create phone verification
CREATE OR REPLACE FUNCTION create_phone_verification(phone_number text)
RETURNS text AS $$
DECLARE
  verification_code text;
BEGIN
  verification_code := generate_verification_code();
  
  -- Delete existing verification codes for this phone
  DELETE FROM phone_verification WHERE phone = phone_number;
  
  -- Insert new verification code
  INSERT INTO phone_verification (phone, code, expires_at)
  VALUES (phone_number, verification_code, now() + interval '10 minutes');
  
  RETURN verification_code;
END;
$$ LANGUAGE plpgsql;

-- Function to verify phone code
CREATE OR REPLACE FUNCTION verify_phone_code(phone_number text, code text)
RETURNS boolean AS $$
DECLARE
  is_valid boolean := false;
BEGIN
  -- Check if code is valid and not expired
  SELECT EXISTS(
    SELECT 1 FROM phone_verification 
    WHERE phone = phone_number 
    AND code = code 
    AND expires_at > now()
    AND verified = false
  ) INTO is_valid;
  
  IF is_valid THEN
    -- Mark as verified
    UPDATE phone_verification 
    SET verified = true 
    WHERE phone = phone_number AND code = code;
  END IF;
  
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql;

-- Function to get vote counts
CREATE OR REPLACE FUNCTION get_vote_counts()
RETURNS TABLE(candidate_id uuid, vote_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as candidate_id,
    COALESCE(COUNT(v.id), 0) as vote_count
  FROM candidates c
  LEFT JOIN votes v ON c.id = v.candidate_id
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has voted
CREATE OR REPLACE FUNCTION user_has_voted(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM votes WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();