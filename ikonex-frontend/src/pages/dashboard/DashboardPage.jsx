import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import { studentAPI, classStreamAPI, subjectAPI, assessmentAPI } from '../../api';
import Loading from '../../components/common/Loading';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    classStreams: 0,
    subjects: 0,
    assessments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, streamsRes, subjectsRes, assessmentsRes] =
          await Promise.all([
            studentAPI.getAll(),
            classStreamAPI.getAll(),
            subjectAPI.getAll(),
            assessmentAPI.getAll(),
          ]);

        setStats({
          students: studentsRes.data?.length || 0,
          classStreams: streamsRes.data?.length || 0,
          subjects: subjectsRes.data?.length || 0,
          assessments: assessmentsRes.data?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Ikonex Student Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: stats.students, color: 'indigo' },
          { label: 'Class Streams', value: stats.classStreams, color: 'blue' },
          { label: 'Subjects', value: stats.subjects, color: 'green' },
          { label: 'Assessments', value: stats.assessments, color: 'purple' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <div className="text-center">
              <div
                className={`text-4xl font-bold text-${stat.color}-600 mb-2`}
              >
                {stat.value}
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/students"
            className="block p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition text-center text-indigo-700 font-medium"
          >
            Manage Students
          </a>
          <a
            href="/class-streams"
            className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center text-blue-700 font-medium"
          >
            Manage Classes
          </a>
          <a
            href="/subjects"
            className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center text-green-700 font-medium"
          >
            Manage Subjects
          </a>
          <a
            href="/scores"
            className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center text-purple-700 font-medium"
          >
            Record Scores
          </a>
        </div>
      </Card>
    </Layout>
  );
};

export default DashboardPage;
