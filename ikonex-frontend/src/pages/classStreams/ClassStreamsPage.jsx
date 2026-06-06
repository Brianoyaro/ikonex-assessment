import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import FormField from '../../components/forms/FormField';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { classStreamAPI } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ClassStreamsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    formLevel: '',
    description: ''
  });

  const { data: classStreams, isLoading, error, execute: fetchStreams } = useApi(classStreamAPI.getAll);
  const { execute: createStream } = useApi(classStreamAPI.create);
  const { execute: updateStream } = useApi(classStreamAPI.update);
  const { execute: deleteStream } = useApi(classStreamAPI.delete);

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({ name: '', formLevel: '', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (stream) => {
    setIsEditMode(true);
    setSelectedStream(stream);
    setFormData({
      name: stream.name,
      formLevel: stream.formLevel.toString(),
      description: stream.description
    });
    setShowModal(true);
  };

  const handleDeleteClick = (stream) => {
    setSelectedStream(stream);
    setShowDeleteConfirm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.formLevel || !formData.description) {
      alert('All fields are required');
      return;
    }

    try {
      if (isEditMode && selectedStream) {
        await updateStream(selectedStream.id, {
          ...formData,
          formLevel: parseInt(formData.formLevel)
        });
      } else {
        await createStream({
          ...formData,
          formLevel: parseInt(formData.formLevel)
        });
      }
      setShowModal(false);
      setFormData({ name: '', formLevel: '', description: '' });
      fetchStreams();
    } catch (err) {
      console.error('Error saving class stream:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedStream) {
      try {
        await deleteStream(selectedStream.id);
        setShowDeleteConfirm(false);
        setSelectedStream(null);
        fetchStreams();
      } catch (err) {
        console.error('Error deleting class stream:', err);
      }
    }
  };

  const filteredStreams = (classStreams || []).filter(stream =>
    stream.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'formLevel', label: 'Form Level' },
    { key: 'description', label: 'Description' }
  ];

  const formLevels = [
    { label: 'Form 1', value: '1' },
    { label: 'Form 2', value: '2' },
    { label: 'Form 3', value: '3' },
    { label: 'Form 4', value: '4' }
  ];

  if (isLoading) {
    return <Layout><div className="flex justify-center items-center h-screen">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-2">Manage class streams</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Class
          </button>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Search */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {filteredStreams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No classes found</div>
          ) : (
            <Table
              columns={columns}
              data={filteredStreams}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title={isEditMode ? 'Edit Class' : 'Add New Class'}>
        <div className="space-y-4">
          <FormField label="Class Name" required>
            <FormInput
              type="text"
              placeholder="e.g., Form 1A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Form Level" required>
            <FormSelect
              name="formLevel"
              value={formData.formLevel}
              onChange={(e) => setFormData({ ...formData, formLevel: e.target.value })}
              options={formLevels}
              placeholder="Select form level"
              required
            />
          </FormField>

          <FormField label="Description" required>
            <FormInput
              type="text"
              placeholder="e.g., Junior secondary stream"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </FormField>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete class <strong>{selectedStream?.name}</strong>?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ClassStreamsPage;
