import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { classStreamAPI, subjectAPI, studentAPI, assessmentAPI } from '../../api';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { toPng } from 'html-to-image';

const ReportPage = () => {
  const [reportType, setReportType] = useState('class');
  const [classStreamId, setClassStreamId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const reportRef = useRef();

  const { data: classStreams = [], execute: fetchClassStreams } = useApi(classStreamAPI.getAll);
  const { data: students = [], execute: fetchStudents } = useApi(studentAPI.getAll);
  const { execute: fetchClassReport } = useApi(classStreamAPI.getReport);
  const { execute: fetchSubjectPosition } = useApi(subjectAPI.getSubjectPositionsByStream);
  const { execute: fetchStudentReport } = useApi(studentAPI.getResults);

  // get all assessments and display them when student is selected i.e. in the student report card. This is to ensure we have the latest assessments in case new ones were added after the initial load of the page

  const { data: assessments = [], execute: fetchAssessments } = useApi(assessmentAPI.getAll);

  // console.log(`assessments`, assessments);

  useEffect(() => {
    fetchClassStreams();
    fetchStudents();
    fetchAssessments();
  }, []);
  const handleGenerateReport = async () => {
    setError('');
    if ((reportType === 'class' || reportType === 'subject') && !classStreamId) {
      setError('Please select class stream');
      return;
    }
    if (reportType === 'student' && !studentId) {
      setError('Please select a student');
      return;
    }

    setIsLoading(true);
    try {
      let data;
      if (reportType === 'class') {
        data = await fetchClassReport(classStreamId);
      } else if (reportType === 'subject') {
        data = await fetchSubjectPosition(classStreamId);
      } else {
        data = await fetchStudentReport(studentId);
      }


      // console.log('Report data:', data);


      setReportData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const element = reportRef.current;

    const dataUrl = await toPng(element, {
      pixelRatio: 2
    });

    // const pdf = new jsPDF('landscape', 'mm', 'a4');

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

    pdf.addImage(dataUrl, 'PNG', 10, 10, 280, 0);

    // pdf.save('report.pdf');
    const filename = `report_${reportType}_${new Date().getTime()}.pdf`;
    pdf.save(filename);
  };

  const classStreamOptions = (Array.isArray(classStreams) ? classStreams : []).map(cs => ({
    label: cs.name,
    value: cs.id.toString()
  }));

  const studentOptions = (Array.isArray(students) ? students : []).map(s => ({
    label: `${s.firstName} ${s.lastName} (${s.admissionNumber})`,
    value: s.id.toString()
  }));

  const getAssessmentScores = (scores = []) => {
    
    const getAssessmentType = (assessmentName) => {
      const parts = assessmentName.split('-').map(p => p.trim());
      // console.log('parts', parts);

      return parts.length === 2
        ? parts[1]
        : parts[1] + "_TERM" ;
    };

    let obj = {
      TERM_ONE: {
        CAT_1: '-',
        CAT_2: '-',
        MID_TERM: '-',
        END_TERM: '-'
      },
      TERM_TWO: {
        CAT_1: '-',
        CAT_2: '-',
        MID_TERM: '-',
        END_TERM: '-'
      },
      TERM_THREE: {
        CAT_1: '-',
        CAT_2: '-',
        MID_TERM: '-',
        END_TERM: '-'
      }
    };
    
    scores.forEach(score => {
      obj[score.assessmentTerm][getAssessmentType(score.assessmentName).replace(' ', '_').toUpperCase()] = score.studentScore;
    });
    // console.log('Final assessments object', obj);
    return obj;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and export student performance reports</p>
        </div>

        {/* Report Type Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Report Type</h2>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="class"
                checked={reportType === 'class'}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportData(null);
                }}
                className="w-4 h-4"
              />
              <span>Class Performance Report</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="student"
                checked={reportType === 'student'}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportData(null);
                }}
                className="w-4 h-4"
              />
              <span>Student Report Card</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="subject"
                checked={reportType === 'subject'}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportData(null);
                }}
                className="w-4 h-4"
              />
              <span>Subject Positions By Class</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          {/* Selection Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(reportType === 'class' || reportType === 'subject') && (
              <>
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
              </>
            )}
            {reportType === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <FormSelect
                  name="student"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  options={studentOptions}
                  placeholder="Choose student"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {/* Report Display */}
        {reportData && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Report Results</h2>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} />
                Export as PDF
              </button>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="bg-white p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Ikonex SMS Report</h1>
                <p className="text-gray-600">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>

              {reportType === 'class' && Array.isArray(reportData) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Class Performance</h3>
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-center">Position</th>
                        <th className="border px-4 py-2 text-left">Admission #</th>
                        <th className="border px-4 py-2 text-left">Student Name</th>
                        <th className="border px-4 py-2 text-center">Overall Total</th>
                        <th className="border px-4 py-2 text-center">Overall Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border px-4 py-2 text-center">{item.studentPosition ?? '-'}</td>
                          <td className="border px-4 py-2">{item.admissionNumber}</td>
                          <td className="border px-4 py-2">{item.studentName}</td>
                          <td className="border px-4 py-2 text-center">{item.overallTotal ?? '-'}</td>
                          <td className="border px-4 py-2 text-center font-bold">{item.overallAverage ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportType === 'subject' && Array.isArray(reportData) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Subject Positions</h3>

                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Class</th>
                        <th className="border px-4 py-2 text-left">Subject</th>
                        <th className="border px-4 py-2 text-center">Total</th>
                        <th className="border px-4 py-2 text-center">Average</th>
                        <th className="border px-4 py-2 text-center">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border px-4 py-2">{item.classStreamName}</td>
                          <td className="border px-4 py-2">{item.subjectName}</td>
                          <td className="border px-4 py-2 text-center">{item.classSubjectTotal}</td>
                          <td className="border px-4 py-2 text-center">{item.classSubjectAverage}</td>
                          <td className="border px-4 py-2 text-center font-bold">{item.classSubjectPosition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportType === 'student' && reportData && !Array.isArray(reportData) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Student Report Card</h3>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Student</p>
                      <p className="text-xl font-bold">{reportData.studentName}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Admission Number</p>
                      <p className="text-xl font-bold">{reportData.admissionNumber}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Overall Total</p>
                      <p className="text-xl font-bold">{reportData.overallTotal}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Overall Average</p>
                      <p className="text-xl font-bold">{reportData.overallAverage}</p>
                    </div>
                  </div>

                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                          <th rowSpan="2" className="border px-4 py-2 text-left">Subject</th>

                          <th colSpan="4" className="border px-4 py-2 text-center">Term 1</th>
                          <th colSpan="4" className="border px-4 py-2 text-center">Term 2</th>
                          <th colSpan="4" className="border px-4 py-2 text-center">Term 3</th>

                          <th rowSpan="2" className="border px-4 py-2 text-center">Total</th>
                          <th rowSpan="2" className="border px-4 py-2 text-center">Average</th>
                          <th rowSpan="2" className="border px-4 py-2 text-center">Grade</th>
                        </tr>

                        <tr>
                          <th className="border px-4 py-2 text-center">CAT 1</th>
                          <th className="border px-4 py-2 text-center">CAT 2</th>
                          <th className="border px-4 py-2 text-center">MID</th>
                          <th className="border px-4 py-2 text-center">END</th>

                          <th className="border px-4 py-2 text-center">CAT 1</th>
                          <th className="border px-4 py-2 text-center">CAT 2</th>
                          <th className="border px-4 py-2 text-center">MID</th>
                          <th className="border px-4 py-2 text-center">END</th>

                          <th className="border px-4 py-2 text-center">CAT 1</th>
                          <th className="border px-4 py-2 text-center">CAT 2</th>
                          <th className="border px-4 py-2 text-center">MID</th>
                          <th className="border px-4 py-2 text-center">END</th>
                        </tr>
                      </thead>
                    <tbody>
                      {(reportData.subjects || []).map((subject, idx) => {
                        const assessments = getAssessmentScores(subject.scores);
                        // console.log(`assessments for ${subject.subjectName}`, assessments);

                        return (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-gray-50' : ''}
                          >
                            <td className="border px-4 py-2">
                              {subject.subjectName}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_ONE.CAT_1}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_ONE.CAT_2}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_ONE.MID_TERM}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_ONE.END_TERM}
                            </td>
                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_TWO.CAT_1}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_TWO.CAT_2}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_TWO.MID_TERM}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_TWO.END_TERM}
                            </td>
                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_THREE.CAT_1}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_THREE.CAT_2}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_THREE.MID_TERM}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {assessments.TERM_THREE.END_TERM}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {subject.total}
                            </td>

                            <td className="border px-4 py-2 text-center">
                              {subject.average}
                            </td>

                            <td className="border px-4 py-2 text-center font-bold">
                              {subject.grade}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {!reportData && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="mx-auto mb-4" size={48} />
            <p>Select options above to generate a report</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportPage;
