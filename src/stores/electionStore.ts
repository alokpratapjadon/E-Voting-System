import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  image?: string;
  bio: string;
  votes: number;
}

export interface ElectionSettings {
  isVotingOpen: boolean;
  showResults: boolean;
  electionTitle: string;
  electionDescription: string;
}

interface ElectionState {
  candidates: Candidate[];
  settings: ElectionSettings;
  voteHistory: Record<string, string>; // voterId -> candidateId
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  updateCandidate: (id: string, updates: Partial<Omit<Candidate, 'id' | 'votes'>>) => void;
  deleteCandidate: (id: string) => void;
  castVote: (voterId: string, candidateId: string) => boolean;
  updateSettings: (updates: Partial<ElectionSettings>) => void;
  resetVotes: () => void;
}

// Initial election settings
const defaultSettings: ElectionSettings = {
  isVotingOpen: true,
  showResults: true,
  electionTitle: 'General Election 2025',
  electionDescription: 'Vote for the candidate who will represent your interests.',
};

// Sample candidate data
const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    party: 'Progressive Party',
    position: 'President',
    image: 'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Jane has served as a senator for 12 years and is passionate about healthcare reform and environmental protection.',
    votes: 42,
  },
  {
    id: '2',
    name: 'Robert Johnson',
    party: 'Liberty Party',
    position: 'President',
    image: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Robert is a successful entrepreneur and believes in economic growth through reduced regulation and lower taxes.',
    votes: 38,
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    party: 'Unity Alliance',
    position: 'President',
    image: 'https://images.pexels.com/photos/6325984/pexels-photo-6325984.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Maria is focused on bringing people together and finding compromises that benefit everyone.',
    votes: 27,
  },
];

export const useElectionStore = create<ElectionState>()(
  persist(
    (set) => ({
      candidates: initialCandidates,
      settings: defaultSettings,
      voteHistory: {},

      addCandidate: (candidateData) => set((state) => {
        const newCandidate: Candidate = {
          ...candidateData,
          id: Date.now().toString(),
          votes: 0,
        };
        return { candidates: [...state.candidates, newCandidate] };
      }),

      updateCandidate: (id, updates) => set((state) => {
        const updatedCandidates = state.candidates.map(candidate => 
          candidate.id === id ? { ...candidate, ...updates } : candidate
        );
        return { candidates: updatedCandidates };
      }),

      deleteCandidate: (id) => set((state) => ({
        candidates: state.candidates.filter(candidate => candidate.id !== id),
      })),

      castVote: (voterId, candidateId) => {
        let success = false;
        
        set((state) => {
          // Check if voting is open and the voter hasn't voted yet
          if (!state.settings.isVotingOpen || state.voteHistory[voterId]) {
            return { ...state }; // No changes if voting closed or already voted
          }

          // Update vote count
          const updatedCandidates = state.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              success = true;
              return { ...candidate, votes: candidate.votes + 1 };
            }
            return candidate;
          });

          // Update vote history
          const updatedVoteHistory = { 
            ...state.voteHistory, 
            [voterId]: candidateId 
          };

          return { 
            candidates: updatedCandidates, 
            voteHistory: updatedVoteHistory 
          };
        });

        return success;
      },

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),

      resetVotes: () => set((state) => ({
        candidates: state.candidates.map(candidate => ({ ...candidate, votes: 0 })),
        voteHistory: {},
      })),
    }),
    {
      name: 'election-storage',
    }
  )
);