import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useElectionStore, Candidate } from '../stores/electionStore';

type EditingCandidate = Partial<Omit<Candidate, 'id' | 'votes'>> & { id?: string };

const AdminCandidates = () => {
  const { candidates, addCandidate, updateCandidate, deleteCandidate } = useElectionStore();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditingCandidate>({
    name: '',
    party: '',
    position: '',
    image: '',
    bio: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      party: '',
      position: '',
      image: '',
      bio: '',
    });
    setIsAddMode(false);
    setEditingId(null);
    setDeleteConfirmId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddMode(true);
  };

  const handleEdit = (candidate: Candidate) => {
    setFormData({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      position: candidate.position,
      image: candidate.image || '',
      bio: candidate.bio,
    });
    setEditingId(candidate.id);
    setIsAddMode(false);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSave = () => {
    if (!formData.name || !formData.party || !formData.position || !formData.bio) {
      // Show validation error
      return;
    }

    if (isAddMode) {
      // Add new candidate
      addCandidate({
        name: formData.name || '',
        party: formData.party || '',
        position: formData.position || '',
        image: formData.image,
        bio: formData.bio || '',
      });
    } else if (editingId) {
      // Update existing candidate
      updateCandidate(editingId, {
        name: formData.name,
        party: formData.party,
        position: formData.position,
        image: formData.image,
        bio: formData.bio,
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      // Confirmed delete
      deleteCandidate(id);
      setDeleteConfirmId(null);
    } else {
      // Ask for confirmation
      setDeleteConfirmId(id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
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
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
              <p className="text-neutral-600">
                Add, edit, or remove candidates from the election
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNew}
                disabled={isAddMode || editingId !== null}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add New Candidate
              </Button>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Add/Edit Form */}
            {(isAddMode || editingId) && (
              <motion.div variants={item} className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isAddMode ? 'Add New Candidate' : 'Edit Candidate'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          id="name"
                          name="name"
                          label="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          fullWidth
                        />
                        <Input
                          id="party"
                          name="party"
                          label="Party/Affiliation"
                          value={formData.party}
                          onChange={handleInputChange}
                          placeholder="Democratic Party"
                          fullWidth
                        />
                        <Input
                          id="position"
                          name="position"
                          label="Position Running For"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder="President"
                          fullWidth
                        />
                        <Input
                          id="image"
                          name="image"
                          label="Profile Image URL"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          fullWidth
                        />
                        <div className="text-sm text-neutral-500 mb-4">
                          <span className="text-neutral-700 font-medium">Image Preview: </span>
                          {formData.image ? (
                            <img 
                              src={formData.image}
                              alt="Preview"
                              className="mt-2 w-20 h-20 object-cover rounded-full border border-neutral-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                              }}
                            />
                          ) : (
                            <div className="mt-2 w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
                            Candidate Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={6}
                            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                            placeholder="Enter candidate biography and key information..."
                            value={formData.bio}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                          <Button 
                            variant="outline" 
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            onClick={handleSave}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {isAddMode ? 'Add Candidate' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Candidates List */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2" />
                    Current Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {candidates.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                      <UserCheck className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-lg font-medium">No candidates yet</p>
                      <p className="mt-2">Add your first candidate to get started</p>
                      <Button 
                        variant="primary" 
                        className="mt-4"
                        onClick={handleAddNew}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add New Candidate
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-200">
                      {candidates.map((candidate) => (
                        <div 
                          key={candidate.id} 
                          className={`py-4 ${
                            editingId === candidate.id ? 'bg-primary-50' : ''
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-shrink-0">
                              {candidate.image ? (
                                <img 
                                  src={candidate.image}
                                  alt={candidate.name}
                                  className="w-20 h-20 object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
                                  <span className="text-lg font-medium text-neutral-600">
                                    {candidate.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold">{candidate.name}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-sm bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                                  {candidate.position}
                                </span>
                                <span className="text-sm bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full">
                                  {candidate.party}
                                </span>
                                <span className="text-sm bg-secondary-100 text-secondary-800 px-2 py-0.5 rounded-full">
                                  {candidate.votes} votes
                                </span>
                              </div>
                              <p className="text-neutral-600 line-clamp-2">{candidate.bio}</p>
                            </div>
                            <div className="flex gap-2 items-start">
                              {deleteConfirmId === candidate.id ? (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleCancelDelete}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(candidate.id)}
                                  >
                                    Confirm
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(candidate)}
                                    disabled={editingId !== null || isAddMode}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(candidate.id)}
                                    disabled={editingId !== null || isAddMode}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCandidates;