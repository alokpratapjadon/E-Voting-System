/*
  # Fix Users Table RLS Policies

  1. Changes
    - Drop existing INSERT policy that was too restrictive
    - Create new INSERT policy that allows profile creation during signup
    - Maintain existing SELECT and UPDATE policies

  2. Security
    - New INSERT policy allows creating profile only if:
      a) User is authenticated
      b) The user ID matches the row being created
      c) The email matches the authenticated user's email
    - This ensures users can only create their own profile
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new INSERT policy with correct conditions
CREATE POLICY "Users can insert own profile" ON users
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = id AND 
  auth.jwt()->>'email' = email
);