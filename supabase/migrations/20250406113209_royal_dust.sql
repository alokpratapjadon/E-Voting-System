/*
  # Add Admin Features

  1. Changes
    - Add is_admin column to users table
    - Add policies for admin operations on candidates table
    - Create test admin user

  2. Security
    - Only admins can create, update, or delete candidates
    - Regular users can only view candidates
*/

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update policies for candidates table
DROP POLICY IF EXISTS "Anyone can read candidates" ON candidates;

CREATE POLICY "Anyone can read candidates" 
  ON candidates FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert candidates" 
  ON candidates FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update candidates" 
  ON candidates FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can delete candidates" 
  ON candidates FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Make test user an admin
UPDATE users 
SET is_admin = true 
WHERE email = 'test@example.com';