/*
  # Add insert policy for users table

  1. Security Changes
    - Add RLS policy to allow users to insert their own profile data
    - Policy ensures users can only create their own profile where auth.uid() matches the user id
*/

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);