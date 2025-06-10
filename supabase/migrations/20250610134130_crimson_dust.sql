/*
  # Fixed RLS Policies for 'users' Table

  ✅ Objective:
  - Prevent infinite recursion in RLS
  - Securely allow users to read/update their own data
  - Avoid complex admin policies that cause recursion

  🔐 Notes:
  - Admin operations should use Supabase service role or backend functions
  - No self-joins or subqueries inside USING/WITH CHECK
*/

-- Ensure Row-Level Security is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can manage users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- ✅ Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- ✅ Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ✅ Allow users to insert their own data (e.g. during signup)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- 🚫 Do NOT use recursion or subqueries in RLS
-- 🛡️ Admin operations should be done using Supabase service role or secure RPC functions