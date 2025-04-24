import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronRight, User, Users, PartyPopper } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { useElectionStore, Candidate } from '../stores/electionStore';

const VotingPage = () => {
  const { user, setHasVoted } = useAuthStore();
  const { candidates, settings, castVote } = useElectionStore();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoteSuccess, setIsVoteSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if voting is open
  useEffect(() => {
    if (!settings.isVotingOpen) {
      setError('Voting is currently closed.');
    }
  }, [settings.isVotingOpen]);

  // Check if user has already voted
  useEffect(() => {
    if (user?.hasVoted) {
      setIsVoteSuccess(true);
    }
  }, [user]);

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setError('');
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote for.');
      return;
    }

    if (!settings.isVotingOpen) {
      setError('Voting is currently closed.');
      return;
    }

    if (user?.hasVoted) {
      setError('You have already voted in this election.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (user?.id) {
        const success = castVote(user.id, selectedCandidate);
        
        if (success) {
          setHasVoted();
          setIsVoteSuccess(true);
        } else {
          setError('There was an issue recording your vote. You may have already voted.');
        }
      } else {
        setError('User information is missing. Please try logging in again.');
      }
    } catch (err) {
      setError('An error occurred while submitting your vote.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // If user has already voted, show success screen
  if (isVoteSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-lg shadow-card p-8">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-10 h-10 text-secondary-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Thank You for Voting!</h1>
              <p className="text-neutral-600 mb-8">
                Your vote has been successfully recorded. Thank you for participating in this election.
              </p>
              
              {settings.showResults ? (
                <Button
                  variant="primary"
                  onClick={handleViewResults}
                  className="mx-auto"
                >
                  View Results <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <p className="text-neutral-600 italic">
                  Results will be available after the voting period has ended.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-10 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">{settings.electionTitle}</h1>
          <p className="text-lg text-neutral-600">
            Select a candidate below to cast your vote
          </p>
          {user && (
            <div className="mt-4 inline-flex items-center bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm">
              <User className="h-4 w-4 mr-2" />
              Voting as: {user.name} (ID: {user.voterId})
            </div>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto grid grid-cols-1 gap-6"
        >
          {candidates.map((candidate: Candidate) => (
            <motion.div key={candidate.id} variants={item}>
              <button 
                className="w-full text-left"
                onClick={() => handleSelectCandidate(candidate.id)}
              >
                <Card 
                  className={`transition-all duration-300 hover:shadow-card-hover ${
                    selectedCandidate === candidate.id
                      ? 'ring-2 ring-primary-500 ring-offset-2'
                      : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-1 bg-neutral-100 flex items-center justify-center p-4">
                        {candidate.image ? (
                          <img 
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-20 h-20 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-neutral-500" />
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-4 p-6">
                        <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
                        <div className="flex items-center mb-3">
                          <div className="text-sm bg-primary-100 text-primary-800 px-3 py-1 rounded-full mr-2">
                            {candidate.position}
                          </div>
                          <div className="text-sm bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {candidate.party}
                          </div>
                        </div>
                        <p className="text-neutral-600">{candidate.bio}</p>
                      </div>
                      <div className="md:col-span-1 flex items-center justify-center p-4">
                        <div 
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedCandidate === candidate.id
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-neutral-300'
                          }`}
                        >
                          {selectedCandidate === candidate.id && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </motion.div>
          ))}

          <motion.div
            variants={item}
            className="mt-4"
          >
            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={!selectedCandidate || !settings.isVotingOpen || isSubmitting}
              onClick={handleSubmitVote}
              fullWidth
            >
              Submit Vote
            </Button>
            <p className="mt-3 text-center text-sm text-neutral-500">
              Your vote is secure and anonymous. You can only vote once.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VotingPage;