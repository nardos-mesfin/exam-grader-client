// src/pages/StudentDossierPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const StudentDossierPage = () => {
  const { name } = useParams(); // Student Name from URL
  const navigate = useNavigate();

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/students/${name}`);
        setDossier(response.data);
      } catch (error) {
        console.error('Failed to fetch student dossier:', error);
        alert('Could not load dossier for this student.');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [name, navigate]);

  if (loading) {
    return <div className="p-10 text-center text-white">Loading student dossier...</div>;
  }

  const submissions = dossier?.submissions || [];

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/students')}
              className="flex size-10 items-center justify-center rounded-full bg-surface text-subtle-text hover:text-white transition-colors"
              title="Back to Students List"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Student Dossier</h1>
              <p className="text-subtle-text text-sm">
                Comprehensive performance history for <span className="font-bold text-white">{dossier?.student_name}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Student Profile Card & Overall Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Profile Card */}
          <div className="rounded-2xl border border-surface bg-surface p-6 flex flex-col items-center text-center">
            <div className="size-24 rounded-full bg-primary/10 text-primary border-2 border-primary flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
              {dossier?.student_name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{dossier?.student_name}</h2>
            <p className="text-sm text-subtle-text">Student Record</p>
          </div>

          {/* Performance Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-surface bg-surface p-6 flex flex-col justify-between">
              <p className="text-sm font-semibold text-subtle-text">Overall Average Score</p>
              <p className="text-4xl font-bold text-primary mt-2">{dossier?.average_percentage}%</p>
              <p className="text-xs text-subtle-text mt-2">Calculated across all graded exams</p>
            </div>

            <div className="rounded-2xl border border-surface bg-surface p-6 flex flex-col justify-between">
              <p className="text-sm font-semibold text-subtle-text">Total Exams Taken</p>
              <p className="text-4xl font-bold text-white mt-2">{dossier?.total_exams}</p>
              <p className="text-xs text-subtle-text mt-2">Completed & verified submissions</p>
            </div>
          </div>
        </div>

        {/* Exam History Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Exam Results History</h2>
          
          <div className="overflow-hidden rounded-2xl border border-surface bg-surface shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background/60 border-b border-surface">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Exam Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Score</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Percentage</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-subtle-text">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background/50">
                  {submissions.map((sub) => {
                    const totalPossible = sub.total_possible_marks || sub.exam?.total_marks || 1;
                    const pct = Math.round((sub.final_score / totalPossible) * 100);

                    return (
                      <tr key={sub.id} className="hover:bg-background/30 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                          {sub.exam?.title || 'Exam'}
                          {sub.exam?.subject && (
                            <span className="ml-2 text-xs font-normal text-subtle-text">
                              ({sub.exam.subject})
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-white">
                          {sub.final_score} / {totalPossible}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                            pct >= 80
                              ? 'bg-green-500/10 text-green-400'
                              : pct >= 50
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/exams/${sub.exam_id}/results`)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>View Class Roster</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentDossierPage;