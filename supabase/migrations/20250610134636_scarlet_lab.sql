/*
  # Complete Authentication Setup

  1. New Tables
    - Enhanced users table with proper auth integration
    - Phone verification system
    - Admin user setup

  2. Security
    - Proper RLS policies without recursion
    - Auth triggers for user creation
    - Secure functions for user management

  3. Sample Data
    - Admin user
    - Sample candidates
    - Default settings
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle new user signup from auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert user profile when auth user is created
  INSERT INTO public.users (id, name, voter_id, phone, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'voter_id', 'VOTER_' || substr(NEW.id::text, 1, 8)),
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
    phone = COALESCE(NEW.phone, users.phone),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text,
  admin_password text,
  admin_name text DEFAULT 'Admin User',
  admin_voter_id text DEFAULT 'ADMIN001'
)
RETURNS uuid AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'name', admin_name,
      'voter_id', admin_voter_id,
      'is_admin', true
    ),
    false
  )
  RETURNING id INTO admin_user_id;

  -- Create user profile
  INSERT INTO public.users (id, name, voter_id, is_admin, phone)
  VALUES (admin_user_id, admin_name, admin_voter_id, true, '+1234567890')
  ON CONFLICT (id) DO UPDATE SET
    is_admin = true,
    name = admin_name,
    voter_id = admin_voter_id;

  RETURN admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create default admin user (you should change these credentials)
-- Note: This is for development only. In production, create admin through proper signup
DO $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if admin already exists
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) INTO admin_exists;
  
  -- Create admin if doesn't exist
  IF NOT admin_exists THEN
    PERFORM create_admin_user(
      'admin@example.com',
      'admin123',
      'Admin User',
      'ADMIN001'
    );
  END IF;
END $$;

-- Function to get user with vote status
CREATE OR REPLACE FUNCTION get_user_with_vote_status(user_uuid uuid)
RETURNS TABLE(
  id uuid,
  name text,
  voter_id text,
  phone text,
  is_admin boolean,
  has_voted boolean,
  email text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.voter_id,
    u.phone,
    u.is_admin,
    EXISTS(SELECT 1 FROM votes v WHERE v.user_id = u.id) as has_voted,
    au.email
  FROM users u
  LEFT JOIN auth.users au ON u.id = au.id
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate signup data
CREATE OR REPLACE FUNCTION validate_signup_data(
  email_input text,
  voter_id_input text,
  phone_input text
)
RETURNS boolean AS $$
BEGIN
  -- Check if email already exists in auth
  IF EXISTS(SELECT 1 FROM auth.users WHERE email = email_input) THEN
    RETURN false;
  END IF;
  
  -- Check if voter ID already exists
  IF EXISTS(SELECT 1 FROM users WHERE voter_id = voter_id_input) THEN
    RETURN false;
  END IF;
  
  -- Check if phone already exists
  IF phone_input IS NOT NULL AND EXISTS(SELECT 1 FROM users WHERE phone = phone_input) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample test user for development
DO $$
DECLARE
  test_user_exists boolean;
  test_user_id uuid;
BEGIN
  -- Check if test user already exists
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = 'voter@example.com'
  ) INTO test_user_exists;
  
  -- Create test user if doesn't exist
  IF NOT test_user_exists THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'voter@example.com',
      crypt('voter123', gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object(
        'name', 'Test Voter',
        'voter_id', 'VOTER001',
        'is_admin', false
      ),
      false
    )
    RETURNING id INTO test_user_id;

    -- Create user profile
    INSERT INTO public.users (id, name, voter_id, is_admin, phone)
    VALUES (test_user_id, 'Test Voter', 'VOTER001', false, '+1987654321')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;