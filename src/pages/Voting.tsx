import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const candidates = [
  {
    id: 1,
    name: "Narendra Modi",
    party: "BJP",
    image: "https://imgs.search.brave.com/wTYTFN5IIqtLV4iqR9AVqGo1VCMDrMPribyR7VrfiOA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDY3Mjc4/NzEuanBn",
  },
  {
    id: 2,
    name: "Rahul Gandhi",
    party: "Congress",
    image: "https://media.gettyimages.com/id/2121047219/photo/indias-congress-party-leader-rahul-gandhi-addresses-supporters-during-a-rally-organised-by.jpg?s=612x612&w=0&k=20&c=WrSoSPo6rwgquOm7un4laJW924pO63k3jLE0DkIRpUU=",
  },
  {
    id: 3,
    name: "Donald Trump",
    party: "Republican Party",
    image: "https://media.gettyimages.com/id/2158175269/photo/racine-wisconsin-republican-presidential-candidate-former-president-donald-trump-arrives-for.jpg?s=612x612&w=0&k=20&c=R9L7PSzxDAuqPjwLKazxdS3URAeINSnONtcIlNZ_O2k=",
  }
];

const Voting = () => {
  const [selectedCandidate, setSelectedCandidate] = React.useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Cast Your Vote
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select your preferred candidate from the list below
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {candidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            whileHover={{ y: -5 }}
            className={`
              bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer
              ${selectedCandidate === candidate.id ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Candidate';
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {candidate.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {candidate.party}
              </p>
              <div className="flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Candidate #{candidate.id}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!selectedCandidate}
        className={`
          mt-12 mx-auto block px-8 py-3 rounded-lg text-white font-semibold
          ${selectedCandidate
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        Confirm Vote
      </motion.button>
    </div>
  );
};

export default Voting;