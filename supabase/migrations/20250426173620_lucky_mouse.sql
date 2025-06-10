/*
  # Update Settings Table RLS Policies

  1. Changes
    - Remove existing settings policies
    - Add new policies that allow:
      - Anyone (including anon) to read election_config
      - Admin to manage all settings
      - Initial settings creation for election_config

  2. Security
    - Maintains admin-only access for most operations
    - Allows public read access only for election_config
    - Ensures initial settings can be created
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON settings;

-- Add new policies
CREATE POLICY "Anyone can view election config"
  ON settings
  FOR SELECT
  TO public
  USING (key = 'election_config');

CREATE POLICY "Admin can manage all settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Allow initial election config creation"
  ON settings
  FOR INSERT
  TO public
  WITH CHECK (
    key = 'election_config' AND
    NOT EXISTS (
      SELECT 1 
      FROM settings 
      WHERE key = 'election_config'
    )
  );