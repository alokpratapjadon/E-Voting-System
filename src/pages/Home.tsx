import React from 'react';
import { motion } from 'framer-motion';
import { Vote, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Vote className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to E-Voting Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Secure, transparent, and easy-to-use electronic voting system
        </p>
        
        <Link to="/vote">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
          >
            Vote Now
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">1,234</h3>
            <p className="text-gray-600 dark:text-gray-300">Total Voters</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">789</h3>
            <p className="text-gray-600 dark:text-gray-300">Votes Cast</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <Vote className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">5</h3>
            <p className="text-gray-600 dark:text-gray-300">Active Elections</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;