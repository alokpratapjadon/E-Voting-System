/*
  # Additional Security Policies and Functions
  
  Enhanced security for the e-voting platform
*/

-- Function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM users 
    WHERE id = user_uuid AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced vote validation function
CREATE OR REPLACE FUNCTION can_vote(user_uuid uuid, candidate_uuid uuid)
RETURNS boolean AS $$
DECLARE
  voting_open boolean;
  already_voted boolean;
  candidate_exists boolean;
BEGIN
  -- Check if voting is open
  SELECT (value->>'isVotingOpen')::boolean INTO voting_open
  FROM settings WHERE key = 'election_config';
  
  -- Check if user already voted
  SELECT user_has_voted(user_uuid) INTO already_voted;
  
  -- Check if candidate exists
  SELECT EXISTS(SELECT 1 FROM candidates WHERE id = candidate_uuid) INTO candidate_exists;
  
  RETURN voting_open AND NOT already_voted AND candidate_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cast vote with validation
CREATE OR REPLACE FUNCTION cast_vote_secure(user_uuid uuid, candidate_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Validate vote
  IF NOT can_vote(user_uuid, candidate_uuid) THEN
    RETURN false;
  END IF;
  
  -- Cast vote
  INSERT INTO votes (user_id, candidate_id) 
  VALUES (user_uuid, candidate_uuid);
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get election results
CREATE OR REPLACE FUNCTION get_election_results()
RETURNS TABLE(
  candidate_id uuid,
  candidate_name text,
  party text,
  position text,
  vote_count bigint,
  percentage numeric
) AS $$
DECLARE
  total_votes bigint;
BEGIN
  -- Get total vote count
  SELECT COUNT(*) INTO total_votes FROM votes;
  
  RETURN QUERY
  SELECT 
    c.id as candidate_id,
    c.name as candidate_name,
    c.party,
    c.position,
    COALESCE(COUNT(v.id), 0) as vote_count,
    CASE 
      WHEN total_votes > 0 THEN 
        ROUND((COALESCE(COUNT(v.id), 0)::numeric / total_votes::numeric) * 100, 2)
      ELSE 0
    END as percentage
  FROM candidates c
  LEFT JOIN votes v ON c.id = v.candidate_id
  GROUP BY c.id, c.name, c.party, c.position
  ORDER BY vote_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset all votes (admin only)
CREATE OR REPLACE FUNCTION reset_all_votes()
RETURNS boolean AS $$
BEGIN
  -- This function should only be called by admin users
  -- The application should verify admin status before calling
  DELETE FROM votes;
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;