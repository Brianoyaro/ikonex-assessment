import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useApi } from '../../hooks/useApi';
import { studentAPI, classStreamAPI } from '../../api';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import FormField from '../../components/forms/FormField';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import Loading from '../../components/common/Loading';
import { Edit, Trash2, Plus } from 'lucide-react';

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const STUDENT_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const toSelectOptions = (streams = []) =>
  (Array.isArray(streams) ? streams : []).map((stream) => ({ value: String(stream.id), label: stream.name }));

const StudentsPage = () => {
  const [students, setStudents] = useState([]);  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    gender: 'MALE',
    status: 'ACTIVE',
    dateOfBirth: '',
    classStreamId: '',
  });

  const {
    data: allStudents,
    isLoading,
    error: apiError,
    execute: fetchStudents,
  } = useApi(studentAPI.getAll);

  const {
    data: classStreams,
    execute: fetchClassStreams,
  } = useApi(classStreamAPI.getAll);

  const {
    execute: createStudent,
    isLoading: isCreating,
  } = useApi((data) => studentAPI.create(data));

  const {
    execute: updateStudent,
    isLoading: isUpdating,
  } = useApi((id, data) => studentAPI.update(id, data));

  const {
    execute: deleteStudent,
    isLoading: isDeleting,
  } = useApi((id) => studentAPI.delete(id));

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
    fetchClassStreams();
  }, []);

  // Update students from API
  useEffect(() => {
    if (allStudents) {
      setStudents(Array.isArray(allStudents) ? allStudents : []);
    }
  }, [allStudents]);

  const handleOpenModal = (student = null) => {
    setFormError('');
    if (student) {
      setEditingId(student.id);
      setFormData({
        admissionNumber: student.admissionNumber || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        gender: student.gender || 'MALE',
        status: student.status || 'ACTIVE',
        dateOfBirth: student.dateOfBirth || '',
        classStreamId: student.classStreamId ? String(student.classStreamId) : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        admissionNumber: '',
        firstName: '',
        lastName: '',
        gender: 'MALE',
        status: 'ACTIVE',
        dateOfBirth: '',
        classStreamId: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.admissionNumber.trim()) {
      setFormError('Admission number is required');
      return false;
    }
    if (!formData.firstName.trim()) {
      setFormError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setFormError('Last name is required');
      return false;
    }
    if (!formData.dateOfBirth) {
      setFormError('Date of birth is required');
      return false;
    }
    if (!formData.classStreamId) {
      setFormError('Class stream is required');
      return false;
    }
    return true;
  };

  const handleSaveStudent = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateStudent(editingId, {
          ...formData,
          classStreamId: Number(formData.classStreamId),
        });
        setSuccessMessage('Student updated successfully');
      } else {
        await createStudent({
          ...formData,
          classStreamId: Number(formData.classStreamId),
        });
        setSuccessMessage('Student created successfully');
      }
      handleCloseModal();
      fetchStudents();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to save student');
    }
  };

  const handleDeleteClick = (student) => {
    setDeleteId(student.id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStudent(deleteId);
      setSuccessMessage('Student deleted successfully');
      setShowDeleteConfirm(false);
      fetchStudents();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to delete student');
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const firstName = student.firstName || '';
    const lastName = student.lastName || '';
    const admissionNumber = student.admissionNumber || '';
    const matchesSearch =
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'admissionNumber', label: 'Admission #', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'classStreamName', label: 'Class', sortable: true },
    { key: 'dateOfBirth', label: 'DOB', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <Layout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Alerts */}
      {apiError && <Alert type="error" message={apiError} />}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or admission #..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          {STUDENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filteredStudents.length > 0 ? (
        <Table columns={columns} data={filteredStudents} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No students found
        </div>
      )}

      {/* Student Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Student' : 'Add New Student'}
      >
        {formError && (
          <Alert
            type="error"
            message={formError}
            onClose={() => setFormError('')}
          />
        )}

        <form className="space-y-4">
          <FormField label="Admission Number" required>
            <FormInput
              type="text"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleFormChange}
              placeholder="e.g., STU2024001"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <FormInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                placeholder="John"
              />
            </FormField>

            <FormField label="Last Name" required>
              <FormInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                placeholder="Doe"
              />
            </FormField>
          </div>

          <FormField label="Date of Birth" required>
            <FormInput
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleFormChange}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gender">
              <FormSelect
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                options={GENDERS}
              />
            </FormField>

            <FormField label="Status">
              <FormSelect
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                options={STUDENT_STATUSES}
              />
            </FormField>
          </div>

          <FormField label="Class Stream ID">
            <FormSelect
              name="classStreamId"
              value={formData.classStreamId}
              onChange={handleFormChange}
              options={toSelectOptions(classStreams || [])}
              placeholder="Select class stream"
            />
          </FormField>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStudent}
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this student? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </Layout>
  );
};

export default StudentsPage;
