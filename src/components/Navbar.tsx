import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Vote, ChevronDown, Menu, X, LogOut, User, BarChart, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from './ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navbarClass = isScrolled
    ? 'bg-white shadow-md py-2'
    : 'bg-transparent py-4';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-neutral-900">SecureVote</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-neutral-700'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/voting"
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname === '/voting' ? 'text-primary-600' : 'text-neutral-700'
                  }`}
                >
                  Vote
                </Link>
              </>
            )}
            <Link
              to="/results"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/results' ? 'text-primary-600' : 'text-neutral-700'
              }`}
            >
              Results
            </Link>

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-neutral-700 hover:text-primary-600">
                  <span>Admin</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/candidates"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Candidates
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Settings
                  </Link>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-neutral-700">
                  <User className="inline-block h-4 w-4 mr-1" />
                  {user?.name || 'User'}
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">Login to Vote</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-800 focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3 py-2">
              <Link
                to="/"
                className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link
                  to="/voting"
                  className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Vote className="inline-block h-5 w-5 mr-1" /> Vote
                </Link>
              )}
              <Link
                to="/results"
                className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                <BarChart className="inline-block h-5 w-5 mr-1" /> Results
              </Link>

              {isAdmin && (
                <>
                  <div className="border-t border-neutral-200 pt-2">
                    <div className="px-3 py-1 text-sm font-medium text-neutral-500">
                      Admin Panel
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="inline-block h-5 w-5 mr-1" /> Dashboard
                  </Link>
                  <Link
                    to="/admin/candidates"
                    className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="inline-block h-5 w-5 mr-1" /> Candidates
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-neutral-200 pt-2">
                    <div className="px-3 py-2 text-sm font-medium text-neutral-800">
                      <User className="inline-block h-4 w-4 mr-1" />
                      {user?.name || 'User'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-neutral-800 px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100"
                    >
                      <LogOut className="inline-block h-5 w-5 mr-1" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login to Vote
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;