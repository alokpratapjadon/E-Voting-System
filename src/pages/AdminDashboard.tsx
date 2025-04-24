import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, UserCheck, Settings, Calendar, ArrowRight, Download, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { useElectionStore, Candidate } from '../stores/electionStore';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { candidates, settings, voteHistory, updateSettings, resetVotes } = useElectionStore();
  const [totalVotes, setTotalVotes] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Calculate total votes
    const total = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    setTotalVotes(total);
  }, [candidates]);

  const handleToggleVoting = () => {
    updateSettings({ isVotingOpen: !settings.isVotingOpen });
  };

  const handleToggleResults = () => {
    updateSettings({ showResults: !settings.showResults });
  };

  const handleResetVotes = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    setIsResetting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    resetVotes();
    setIsResetting(false);
    setConfirmReset(false);
  };

  const handleCancelReset = () => {
    setConfirmReset(false);
  };

  // Prepare chart data
  const chartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        data: candidates.map(c => c.votes),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // primary
          'rgba(16, 185, 129, 0.8)', // secondary
          'rgba(245, 158, 11, 0.8)', // warning
          'rgba(239, 68, 68, 0.8)', // error
          'rgba(99, 102, 241, 0.8)', // indigo
          'rgba(236, 72, 153, 0.8)', // pink
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    cutout: '70%',
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-neutral-600">
                Manage election settings and monitor voting progress
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link to="/admin/candidates">
                <Button variant="outline" size="sm">
                  Manage Candidates
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" size="sm">
                  Election Settings
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Total Votes</p>
                        <h3 className="text-2xl font-bold">{totalVotes}</h3>
                      </div>
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <BarChart2 className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-neutral-500">
                      <span className="mr-1">From</span>
                      <span className="font-medium text-neutral-700">{Object.keys(voteHistory).length}</span>
                      <span className="ml-1">unique voters</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Candidates</p>
                        <h3 className="text-2xl font-bold">{candidates.length}</h3>
                      </div>
                      <div className="p-2 bg-secondary-100 rounded-lg">
                        <UserCheck className="h-6 w-6 text-secondary-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to="/admin/candidates" 
                        className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
                      >
                        Manage candidates
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Voting Status</p>
                        <h3 className="text-2xl font-bold">
                          {settings.isVotingOpen ? 'Open' : 'Closed'}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg ${settings.isVotingOpen ? 'bg-green-100' : 'bg-error-100'}`}>
                        <Settings className={`h-6 w-6 ${settings.isVotingOpen ? 'text-green-600' : 'text-error-600'}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant={settings.isVotingOpen ? 'danger' : 'success'}
                        size="sm"
                        onClick={handleToggleVoting}
                      >
                        {settings.isVotingOpen ? 'Close Voting' : 'Open Voting'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Results</p>
                        <h3 className="text-2xl font-bold">
                          {settings.showResults ? 'Visible' : 'Hidden'}
                        </h3>
                      </div>
                      <div className="p-2 bg-warning-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-warning-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant={settings.showResults ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleToggleResults}
                      >
                        {settings.showResults ? 'Hide Results' : 'Show Results'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Results Chart and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <motion.div variants={item} className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Vote Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      {totalVotes > 0 ? (
                        <Doughnut data={chartData} options={chartOptions} />
                      ) : (
                        <div className="text-center text-neutral-500">
                          <p>No votes recorded yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export Data
                    </Button>
                    
                    {/* Vote Reset Button */}
                    {!confirmReset ? (
                      <Button 
                        variant="danger" 
                        size="sm"
                        className="text-sm"
                        onClick={handleResetVotes}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reset Votes
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-sm"
                          onClick={handleCancelReset}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          className="text-sm"
                          isLoading={isResetting}
                          onClick={handleResetVotes}
                        >
                          Confirm Reset
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div variants={item} className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Candidate Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-neutral-50 border-b">
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Candidate
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Party
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Votes
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {candidates.sort((a, b) => b.votes - a.votes).map((candidate) => (
                            <tr key={candidate.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8">
                                    {candidate.image ? (
                                      <img 
                                        src={candidate.image} 
                                        alt={candidate.name} 
                                        className="h-8 w-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
                                        <span className="text-xs text-neutral-600">
                                          {candidate.name.charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-neutral-900">
                                      {candidate.name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                                {candidate.party}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                                {candidate.votes}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full max-w-xs bg-neutral-200 rounded-full h-2">
                                    <div 
                                      className="bg-primary-600 h-2 rounded-full" 
                                      style={{ 
                                        width: `${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-3 text-sm text-neutral-700">
                                    {totalVotes > 0 
                                      ? `${Math.round((candidate.votes / totalVotes) * 100)}%` 
                                      : '0%'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                          
                          {candidates.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-6 text-center text-sm text-neutral-500">
                                No candidates available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/admin/candidates">
                      <Button variant="outline" fullWidth className="justify-start">
                        <UserCheck className="h-5 w-5 mr-2" />
                        Manage Candidates
                      </Button>
                    </Link>
                    <Link to="/admin/settings">
                      <Button variant="outline" fullWidth className="justify-start">
                        <Settings className="h-5 w-5 mr-2" />
                        Election Settings
                      </Button>
                    </Link>
                    <Link to="/results">
                      <Button variant="outline" fullWidth className="justify-start">
                        <BarChart2 className="h-5 w-5 mr-2" />
                        View Public Results
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;