-- Add phone number field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text UNIQUE;

-- Update existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admin can manage users" ON users;

-- Create updated policies
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
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Create phone verification table
CREATE TABLE IF NOT EXISTS phone_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on phone verification
ALTER TABLE phone_verification ENABLE ROW LEVEL SECURITY;

-- Add phone verification policies
CREATE POLICY "Users can verify own phone"
  ON phone_verification
  FOR ALL
  TO authenticated
  USING (phone = (SELECT phone FROM users WHERE id = auth.uid()));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verification_phone ON phone_verification(phone);