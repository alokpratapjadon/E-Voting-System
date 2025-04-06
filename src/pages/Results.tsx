import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CandidateResult {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
}

export default function Results() {
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchResults() {
    try {
      // Get all candidates
      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('id, name, party');

      if (candidatesError) throw candidatesError;

      // Get vote counts for each candidate
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('candidate_id');

      if (votesError) throw votesError;

      // Calculate results
      const totalVotes = votes.length;
      const votesPerCandidate = votes.reduce((acc: { [key: string]: number }, vote) => {
        acc[vote.candidate_id] = (acc[vote.candidate_id] || 0) + 1;
        return acc;
      }, {});

      const processedResults = candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        votes: votesPerCandidate[candidate.id] || 0,
        percentage: totalVotes
          ? ((votesPerCandidate[candidate.id] || 0) / totalVotes) * 100
          : 0,
      }));

      setResults(processedResults.sort((a, b) => b.votes - a.votes));
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <BarChart3 className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900">Election Results</h1>
            <p className="text-gray-600 mt-2">Live voting statistics and results</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-xl p-6">
            {results.map((result) => (
              <div key={result.id} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.name}
                    </h3>
                    <p className="text-sm text-gray-600">{result.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {result.votes} votes
                    </p>
                    <p className="text-sm text-gray-600">
                      {result.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}