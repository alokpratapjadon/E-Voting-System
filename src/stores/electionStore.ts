import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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

const DEFAULT_SETTINGS: ElectionSettings = {
  isVotingOpen: true,
  showResults: true,
  electionTitle: 'Election Title',
  electionDescription: 'Welcome to the election system',
};

interface ElectionState {
  candidates: Candidate[];
  settings: ElectionSettings;
  voteHistory: Record<string, string>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => Promise<void>;
  updateCandidate: (id: string, updates: Partial<Omit<Candidate, 'id' | 'votes'>>) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  castVote: (voterId: string, candidateId: string) => Promise<boolean>;
  updateSettings: (updates: Partial<ElectionSettings>) => Promise<void>;
  resetVotes: () => Promise<void>;
  fetchCandidates: () => Promise<void>;
  fetchSettings: () => Promise<void>;
}

// Utility function for retry logic with exponential backoff
const retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 1.5
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * backoff);
  }
};


export const useElectionStore = create<ElectionState>((set, get) => ({
  candidates: [],
  settings: DEFAULT_SETTINGS,
  voteHistory: {},

  fetchCandidates: async () => {
    try {
      await retry(async () => {
        const { data: candidates, error: candidatesError } = await supabase
          .from('candidates')
          .select('*');

        if (candidatesError) throw candidatesError;

        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('candidate_id');

        if (votesError) throw votesError;

        const voteCounts: Record<string, number> = {};
        votes?.forEach(vote => {
          voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
        });

        const formattedCandidates = candidates?.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          party: candidate.party,
          position: candidate.position,
          image: candidate.image_url,
          bio: candidate.bio || '',
          votes: voteCounts[candidate.id] || 0
        })) || [];

        set({ candidates: formattedCandidates });
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      set({ candidates: [] });
    }
  },

  fetchSettings: async () => {
    try {
      await retry(async () => {
        const { data: existingSettings, error: fetchError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'election_config')
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingSettings?.value) {
          set({ settings: existingSettings.value as ElectionSettings });
        } else {
          // If no settings exist, create them with default values
          const { data: newSettings, error: insertError } = await supabase
            .from('settings')
            .insert({
              key: 'election_config',
              value: DEFAULT_SETTINGS
            })
            .select('value')
            .single();

          if (insertError) throw insertError;

          if (newSettings?.value) {
            set({ settings: newSettings.value as ElectionSettings });
          } else {
            set({ settings: DEFAULT_SETTINGS });
          }
        }
      });
    } catch (error) {
      console.error('Error fetching or creating settings:', error);
      set({ settings: DEFAULT_SETTINGS });
    }
  },

  addCandidate: async (candidateData) => {
    try {
      await retry(async () => {
        const { data, error } = await supabase
          .from('candidates')
          .insert({
            name: candidateData.name,
            party: candidateData.party,
            position: candidateData.position,
            image_url: candidateData.image,
            bio: candidateData.bio
          })
          .select()
          .single();

        if (error) throw error;

        const newCandidate: Candidate = {
          id: data.id,
          name: data.name,
          party: data.party,
          position: data.position,
          image: data.image_url,
          bio: data.bio || '',
          votes: 0
        };

        const { candidates } = get();
        set({ candidates: [...candidates, newCandidate] });
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  },

  updateCandidate: async (id, updates) => {
    try {
      await retry(async () => {
        const { error } = await supabase
          .from('candidates')
          .update({
            name: updates.name,
            party: updates.party,
            position: updates.position,
            image_url: updates.image,
            bio: updates.bio
          })
          .eq('id', id);

        if (error) throw error;

        const { candidates } = get();
        const updatedCandidates = candidates.map(candidate =>
          candidate.id === id ? { ...candidate, ...updates } : candidate
        );
        set({ candidates: updatedCandidates });
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  },

  deleteCandidate: async (id) => {
    try {
      await retry(async () => {
        const { error } = await supabase
          .from('candidates')
          .delete()
          .eq('id', id);

        if (error) throw error;

        const { candidates } = get();
        set({ candidates: candidates.filter(candidate => candidate.id !== id) });
      });
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  },

  castVote: async (voterId, candidateId) => {
    try {
      await retry(async () => {
        const { error } = await supabase
          .from('votes')
          .insert({
            user_id: voterId,
            candidate_id: candidateId
          });

        if (error) throw error;

        const { candidates } = get();
        const updatedCandidates = candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, votes: candidate.votes + 1 }
            : candidate
        );

        set({ 
          candidates: updatedCandidates,
          voteHistory: { ...get().voteHistory, [voterId]: candidateId }
        });
      });

      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      return false;
    }
  },

  updateSettings: async (updates) => {
    try {
      await retry(async () => {
        const newSettings = { ...get().settings, ...updates };
        
        const { error } = await supabase
          .from('settings')
          .update({ value: newSettings })
          .eq('key', 'election_config');

        if (error) throw error;

        set({ settings: newSettings });
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  },

  resetVotes: async () => {
    try {
      await retry(async () => {
        const { error } = await supabase
          .from('votes')
          .delete()
          .neq('id', '0');

        if (error) throw error;

        const { candidates } = get();
        const resetCandidates = candidates.map(candidate => ({ ...candidate, votes: 0 }));
        set({ 
          candidates: resetCandidates,
          voteHistory: {}
        });
      });
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  }
}));