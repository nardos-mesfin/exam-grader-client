// src/pages/ExamResultsListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ExamResultsListPage = () => {
  const { id } = useParams(); // Exam ID from URL
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/exams/${id}/results`);
      setExam(response.data.exam);
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch exam results:', error);
      alert('Could not load results for this exam.');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [id]);

  // Analytics Calculations
  const stats = useMemo(() => {
    if (submissions.length === 0 || !exam) {
      return { averagePct: 0, topPerformer: 'N/A', lowestScore: 0 };
    }

    const totalPct = submissions.reduce((acc, sub) => {
      const pct = (sub.final_score / (sub.total_possible_marks || exam.total_marks)) * 100;
      return acc + pct;
    }, 0);

    const averagePct = Math.round(totalPct / submissions.length);

    // Sort submissions to find top performer
    const sorted = [...submissions].sort((a, b) => b.final_score - a.final_score);
    const topPerformer = sorted[0]?.student_name || 'N/A';
    const lowestScore = sorted[sorted.length - 1]?.final_score || 0;

    return { averagePct, topPerformer, lowestScore };
  }, [submissions, exam]);

  // Edit / Re-grade Student Submission Handler
  const handleEditSubmission = async (submissionId) => {
    try {
      const res = await api.get(`/api/exam-submissions/${submissionId}`);
      const sub = res.data;

      // Map saved student answers back into ReviewPage format
      const formattedGrades = (sub.student_answers || []).map((ans) => {
        const question = (sub.exam?.questions || []).find(q => q.id === ans.question_id);
        return {
          question_number: question ? question.question_number : 1,
          student_answer: ans.student_answer,
          score: Number(ans.final_score),
        };
      });

      // Navigate to ReviewPage with student submission data
      navigate('/exams/review', {
        state: {
          results: {
            student_name: sub.student_name,
            grades: formattedGrades,
          },
          answer_key: sub.exam?.questions || [],
          examId: sub.exam_id,
          submissionId: sub.id, // Indicates EDIT mode
        },
      });
    } catch (error) {
      console.error('Failed to load student submission:', error);
      alert('Could not load student submission for editing.');
    }
  };

  // Delete Student Result Handler
  const handleDeleteSubmission = async (submissionId, studentName) => {
    if (window.confirm(`Are you sure you want to delete the result for ${studentName}?`)) {
      try {
        await api.delete(`/api/exam-submissions/${submissionId}`);
        setSubmissions(submissions.filter(s => s.id !== submissionId));
      } catch (error) {
        console.error('Failed to delete student result:', error);
        alert('Could not delete student result.');
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-white">Loading class results...</div>;
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/exams')}
                className="flex size-9 items-center justify-center rounded-full bg-surface text-subtle-text hover:text-white transition-colors"
                title="Back to Exams"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-white">{exam?.title}</h1>
              {exam?.subject && (
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
                  {exam.subject}
                </span>
              )}
            </div>
            <p className="mt-1 text-subtle-text">
              Class Roster & Graded Results ({submissions.length} Students Graded)
            </p>
          </div>

            {/* In ExamResultsListPage.jsx header buttons */}
            <div className="flex items-center gap-3">
            <button
                onClick={() => navigate(`/exams/${exam.id}/export`)}
                className="flex items-center justify-center gap-2 rounded-full border border-surface bg-surface px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-background"
            >
                <span className="material-symbols-outlined">download</span>
                <span>Export Report</span>
            </button>

            <button
                onClick={() => navigate('/exams/upload', { state: { selectedExamId: exam.id } })}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
            >
                <span className="material-symbols-outlined">add_a_photo</span>
                <span>Grade New Student Exam</span>
            </button>
            </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-sm font-medium text-subtle-text">Class Average</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
              {stats.averagePct}%
            </p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-sm font-medium text-subtle-text">Top Performer</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">
              {stats.topPerformer}
            </p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-sm font-medium text-subtle-text">Total Students Graded</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">
              {submissions.length}
            </p>
          </div>
        </div>

        {/* Student Results Table */}
        {submissions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-surface bg-surface/30 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-subtle-text mb-3">school</span>
            <h3 className="text-lg font-bold text-white mb-1">No Graded Papers Yet</h3>
            <p className="text-sm text-subtle-text mb-6">
              Snap photos of student exams to grade them against this answer key.
            </p>
            <button
              onClick={() => navigate('/exams/upload', { state: { selectedExamId: exam.id } })}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-background"
            >
              Grade First Student
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-surface bg-surface shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background/60 border-b border-surface">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Student Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Score</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Percentage</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Graded Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-subtle-text">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background/50">
                  {submissions.map((sub) => {
                    const totalPossible = sub.total_possible_marks || exam.total_marks || 1;
                    const pct = Math.round((sub.final_score / totalPossible) * 100);

                    return (
                      <tr key={sub.id} className="hover:bg-background/30 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                          {sub.student_name}
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
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">
                          {new Date(sub.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* EDIT / RE-GRADE BUTTON */}
                            <button
                              onClick={() => handleEditSubmission(sub.id)}
                              className="flex size-8 items-center justify-center rounded-full bg-background text-subtle-text hover:text-white transition-colors"
                              title="Edit / Re-grade Student"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => handleDeleteSubmission(sub.id, sub.student_name)}
                              className="flex size-8 items-center justify-center rounded-full bg-background text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Student Result"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ExamResultsListPage;