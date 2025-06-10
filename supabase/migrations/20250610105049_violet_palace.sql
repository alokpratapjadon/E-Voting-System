/*
  # Sample Data for E-Voting Platform
  
  This file contains sample data for testing
*/

-- Insert additional sample candidates
INSERT INTO candidates (name, party, position, bio, image_url) VALUES
  (
    'Emily Rodriguez',
    'Green Party',
    'President',
    'Environmental scientist and activist, dedicated to climate action and sustainable development.',
    'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
  ),
  (
    'Robert Chen',
    'Libertarian Party',
    'President',
    'Tech entrepreneur advocating for individual freedoms, limited government, and innovation.',
    'https://images.pexels.com/photos/2182969/pexels-photo-2182969.jpeg?auto=compress&cs=tinysrgb&w=400'
  )
ON CONFLICT DO NOTHING;

-- Insert sample voter (for testing)
-- Note: You'll need to create the auth user first, then update the ID
INSERT INTO users (id, name, voter_id, phone, is_admin) VALUES
  (
    '11111111-1111-1111-1111-111111111111', -- Replace with actual auth user ID
    'Test Voter',
    'VOTER001',
    '+1987654321',
    false
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  voter_id = EXCLUDED.voter_id,
  phone = EXCLUDED.phone,
  is_admin = EXCLUDED.is_admin;

-- Update election settings with more detailed configuration
UPDATE settings 
SET value = '{
  "isVotingOpen": true,
  "showResults": true,
  "electionTitle": "2025 Presidential Election",
  "electionDescription": "Cast your vote for the next President. Your voice matters in shaping our future. This secure e-voting platform ensures your vote is counted accurately and anonymously."
}'::jsonb
WHERE key = 'election_config';