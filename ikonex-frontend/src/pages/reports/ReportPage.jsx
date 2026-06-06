import React, { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import FormSelect from '../../components/forms/FormSelect';
import { useApi } from '../../hooks/useApi';
import { classStreamAPI, subjectAPI, assessmentAPI, scoreAPI } from '../../api';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportPage = () => {
  const [reportType, setReportType] = useState('class');
  const [classStreamId, setClassStreamId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportRef = useRef();

  const { data: classStreams = [] } = useApi(classStreamAPI.getAll);
  const { data: subjects = [] } = useApi(subjectAPI.getAll);
  const { data: assessments = [] } = useApi(assessmentAPI.getAll);
  const { execute: fetchClassReport } = useApi(scoreAPI.getClassReport);
  const { execute: fetchStudentReport } = useApi(scoreAPI.getStudentReport);

  const handleGenerateReport = async () => {
    if (reportType === 'class' && (!classStreamId || !assessmentId)) {
      alert('Please select class and assessment');
      return;
    }
    if (reportType === 'student' && !subjectId) {
      alert('Please select subject');
      return;
    }

    setIsLoading(true);
    try {
      let data;
      if (reportType === 'class') {
        data = await fetchClassReport(classStreamId, assessmentId);
      } else {
        data = await fetchStudentReport(subjectId);
      }
      setReportData(data);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Error generating report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth, imgHeight);
      heightLeft -= 280;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth, imgHeight);
        heightLeft -= 280;
      }

      const filename = `report_${reportType}_${new Date().getTime()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Error exporting PDF');
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
    label: `${a.assessmentName} - ${a.assessmentType}`,
    value: a.id.toString()
  }));

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
                value="subject"
                checked={reportType === 'subject'}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportData(null);
                }}
                className="w-4 h-4"
              />
              <span>Subject Report</span>
            </label>
          </div>

          {/* Selection Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {reportType === 'class' && (
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
              </>
            )}
            {reportType === 'subject' && (
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

              {reportType === 'class' && reportData?.classResults && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Class Performance</h3>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Class Name</p>
                      <p className="text-xl font-bold">{reportData.classResults.className}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Assessment</p>
                      <p className="text-xl font-bold">{reportData.classResults.assessmentName}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Average Score</p>
                      <p className="text-xl font-bold">{reportData.classResults.averageScore?.toFixed(2) || 'N/A'}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-gray-600 text-sm">Pass Rate</p>
                      <p className="text-xl font-bold">{reportData.classResults.passRate?.toFixed(1) || 'N/A'}%</p>
                    </div>
                  </div>

                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Admission #</th>
                        <th className="border px-4 py-2 text-left">Student Name</th>
                        <th className="border px-4 py-2 text-center">Score</th>
                        <th className="border px-4 py-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.classResults.studentScores?.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border px-4 py-2">{item.admissionNumber}</td>
                          <td className="border px-4 py-2">{item.studentName}</td>
                          <td className="border px-4 py-2 text-center">{item.score?.toFixed(2) || '-'}</td>
                          <td className="border px-4 py-2 text-center font-bold">{item.grade || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportType === 'subject' && reportData?.subjectResults && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Subject Performance</h3>
                  <div className="mb-6 bg-blue-50 p-4 rounded">
                    <p className="text-gray-600 text-sm">Subject</p>
                    <p className="text-2xl font-bold">{reportData.subjectResults.subjectName}</p>
                  </div>

                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Admission #</th>
                        <th className="border px-4 py-2 text-left">Student Name</th>
                        <th className="border px-4 py-2 text-center">Class</th>
                        <th className="border px-4 py-2 text-center">Average Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.subjectResults.studentPerformance?.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border px-4 py-2">{item.admissionNumber}</td>
                          <td className="border px-4 py-2">{item.studentName}</td>
                          <td className="border px-4 py-2 text-center">{item.className}</td>
                          <td className="border px-4 py-2 text-center font-bold">
                            {item.averageScore?.toFixed(2) || '-'}
                          </td>
                        </tr>
                      ))}
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
