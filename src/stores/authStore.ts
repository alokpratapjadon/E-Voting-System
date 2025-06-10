import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  voterId: string;
  hasVoted?: boolean;
  isAdmin?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signUp: (credentials: { email: string; password: string; name: string; voterId: string; phone: string }) => Promise<boolean>;
  adminLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  setHasVoted: () => void;
  verifyPhone: (phone: string, code: string) => Promise<boolean>;
  requestPhoneVerification: (phone: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  user: null,

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          const { data: voteData } = await supabase
            .from('votes')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          const user = {
            id: userData.id,
            name: userData.name,
            email: session.user.email!,
            phone: userData.phone,
            voterId: userData.voter_id,
            hasVoted: !!voteData,
            isAdmin: userData.is_admin
          };

          set({
            isAuthenticated: true,
            isAdmin: userData.is_admin,
            user,
            isLoading: false
          });
          return;
        }
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isLoading: false });
    }
  },

  signUp: async (credentials) => {
    try {
      if (!isValidPhoneNumber(credentials.phone)) throw new Error('Invalid phone number');
      const phoneNumber = parsePhoneNumber(credentials.phone);
      if (!phoneNumber) throw new Error('Invalid phone number format');

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`voter_id.eq.${credentials.voterId},phone.eq.${phoneNumber.number}`);

      if (existingUser && existingUser.length > 0) return false;

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            voter_id: credentials.voterId,
            phone: phoneNumber.number
          }
        }
      });

      if (signUpError || !user) return false;

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: credentials.name,
          voter_id: credentials.voterId,
          phone: phoneNumber.number,
          is_admin: false
        })
        .select()
        .single();

      if (profileError) return false;

      const userProfile = {
        id: userData.id,
        name: userData.name,
        email: user.email!,
        phone: userData.phone,
        voterId: userData.voter_id,
        hasVoted: false,
        isAdmin: false
      };

      set({
        isAuthenticated: true,
        isAdmin: false,
        user: userProfile
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  },

  login: async (credentials) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !user) return false;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData && !userData.is_admin) {
        const { data: voteData } = await supabase
          .from('votes')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const userProfile = {
          id: userData.id,
          name: userData.name,
          email: user.email!,
          phone: userData.phone,
          voterId: userData.voter_id,
          hasVoted: !!voteData,
          isAdmin: false
        };

        set({
          isAuthenticated: true,
          isAdmin: false,
          user: userProfile
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  adminLogin: async (credentials) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !user) return false;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData && userData.is_admin) {
        const adminProfile = {
          id: userData.id,
          name: userData.name,
          email: user.email!,
          phone: userData.phone,
          voterId: userData.voter_id,
          isAdmin: true
        };

        set({
          isAuthenticated: true,
          isAdmin: true,
          user: adminProfile
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      isAdmin: false,
      user: null
    });
  },

  setHasVoted: () => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, hasVoted: true } });
    }
  },

  verifyPhone: async (phone, code) => {
    // Mock implementation
    return true;
  },

  requestPhoneVerification: async (phone) => {
    // Mock implementation
    return true;
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return !error;
    } catch {
      return false;
    }
  },
}));