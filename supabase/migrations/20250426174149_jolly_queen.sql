/*
  # Fix settings table RLS policies

  1. Changes
    - Drop existing RLS policies for settings table
    - Create new policies that properly handle:
      - Initial settings creation when table is empty
      - Admin management of settings
      - Public read access for election config
  
  2. Security
    - Enable RLS on settings table
    - Add policies for:
      - Public can create initial election config if none exists
      - Admin can manage all settings
      - Anyone can view election config
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage all settings" ON settings;
DROP POLICY IF EXISTS "Allow initial election config creation" ON settings;
DROP POLICY IF EXISTS "Anyone can view election config" ON settings;

-- Recreate policies with proper conditions
CREATE POLICY "Admin can manage all settings" ON settings
AS PERMISSIVE FOR ALL
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

CREATE POLICY "Allow initial election config creation" ON settings
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
  key = 'election_config' 
  AND NOT EXISTS (
    SELECT 1 FROM settings WHERE key = 'election_config'
  )
);

CREATE POLICY "Anyone can view election config" ON settings
AS PERMISSIVE FOR SELECT
TO authenticated
USING (key = 'election_config');