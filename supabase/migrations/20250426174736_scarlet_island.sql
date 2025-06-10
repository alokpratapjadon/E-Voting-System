/*
  # Fix settings table RLS policies - Final Update

  1. Changes
    - Drop existing RLS policies for settings table
    - Create new policies that properly handle:
      - Public read access for election config
      - Initial settings creation by public users
      - Admin management of all settings
  
  2. Security
    - Maintain RLS on settings table
    - Add policies for:
      - Public can view election config
      - Public can create initial election config if none exists
      - Admin can manage all settings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage all settings" ON settings;
DROP POLICY IF EXISTS "Allow initial election config creation" ON settings;
DROP POLICY IF EXISTS "Anyone can view election config" ON settings;

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
    SELECT 1 FROM settings WHERE key = 'election_config'
  )
);

-- Create policy for admin management
CREATE POLICY "Admin can manage all settings" ON settings
FOR ALL
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