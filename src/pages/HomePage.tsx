import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Vote, BarChart2, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import { useElectionStore } from '../stores/electionStore';

const HomePage = () => {
  const { settings } = useElectionStore();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.6 }
    })
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 sm:py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                {settings.electionTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-100">
                {settings.electionDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                {settings.isVotingOpen ? (
                  <Link to="/login">
                    <Button variant="secondary" size="lg">
                      Cast Your Vote
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="lg" disabled>
                    Voting Currently Closed
                  </Button>
                )}
                <Link to="/results">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary-700">
                    View Results
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={2}
              className="flex justify-center"
            >
              <div className="relative p-4">
                <div className="absolute inset-0 bg-white opacity-10 rounded-xl transform -rotate-6"></div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="p-6 bg-primary-700">
                    <h3 className="text-xl font-bold text-white">Election Status</h3>
                  </div>
                  <div className="p-6 bg-white text-neutral-800">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${settings.isVotingOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="font-medium">Voting is {settings.isVotingOpen ? 'Open' : 'Closed'}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${settings.showResults ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <p className="font-medium">Results are {settings.showResults ? 'Visible' : 'Hidden'}</p>
                      </div>
                      <div className="pt-4 text-center">
                        <Link to="/login">
                          <Button variant="primary" fullWidth>
                            Login to Vote
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">How Our Platform Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              SecureVote makes voting accessible, transparent, and secure for everyone
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="bg-white p-8 rounded-lg shadow-card"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Vote className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Easy Voting</h3>
              <p className="text-neutral-600 text-center">
                Cast your vote with just a few clicks from anywhere, on any device.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
              className="bg-white p-8 rounded-lg shadow-card"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Lock className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Secure & Private</h3>
              <p className="text-neutral-600 text-center">
                Advanced security measures ensure your vote is confidential and tamper-proof.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={3}
              className="bg-white p-8 rounded-lg shadow-card"
            >
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BarChart2 className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Real-time Results</h3>
              <p className="text-neutral-600 text-center">
                Watch the results update in real-time with beautiful, interactive visualizations.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={4}
              className="bg-white p-8 rounded-lg shadow-card"
            >
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-error-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Verified Identity</h3>
              <p className="text-neutral-600 text-center">
                Multi-factor authentication ensures only eligible voters can participate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">The Benefits of E-Voting</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Our e-voting platform transforms traditional voting processes, making them more accessible, efficient, and reliable.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Increased Accessibility</h3>
                    <p className="text-neutral-600">
                      Vote from anywhere, eliminating barriers for people with disabilities, remote voters, or those with busy schedules.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Cost Efficiency</h3>
                    <p className="text-neutral-600">
                      Reduce the expenses associated with paper ballots, staff, and physical polling stations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
                    <p className="text-neutral-600">
                      Eliminate paper waste and reduce the carbon footprint associated with traditional voting.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/6471923/pexels-photo-6471923.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Person voting on tablet" 
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="text-white text-xl md:text-2xl font-bold">
                    Vote anytime, anywhere
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security You Can Trust</h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              We've implemented multiple layers of security to ensure the integrity of every election
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="bg-neutral-800 p-8 rounded-lg border border-neutral-700"
            >
              <div className="w-14 h-14 bg-primary-900 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
              <p className="text-neutral-300">
                Multi-factor authentication and strict identity verification processes ensure only eligible voters can participate.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
              className="bg-neutral-800 p-8 rounded-lg border border-neutral-700"
            >
              <div className="w-14 h-14 bg-primary-900 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Encrypted Data</h3>
              <p className="text-neutral-300">
                All votes and personal information are encrypted using advanced cryptographic methods to guarantee privacy.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={3}
              className="bg-neutral-800 p-8 rounded-lg border border-neutral-700"
            >
              <div className="w-14 h-14 bg-primary-900 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Vote Verification</h3>
              <p className="text-neutral-300">
                Voters receive confirmation of their vote, ensuring it was correctly recorded in the system.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Got Questions?</h2>
              <p className="text-lg text-neutral-600">
                We're here to help with any questions about our e-voting platform
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="bg-neutral-50 rounded-lg shadow-card p-8"
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    placeholder="Your subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <div className="text-center">
                  <Button type="button" variant="primary" size="lg">
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to cast your vote?</h2>
            <p className="text-lg mb-8 text-primary-100">
              Join thousands of voters who trust our secure e-voting platform. Your vote matters!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Login to Vote
                </Button>
              </Link>
              <Link to="/results">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-white border-white hover:bg-white hover:text-primary-700"
                >
                  View Results
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;