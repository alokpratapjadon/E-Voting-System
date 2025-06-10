/*
  # Authentication Setup for E-Voting Platform
  
  This file contains additional setup for Supabase Auth integration
*/

-- Enable phone authentication in Supabase Auth
-- Note: This needs to be configured in Supabase Dashboard under Authentication > Settings

-- Function to handle new user signup
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

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user profile with vote status
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid uuid)
RETURNS TABLE(
  id uuid,
  name text,
  voter_id text,
  phone text,
  is_admin boolean,
  has_voted boolean,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.voter_id,
    u.phone,
    u.is_admin,
    user_has_voted(u.id) as has_voted,
    u.created_at
  FROM users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;