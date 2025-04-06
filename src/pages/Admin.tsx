import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  party: string;
  image_url: string;
}

interface EditingCandidate extends Candidate {
  isNew?: boolean;
}

export default function Admin() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<EditingCandidate | null>(null);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  async function checkAdminStatus() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
      if (data?.is_admin) {
        fetchCandidates();
      }
    } catch (err) {
      setError('Failed to check admin status');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCandidates() {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('name');

      if (error) throw error;
      setCandidates(data || []);
    } catch (err) {
      setError('Failed to fetch candidates');
    }
  }

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setError('');
  };

  const handleAdd = () => {
    setEditingCandidate({
      id: '',
      name: '',
      party: '',
      image_url: '',
      isNew: true,
    });
    setError('');
  };

  const validateCandidate = (candidate: EditingCandidate) => {
    if (!candidate.name.trim()) return 'Name is required';
    if (!candidate.party.trim()) return 'Party is required';
    if (!candidate.image_url.trim()) return 'Image URL is required';
    if (!candidate.image_url.startsWith('http')) return 'Invalid image URL';
    return null;
  };

  const handleSave = async () => {
    if (!editingCandidate) return;

    const validationError = validateCandidate(editingCandidate);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (editingCandidate.isNew) {
        const { error: insertError } = await supabase
          .from('candidates')
          .insert([{
            name: editingCandidate.name.trim(),
            party: editingCandidate.party.trim(),
            image_url: editingCandidate.image_url.trim(),
          }]);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('candidates')
          .update({
            name: editingCandidate.name.trim(),
            party: editingCandidate.party.trim(),
            image_url: editingCandidate.image_url.trim(),
          })
          .eq('id', editingCandidate.id);
        if (updateError) throw updateError;
      }

      setEditingCandidate(null);
      setError('');
      fetchCandidates();
    } catch (err) {
      setError('Failed to save candidate. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCandidates();
      setError('');
    } catch (err) {
      setError('Failed to delete candidate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
              Manage Candidates
            </h1>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Candidate</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-indigo-50 transition-colors duration-150">
                    {editingCandidate?.id === candidate.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingCandidate.image_url}
                            onChange={(e) => setEditingCandidate({
                              ...editingCandidate,
                              image_url: e.target.value,
                            })}
                            className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Image URL"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingCandidate.name}
                            onChange={(e) => setEditingCandidate({
                              ...editingCandidate,
                              name: e.target.value,
                            })}
                            className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Candidate Name"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingCandidate.party}
                            onChange={(e) => setEditingCandidate({
                              ...editingCandidate,
                              party: e.target.value,
                            })}
                            className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Party Name"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <img
                            src={candidate.image_url}
                            alt={candidate.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-100"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{candidate.name}</td>
                        <td className="px-6 py-4 text-gray-600">{candidate.party}</td>
                      </>
                    )}
                    <td className="px-6 py-4 text-right space-x-2">
                      {editingCandidate?.id === candidate.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Save className="h-4 w-4 mr-1.5" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCandidate(null)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                          >
                            <X className="h-4 w-4 mr-1.5" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4 mr-1.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(candidate.id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {editingCandidate?.isNew && (
                  <tr className="bg-indigo-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingCandidate.image_url}
                        onChange={(e) => setEditingCandidate({
                          ...editingCandidate,
                          image_url: e.target.value,
                        })}
                        className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Image URL"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingCandidate.name}
                        onChange={(e) => setEditingCandidate({
                          ...editingCandidate,
                          name: e.target.value,
                        })}
                        className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Candidate Name"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingCandidate.party}
                        onChange={(e) => setEditingCandidate({
                          ...editingCandidate,
                          party: e.target.value,
                        })}
                        className="w-full rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Party Name"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Save className="h-4 w-4 mr-1.5" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCandidate(null)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}