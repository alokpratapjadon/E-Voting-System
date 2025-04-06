import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  party: string;
  image_url: string;
}

export default function Voting() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCandidates();
      checkExistingVote();
    }
  }, [user]);

  async function fetchCandidates() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('name');

      if (error) throw error;
      setCandidates(data);
    } catch (err) {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }

  async function checkExistingVote() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSelectedCandidate(data.candidate_id);
        setHasVoted(true);
      }
    } catch (err) {
      setError('Failed to check voting status');
    }
  }

  const handleVote = async () => {
    if (!selectedCandidate || !user) return;

    try {
      // First verify the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) throw userError;
      
      if (!userData) {
        setError('User profile not found. Please log out and sign in again.');
        return;
      }

      const { error } = await supabase
        .from('votes')
        .insert([
          {
            user_id: user.id,
            candidate_id: selectedCandidate,
          },
        ]);

      if (error) throw error;
      setHasVoted(true);
      navigate('/results');
    } catch (err) {
      setError('Failed to submit vote');
      console.error('Vote submission error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Cast Your Vote
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition transform hover:-translate-y-1 ${
                  selectedCandidate === candidate.id ? 'ring-2 ring-blue-500' : ''
                } ${hasVoted ? 'pointer-events-none opacity-75' : ''}`}
                onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
              >
                <img
                  src={candidate.image_url}
                  alt={candidate.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600">{candidate.party}</p>
                  {selectedCandidate === candidate.id && (
                    <div className="mt-2 flex items-center text-blue-600">
                      <Check className="h-5 w-5 mr-1" />
                      Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || hasVoted}
              className={`px-8 py-3 rounded-lg text-white font-semibold ${
                !selectedCandidate || hasVoted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition`}
            >
              {hasVoted ? 'Vote Submitted' : 'Submit Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}