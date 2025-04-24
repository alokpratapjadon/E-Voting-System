import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
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
  adminLogin: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  setHasVoted: () => void;
}

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'voter@example.com',
    password: 'password123',
    voterId: 'V12345',
    hasVoted: false,
    isAdmin: false,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    voterId: 'A00001',
    hasVoted: false,
    isAdmin: true,
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  user: null,

  // Check if user is already logged in from localStorage
  checkAuth: () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ 
          isAuthenticated: true, 
          isAdmin: !!user.isAdmin,
          user, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error checking authentication', error);
      set({ isLoading: false });
    }
  },

  // Regular user login
  login: async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && 
             u.password === credentials.password &&
             !u.isAdmin
      );
      
      if (user) {
        // Remove password before storing user data
        const { password, ...userWithoutPassword } = user;
        
        // Save to localStorage and update state
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        set({ 
          isAuthenticated: true, 
          isAdmin: false,
          user: userWithoutPassword 
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find admin user with matching credentials
      const admin = MOCK_USERS.find(
        u => u.email === credentials.email && 
             u.password === credentials.password &&
             u.isAdmin
      );
      
      if (admin) {
        // Remove password before storing user data
        const { password, ...adminWithoutPassword } = admin;
        
        // Save to localStorage and update state
        localStorage.setItem('user', JSON.stringify(adminWithoutPassword));
        set({ 
          isAuthenticated: true, 
          isAdmin: true,
          user: adminWithoutPassword 
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error', error);
      return false;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
    set({ 
      isAuthenticated: false, 
      isAdmin: false,
      user: null 
    });
  },

  // Update user's voting status
  setHasVoted: () => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, hasVoted: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },
}));