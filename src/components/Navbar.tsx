import { Vote, Home, LogIn, BarChart3, Settings, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  async function checkAdminStatus() {
    try {
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user?.id)
        .single();
      
      setIsAdmin(data?.is_admin || false);
    } catch (err) {
      console.error('Failed to check admin status');
    }
  }
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-600' : '';
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Vote className="h-8 w-8 text-indigo-200" />
            <span className="bg-gradient-to-r from-white to-indigo-200 text-transparent bg-clip-text">E-Voting</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-600 transition"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/')}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/voting"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/voting')}`}
            >
              <Vote className="h-4 w-4" />
              <span>Vote</span>
            </Link>
            <Link
              to="/results"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/results')}`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/admin')}`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg ml-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/voting"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/voting')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Vote className="h-5 w-5" />
              <span>Vote</span>
            </Link>
            <Link
              to="/results"
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/results')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Results</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-200 ${isActive('/admin')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}