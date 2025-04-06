/*
  # Create Test User Account

  1. Changes
    - Insert a test user into the users table
    - Email: test@example.com
    - Password: test123456
    - Full Name: Test User

  Note: You'll need to use these credentials to log in:
  - Email: test@example.com
  - Password: test123456
*/

-- Insert test user if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@example.com'
  ) THEN
    -- Create auth user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test@example.com',
      crypt('test123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Create user profile
    INSERT INTO public.users (
      id,
      email,
      full_name
    ) VALUES (
      (SELECT id FROM auth.users WHERE email = 'test@example.com'),
      'test@example.com',
      'Test User'
    );
  END IF;
END $$;