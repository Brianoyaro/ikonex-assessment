import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Alert from '../../components/common/Alert';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { classStreamAPI, subjectAPI, assessmentAPI, scoreAPI, studentAPI } from '../../api';
import { Save } from 'lucide-react';

const ScorePage = () => {
  const [classStreamId, setClassStreamId] = useState('');
  const [classSubjectId, setClassSubjectId] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [scores, setScores] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  const { data: classStreams, execute: fetchClassStreams } = useApi(classStreamAPI.getAll);
  const { data: assessments, execute: fetchAssessments } = useApi(assessmentAPI.getAll);
  const { data: classSubjects, execute: fetchClassSubjectsByStream } = useApi(subjectAPI.getClassSubjectsByStream);
  const { data: students, execute: fetchStudentsByStream } = useApi(studentAPI.getByStream);
  const { execute: createScore, isLoading: isSaving } = useApi(scoreAPI.create);

  useEffect(() => {
    fetchClassStreams();
    fetchAssessments();
  }, []);

  useEffect(() => {
    if (classStreamId) {
      fetchStudentsByStream(classStreamId);
      fetchClassSubjectsByStream(classStreamId);
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
    } else {
      setScores([]);
    }
  }, [students]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index].score = value === '' ? '' : parseFloat(value);
    setScores(newScores);
  };

  const handleSaveScores = async () => {
    setFormError('');
    if (!classStreamId || !classSubjectId || !assessmentId) {
      setFormError('Please select class, class subject, and assessment');
      return;
    }

    const invalidScores = scores.filter((s) => s.score !== '' && (s.score < 0 || s.score > 100));
    if (invalidScores.length > 0) {
      setFormError('All scores must be between 0 and 100');
      return;
    }

    const scoreRows = scores.filter((s) => s.score !== '');
    if (scoreRows.length === 0) {
      setFormError('Enter at least one score before saving');
      return;
    }

    try {
      await Promise.all(
        scoreRows.map((row) =>
          createScore({
            studentId: row.studentId,
            classSubjectId: Number(classSubjectId),
            assessmentId: Number(assessmentId),
            score: Number(row.score),
          })
        )
      );

      setSuccessMessage('Scores saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving one or more scores');
    }
  };

  const classStreamOptions = (Array.isArray(classStreams) ? classStreams : []).map((cs) => ({
    label: cs.name,
    value: String(cs.id)
  }));

  const classSubjectOptions = (Array.isArray(classSubjects) ? classSubjects : []).map((cs) => ({
    label: `${cs.name} (${cs.code})`,
    value: String(cs.id)
  }));

  const assessmentOptions = (Array.isArray(assessments) ? assessments : []).map((a) => ({
    label: `${a.assessmentName} - ${a.assessmentType} (${a.totalScore} pts)`,
    value: String(a.id)
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
        {formError && <Alert type="error" message={formError} />}

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
              name="classSubject"
              value={classSubjectId}
              onChange={(e) => setClassSubjectId(e.target.value)}
              options={classSubjectOptions}
              placeholder="Choose class subject"
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
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={20} />
                {isSaving ? 'Saving...' : 'Save Scores'}
              </button>
            </div>
          </div>
        )}

        {scores.length === 0 && classStreamId && classSubjectId && assessmentId && (
          <div className="text-center py-12 text-gray-500">
            <p>No students found in selected class or loading data...</p>
          </div>
        )}

        {!classStreamId && !classSubjectId && !assessmentId && (
          <div className="text-center py-12 text-gray-500">
            <p>Select a class, class subject, and assessment to begin entering scores</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScorePage;
