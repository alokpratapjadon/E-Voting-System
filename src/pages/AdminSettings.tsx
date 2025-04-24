import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Save, ArrowLeft, AlertTriangle, Clock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { useElectionStore, ElectionSettings } from '../stores/electionStore';

const AdminSettings = () => {
  const { settings, updateSettings } = useElectionStore();
  const [formData, setFormData] = useState<ElectionSettings>({
    ...settings
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof ElectionSettings) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateSettings(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
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
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Election Settings</h1>
              <p className="text-neutral-600">
                Configure the core settings for your election
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Basic Settings Card */}
            <motion.div variants={item} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Input
                      id="electionTitle"
                      name="electionTitle"
                      label="Election Title"
                      value={formData.electionTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., 2025 Presidential Election"
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="electionDescription" className="block text-sm font-medium text-neutral-700 mb-1">
                      Election Description
                    </label>
                    <textarea
                      id="electionDescription"
                      name="electionDescription"
                      rows={4}
                      className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      placeholder="Describe the purpose and scope of this election"
                      value={formData.electionDescription}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Control Settings Card */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Election Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg bg-white">
                      <div className="flex items-start">
                        <div className="mr-3 bg-primary-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Voting Status</h3>
                          <p className="text-neutral-600">
                            {formData.isVotingOpen 
                              ? 'Voting is currently open. Voters can cast their ballots.' 
                              : 'Voting is currently closed. No new votes can be cast.'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant={formData.isVotingOpen ? 'danger' : 'success'}
                          onClick={() => handleToggleChange('isVotingOpen')}
                        >
                          {formData.isVotingOpen ? 'Close Voting' : 'Open Voting'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg bg-white">
                      <div className="flex items-start">
                        <div className="mr-3 bg-primary-100 p-2 rounded-full">
                          {formData.showResults ? (
                            <Eye className="h-5 w-5 text-primary-600" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Results Visibility</h3>
                          <p className="text-neutral-600">
                            {formData.showResults 
                              ? 'Results are publicly visible to all users.' 
                              : 'Results are hidden from public view.'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant={formData.showResults ? 'outline' : 'primary'}
                          onClick={() => handleToggleChange('showResults')}
                        >
                          {formData.showResults ? 'Hide Results' : 'Show Results'}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-warning-800 font-medium">Important Note</h4>
                          <p className="text-warning-700 text-sm mt-1">
                            Changes to these settings take effect immediately. Make sure to communicate timing changes to your voters.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {saveSuccess && (
                    <div className="mr-4 text-green-600 flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Check className="h-4 w-4" />
                      </span>
                      Settings saved successfully!
                    </div>
                  )}
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Import Check icon that we use in the function
import { Check } from 'lucide-react';

export default AdminSettings;