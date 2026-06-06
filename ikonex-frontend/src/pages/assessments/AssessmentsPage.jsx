import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import FormField from '../../components/forms/FormField';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { assessmentAPI } from '../../api';
import { Plus } from 'lucide-react';

const AssessmentsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    assessmentName: '',
    assessmentType: '',
    totalScore: '',
    term: '',
    year: ''
  });

  const { data: assessments, isLoading, error, execute: fetchAssessments } = useApi(assessmentAPI.getAll);
  const { execute: createAssessment } = useApi(assessmentAPI.create);
  const { execute: updateAssessment } = useApi(assessmentAPI.update);
  const { execute: deleteAssessment } = useApi(assessmentAPI.delete);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({
      assessmentName: '',
      assessmentType: '',
      totalScore: '',
      term: '',
      year: ''
    });
    setShowModal(true);
  };

  const handleEditClick = (assessment) => {
    setIsEditMode(true);
    setSelectedAssessment(assessment);
    setFormData({
      assessmentName: assessment.assessmentName,
      assessmentType: assessment.assessmentType,
      totalScore: assessment.totalScore != null ? String(assessment.totalScore) : '',
      term: assessment.term,
      year: assessment.year || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteConfirm(true);
  };

  const handleSave = async () => {
    if (!formData.assessmentName || !formData.assessmentType || !formData.totalScore || !formData.term || !formData.year) {
      alert('All fields are required');
      return;
    }

    try {
      const payload = {
        assessmentName: formData.assessmentName,
        assessmentType: formData.assessmentType,
        totalScore: parseFloat(formData.totalScore),
        term: formData.term,
        year: formData.year
      };

      if (isEditMode && selectedAssessment) {
        await updateAssessment(selectedAssessment.id, payload);
      } else {
        await createAssessment(payload);
      }
      setShowModal(false);
      setFormData({
        assessmentName: '',
        assessmentType: '',
        totalScore: '',
        term: '',
        year: ''
      });
      fetchAssessments();
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedAssessment) {
      try {
        await deleteAssessment(selectedAssessment.id);
        setShowDeleteConfirm(false);
        setSelectedAssessment(null);
        fetchAssessments();
      } catch (err) {
        console.error('Error deleting assessment:', err);
      }
    }
  };

  const filteredAssessments = (assessments || []).filter(assessment =>
    assessment.assessmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'assessmentName', label: 'Assessment Name' },
    { key: 'assessmentType', label: 'Type' },
    { key: 'totalScore', label: 'Total Score' },
    { key: 'term', label: 'Term' },
    { key: 'year', label: 'Year' }
  ];

  const assessmentTypes = [
    { label: 'CAT 1', value: 'CAT_1' },
    { label: 'CAT 2', value: 'CAT_2' },
    { label: 'Mid-Term Exam', value: 'MID_TERM' },
    { label: 'End-Term Exam', value: 'END_TERM' },
  ];

  const terms = [
    { label: 'Term 1', value: 'TERM_ONE' },
    { label: 'Term 2', value: 'TERM_TWO' },
    { label: 'Term 3', value: 'TERM_THREE' }
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
            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600 mt-2">Manage assessments and tests</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Assessment
          </button>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Search */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by assessment name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No assessments found</div>
          ) : (
            <Table
              columns={columns}
              data={filteredAssessments}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditMode ? 'Edit Assessment' : 'Add New Assessment'}>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <FormField label="Assessment Name" required>
            <FormInput
              type="text"
              placeholder="e.g., Mathematics CAT 1"
              value={formData.assessmentName}
              onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Assessment Type" required>
            <FormSelect
              name="assessmentType"
              value={formData.assessmentType}
              onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
              options={assessmentTypes}
              placeholder="Select assessment type"
              required
            />
          </FormField>

          <FormField label="Total Score" required>
            <FormInput
              type="number"
              placeholder="e.g., 100"
              value={formData.totalScore}
              onChange={(e) => setFormData({ ...formData, totalScore: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Term" required>
            <FormSelect
              name="term"
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              options={terms}
              placeholder="Select term"
              required
            />
          </FormField>

          <FormField label="Assessment Date" required>
            <FormInput
              type="date"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </FormField>

          <div className="flex gap-2 justify-end pt-2">
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
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedAssessment?.assessmentName}</strong>?
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

export default AssessmentsPage;
