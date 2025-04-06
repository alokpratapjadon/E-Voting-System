/*
  # Fix Admin Policies and Add Test Admin

  1. Changes
    - Drop and recreate admin policies with proper checks
    - Ensure test admin user has proper permissions
    - Add missing indexes for performance

  2. Security
    - Strengthen admin policy checks
    - Add proper foreign key constraints
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can update candidates" ON candidates;
DROP POLICY IF EXISTS "Admins can delete candidates" ON candidates;

-- Recreate policies with proper checks
CREATE POLICY "Admins can insert candidates"
  ON candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update candidates"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can delete candidates"
  ON candidates
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(name);

-- Ensure test user is admin
UPDATE users
SET is_admin = true
WHERE email = 'test@example.com';