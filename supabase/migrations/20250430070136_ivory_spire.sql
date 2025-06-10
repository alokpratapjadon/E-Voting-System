/*
  # Fix Settings Table RLS Policies - Recursion Fix

  1. Changes
    - Drop existing RLS policies for settings table
    - Create simplified policies that prevent recursion:
      - Public read access for election config
      - Public creation of initial election config
      - Admin management without recursive checks
  
  2. Security
    - Maintain RLS on settings table
    - Ensure proper access control
    - Fix infinite recursion issue
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view election config" ON settings;
DROP POLICY IF EXISTS "Public can create initial election config" ON settings;
DROP POLICY IF EXISTS "Admin can manage all settings" ON settings;

-- Create policy for public read access to election config
CREATE POLICY "Public can view election config" ON settings
FOR SELECT
TO public
USING (key = 'election_config');

-- Create policy for initial election config creation
CREATE POLICY "Public can create initial election config" ON settings
FOR INSERT
TO public
WITH CHECK (
  key = 'election_config' 
  AND NOT EXISTS (
    SELECT 1 FROM settings settings_1 
    WHERE settings_1.key = 'election_config'
  )
);

-- Create simplified admin policy without recursive checks
CREATE POLICY "Admin can manage all settings" ON settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);