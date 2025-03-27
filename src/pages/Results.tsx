import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Users } from 'lucide-react';

const Results = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Election Results
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Live voting statistics and results
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,234</h3>
          <p className="text-gray-600 dark:text-gray-300">Total Votes Cast</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <BarChart className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">78.5%</h3>
          <p className="text-gray-600 dark:text-gray-300">Voter Turnout</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <PieChart className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3</h3>
          <p className="text-gray-600 dark:text-gray-300">Leading Candidate</p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Vote Distribution
          </h2>
          <div className="space-y-4">
            {[
              { name: "John Smith", votes: 450, percentage: 45 },
              { name: "Sarah Johnson", votes: 350, percentage: 35 },
              { name: "Michael Brown", votes: 200, percentage: 20 }
            ].map((candidate) => (
              <div key={candidate.name}>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>{candidate.name}</span>
                  <span>{candidate.votes} votes ({candidate.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;