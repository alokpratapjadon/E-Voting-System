import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart2, Info, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useElectionStore, Candidate } from '../stores/electionStore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsPage = () => {
  const { candidates, settings } = useElectionStore();
  const [totalVotes, setTotalVotes] = useState(0);
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);
  const [leadingCandidate, setLeadingCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    // Calculate total votes
    const total = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    setTotalVotes(total);

    // Sort candidates by votes (descending)
    const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
    setSortedCandidates(sorted);

    // Set leading candidate
    if (sorted.length > 0 && sorted[0].votes > 0) {
      setLeadingCandidate(sorted[0]);
    }
  }, [candidates]);

  // Prepare chart data
  const chartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // primary
          'rgba(16, 185, 129, 0.8)', // secondary
          'rgba(245, 158, 11, 0.8)', // warning
          'rgba(239, 68, 68, 0.8)', // error
          'rgba(99, 102, 241, 0.8)', // indigo
          'rgba(236, 72, 153, 0.8)', // pink
        ],
        borderColor: [
          'rgb(37, 99, 235)',
          'rgb(5, 150, 105)',
          'rgb(217, 119, 6)',
          'rgb(220, 38, 38)',
          'rgb(79, 70, 229)',
          'rgb(219, 39, 119)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Election Results',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
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

  if (!settings.showResults) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 shadow-md">
              <Info className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-3">Results Not Available</h1>
              <p className="text-neutral-600 mb-6">
                The election results are not yet available for public viewing. Results will be published after the voting period has ended.
              </p>
              <p className="text-sm text-neutral-500 italic">
                Please check back later for updated information.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-10 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">{settings.electionTitle} Results</h1>
          <p className="text-lg text-neutral-600">
            Current election results based on {totalVotes} total votes
          </p>
          
          {!settings.isVotingOpen && (
            <div className="mt-4 inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
              <Info className="h-4 w-4 mr-2" />
              Voting period has ended. These are the final results.
            </div>
          )}
          
          {settings.isVotingOpen && (
            <div className="mt-4 inline-flex items-center bg-warning-50 text-warning-700 px-4 py-2 rounded-full text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Voting is still open. Results may change.
            </div>
          )}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          {/* Leading Candidate Card */}
          {leadingCandidate && (
            <motion.div variants={item} className="mb-8">
              <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary-800">
                    <Award className="w-5 h-5 mr-2" />
                    Leading Candidate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      {leadingCandidate.image ? (
                        <img 
                          src={leadingCandidate.image}
                          alt={leadingCandidate.name}
                          className="w-24 h-24 object-cover rounded-full border-4 border-primary-200"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-700">
                            {leadingCandidate.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-neutral-900">{leadingCandidate.name}</h3>
                      <p className="text-primary-700 mb-2">{leadingCandidate.party}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="bg-primary-200 text-primary-800 px-3 py-1 rounded-full text-sm">
                          {leadingCandidate.votes} votes
                        </span>
                        <span className="bg-primary-200 text-primary-800 px-3 py-1 rounded-full text-sm">
                          {totalVotes > 0 
                            ? `${Math.round((leadingCandidate.votes / totalVotes) * 100)}%` 
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Chart */}
          <motion.div variants={item} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Vote Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Table */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-neutral-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Party
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Votes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {sortedCandidates.map((candidate, index) => (
                        <tr key={candidate.id} className={index === 0 ? 'bg-primary-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {candidate.image ? (
                                  <img 
                                    src={candidate.image}
                                    alt={candidate.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                                    <span className="text-neutral-600 font-medium">
                                      {candidate.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-neutral-900">
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-neutral-500">
                                  {candidate.position}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {candidate.party}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {candidate.votes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-neutral-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary-600 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-700 mt-1 inline-block">
                              {totalVotes > 0 
                                ? `${Math.round((candidate.votes / totalVotes) * 100)}%` 
                                : '0%'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;