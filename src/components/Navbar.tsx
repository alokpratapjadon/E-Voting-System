import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, BarChart3, Settings, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">E-Voting</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/vote" className="nav-link">
              <Vote className="h-5 w-5" />
              <span>Vote</span>
            </Link>
            <Link to="/results" className="nav-link">
              <BarChart3 className="h-5 w-5" />
              <span>Results</span>
            </Link>
            <Link to="/admin" className="nav-link">
              <Settings className="h-5 w-5" />
              <span>Admin</span>
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;