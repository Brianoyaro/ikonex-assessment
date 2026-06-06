import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { classStreamAPI, subjectAPI, assessmentAPI, scoreAPI } from '../../api';
import { Save } from 'lucide-react';

const ScorePage = () => {
  const [classStreamId, setClassStreamId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [scores, setScores] = useState([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: classStreams = [] } = useApi(classStreamAPI.getAll);
  const { data: subjects = [] } = useApi(subjectAPI.getAll);
  const { data: assessments = [] } = useApi(assessmentAPI.getAll);
  const { data: students = [], execute: fetchStudents } = useApi(classStreamAPI.getStudents);
  const { execute: saveScores } = useApi(scoreAPI.bulkCreate);

  useEffect(() => {
    if (classStreamId) {
      fetchStudents(classStreamId);
    }
  }, [classStreamId]);

  useEffect(() => {
    if (students && students.length > 0) {
      setScores(
        students.map(student => ({
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber,
          score: ''
        }))
      );
    }
  }, [students]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index].score = value === '' ? '' : parseFloat(value);
    setScores(newScores);
  };

  const handleSaveScores = async () => {
    if (!classStreamId || !subjectId || !assessmentId) {
      alert('Please select class, subject, and assessment');
      return;
    }

    const invalidScores = scores.filter(s => s.score !== '' && (s.score < 0 || s.score > 100));
    if (invalidScores.length > 0) {
      alert('All scores must be between 0 and 100');
      return;
    }

    try {
      const payload = {
        classStreamId: parseInt(classStreamId),
        subjectId: parseInt(subjectId),
        assessmentId: parseInt(assessmentId),
        scores: scores
          .filter(s => s.score !== '')
          .map(s => ({
            studentId: s.studentId,
            studentScore: s.score
          }))
      };

      await saveScores(payload);
      setSuccessMessage('Scores saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setScores([]);
      setClassStreamId('');
      setSubjectId('');
      setAssessmentId('');
    } catch (err) {
      console.error('Error saving scores:', err);
      alert('Error saving scores: ' + (err.message || 'Unknown error'));
    }
  };

  const classStreamOptions = (classStreams || []).map(cs => ({
    label: cs.name,
    value: cs.id.toString()
  }));

  const subjectOptions = (subjects || []).map(s => ({
    label: `${s.name} (${s.code})`,
    value: s.id.toString()
  }));

  const assessmentOptions = (assessments || []).map(a => ({
    label: `${a.assessmentName} - ${a.assessmentType} (${a.totalScore} pts)`,
    value: a.id.toString()
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Record Scores</h1>
          <p className="text-gray-600 mt-2">Enter student scores for assessments</p>
        </div>

        {successMessage && <Alert type="success" message={successMessage} />}

        {/* Selection Panel */}
        <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <FormSelect
              name="classStream"
              value={classStreamId}
              onChange={(e) => setClassStreamId(e.target.value)}
              options={classStreamOptions}
              placeholder="Choose class"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <FormSelect
              name="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              options={subjectOptions}
              placeholder="Choose subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Assessment
            </label>
            <FormSelect
              name="assessment"
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              options={assessmentOptions}
              placeholder="Choose assessment"
            />
          </div>
        </div>

        {/* Scores Grid */}
        {scores.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Admission #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scores.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.admissionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={item.score}
                          onChange={(e) => handleScoreChange(idx, e.target.value)}
                          placeholder="0-100"
                          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
              <button
                onClick={handleSaveScores}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={20} />
                Save All Scores
              </button>
            </div>
          </div>
        )}

        {scores.length === 0 && classStreamId && subjectId && assessmentId && (
          <div className="text-center py-12 text-gray-500">
            <p>No students found in selected class or loading data...</p>
          </div>
        )}

        {!classStreamId && !subjectId && !assessmentId && (
          <div className="text-center py-12 text-gray-500">
            <p>Select a class, subject, and assessment to begin entering scores</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScorePage;
