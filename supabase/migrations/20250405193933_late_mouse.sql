/*
  # E-Voting System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key): User's unique identifier
      - `email` (text): User's email address
      - `full_name` (text): User's full name
      - `created_at` (timestamp): Account creation timestamp
    
    - `candidates`
      - `id` (uuid, primary key): Candidate's unique identifier
      - `name` (text): Candidate's full name
      - `party` (text): Political party affiliation
      - `image_url` (text): URL to candidate's photo
      - `created_at` (timestamp): Record creation timestamp
    
    - `votes`
      - `id` (uuid, primary key): Vote unique identifier
      - `user_id` (uuid): Reference to the voter
      - `candidate_id` (uuid): Reference to the selected candidate
      - `created_at` (timestamp): Vote timestamp

  2. Security
    - Enable RLS on all tables
    - Policies:
      - Users can only read their own data
      - Users can only vote once
      - Everyone can read candidates
      - Vote counts are public but individual votes are private
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  party text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" 
  ON users
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
  ON users
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Candidates policies
CREATE POLICY "Anyone can read candidates" 
  ON candidates
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Votes policies
CREATE POLICY "Users can insert their own vote" 
  ON votes
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own vote" 
  ON votes
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Insert sample candidates
INSERT INTO candidates (name, party, image_url) VALUES
  ('Jane Smith', 'Progressive Party', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'),
  ('John Doe', 'Conservative Party', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Sarah Johnson', 'Liberal Party', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200');