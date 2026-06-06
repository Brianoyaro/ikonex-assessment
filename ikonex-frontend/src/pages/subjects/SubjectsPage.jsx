import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import FormField from '../../components/forms/FormField';
import FormInput from '../../components/forms/FormInput';
import { useApi } from '../../hooks/useApi';
import { subjectAPI } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const SubjectsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  const { data: subjects, isLoading, error, execute: fetchSubjects } = useApi(subjectAPI.getAll);
  const { execute: createSubject } = useApi(subjectAPI.create);
  const { execute: updateSubject } = useApi(subjectAPI.update);
  const { execute: deleteSubject } = useApi(subjectAPI.delete);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description
    });
    setShowModal(true);
  };

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteConfirm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.description) {
      alert('All fields are required');
      return;
    }

    try {
      if (isEditMode && selectedSubject) {
        await updateSubject(selectedSubject.id, formData);
      } else {
        await createSubject(formData);
      }
      setShowModal(false);
      setFormData({ name: '', code: '', description: '' });
      fetchSubjects();
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedSubject) {
      try {
        await deleteSubject(selectedSubject.id);
        setShowDeleteConfirm(false);
        setSelectedSubject(null);
        fetchSubjects();
      } catch (err) {
        console.error('Error deleting subject:', err);
      }
    }
  };

  const filteredSubjects = (subjects || []).filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Subject Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' }
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
            <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
            <p className="text-gray-600 mt-2">Manage academic subjects</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Subject
          </button>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Search */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by subject name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No subjects found</div>
          ) : (
            <Table
              columns={columns}
              data={filteredSubjects}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title={isEditMode ? 'Edit Subject' : 'Add New Subject'}>
        <div className="space-y-4">
          <FormField label="Subject Name" required>
            <FormInput
              type="text"
              placeholder="e.g., Mathematics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Subject Code" required>
            <FormInput
              type="text"
              placeholder="e.g., MATH101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Description" required>
            <FormInput
              type="text"
              placeholder="e.g., Core mathematics subject"
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
            Are you sure you want to delete subject <strong>{selectedSubject?.name}</strong>?
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

export default SubjectsPage;
