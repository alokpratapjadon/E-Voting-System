import React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings, PlusCircle, Trash2, Edit } from 'lucide-react';

const Admin = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Manage candidates and monitor voting progress
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3</h3>
          <p className="text-gray-600 dark:text-gray-300">Total Candidates</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <Settings className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Active</h3>
          <p className="text-gray-600 dark:text-gray-300">Voting Status</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <Users className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,234</h3>
          <p className="text-gray-600 dark:text-gray-300">Registered Voters</p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Candidates
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Candidate</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            {[
              { id: 1, name: "John Smith", party: "Progressive Party" },
              { id: 2, name: "Sarah Johnson", party: "Democratic Alliance" },
              { id: 3, name: "Michael Brown", party: "People's Front" }
            ].map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {candidate.party}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;