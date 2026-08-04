// src/pages/ExamResultsListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ExamResultsListPage = () => {
  const { id } = useParams(); // Exam ID
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'highest', 'lowest', 'name_asc'

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
    const sorted = [...submissions].sort((a, b) => b.final_score - a.final_score);
    const topPerformer = sorted[0]?.student_name || 'N/A';
    const lowestScore = sorted[sorted.length - 1]?.final_score || 0;

    return { averagePct, topPerformer, lowestScore };
  }, [submissions, exam]);

  // Live Filter & Sort Submissions
  const filteredSubmissions = useMemo(() => {
    let list = submissions.filter((sub) =>
      sub.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return list.sort((a, b) => {
      if (sortBy === 'highest') {
        return b.final_score - a.final_score;
      }
      if (sortBy === 'lowest') {
        return a.final_score - b.final_score;
      }
      if (sortBy === 'name_asc') {
        return a.student_name.localeCompare(b.student_name);
      }
      // Default: 'latest' (newest created_at date first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [submissions, searchQuery, sortBy]);

  // Edit / Re-grade Student Submission Handler
  const handleEditSubmission = async (submissionId) => {
    try {
      const res = await api.get(`/api/exam-submissions/${submissionId}`);
      const sub = res.data;

      const formattedGrades = (sub.student_answers || []).map((ans) => {
        const question = (sub.exam?.questions || []).find(q => q.id === ans.question_id);
        return {
          question_number: question ? question.question_number : 1,
          student_answer: ans.student_answer,
          score: Number(ans.final_score),
        };
      });

      navigate('/exams/review', {
        state: {
          results: {
            student_name: sub.student_name,
            grades: formattedGrades,
          },
          answer_key: sub.exam?.questions || [],
          examId: sub.exam_id,
          submissionId: sub.id,
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
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/exams')}
                className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-surface text-subtle-text hover:text-white transition-colors"
                title="Back to Exams"
              >
                <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight break-words">{exam?.title}</h1>
              {exam?.subject && (
                <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
                  {exam.subject}
                </span>
              )}
            </div>
            <p className="mt-1 text-subtle-text text-xs sm:text-sm">
              Class Roster & Graded Results ({submissions.length} Students Graded)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/exams/${exam.id}/export`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full border border-surface bg-surface px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-background"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Report</span>
            </button>

            <button
              onClick={() => navigate('/exams/upload', { state: { selectedExamId: exam.id } })}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-background transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-base">add_a_photo</span>
              <span>Grade Student</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-surface bg-surface p-5 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-subtle-text">Class Average</p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              {stats.averagePct}%
            </p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-5 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-subtle-text">Top Performer</p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white truncate">
              {stats.topPerformer}
            </p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-5 sm:p-6">
            <p className="text-xs sm:text-sm font-medium text-subtle-text">Total Students Graded</p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {submissions.length}
            </p>
          </div>
        </div>

        {/* 👇 SEARCH & SORT FILTER BAR 👇 */}
        {submissions.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface p-4 rounded-2xl border border-surface">
            {/* Search Box */}
            <div className="sm:col-span-2 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text text-lg">
                search
              </span>
              <input
                type="text"
                className="form-input w-full rounded-xl border border-background bg-background py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
                placeholder="Search student by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                className="form-select block w-full rounded-xl border border-background bg-background px-4 py-2.5 text-xs sm:text-sm text-white focus:border-primary focus:ring-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Sort: Latest Graded Date</option>
                <option value="highest">Sort: Highest Score First</option>
                <option value="lowest">Sort: Lowest Score First</option>
                <option value="name_asc">Sort: Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>
        )}

        {/* Student Results Table */}
        {submissions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-surface bg-surface/30 p-8 sm:p-12 text-center">
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
        ) : filteredSubmissions.length === 0 ? (
          <div className="rounded-2xl border border-surface bg-surface/40 p-8 text-center text-subtle-text text-sm">
            No students found matching "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-surface bg-surface shadow-md">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                <thead className="bg-background/60 border-b border-surface">
                  <tr>
                    <th className="px-4 sm:px-6 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-subtle-text">Student Name</th>
                    <th className="px-4 sm:px-6 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-subtle-text">Score</th>
                    <th className="px-4 sm:px-6 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-subtle-text">Percentage</th>
                    <th className="px-4 sm:px-6 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-subtle-text">Graded Date</th>
                    <th className="px-4 sm:px-6 py-3.5 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider text-subtle-text">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background/50">
                  {filteredSubmissions.map((sub) => {
                    const totalPossible = sub.total_possible_marks || exam.total_marks || 1;
                    const pct = Math.round((sub.final_score / totalPossible) * 100);

                    return (
                      <tr key={sub.id} className="hover:bg-background/30 transition-colors">
                        <td className="whitespace-nowrap px-4 sm:px-6 py-3.5 font-bold text-xs sm:text-sm text-white">
                          {sub.student_name}
                        </td>
                        <td className="whitespace-nowrap px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-white">
                          {sub.final_score} / {totalPossible}
                        </td>
                        <td className="whitespace-nowrap px-4 sm:px-6 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold ${
                            pct >= 80
                              ? 'bg-green-500/10 text-green-400'
                              : pct >= 50
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 sm:px-6 py-3.5 text-xs text-subtle-text">
                          {new Date(sub.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 sm:px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditSubmission(sub.id)}
                              className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-background text-subtle-text hover:text-white transition-colors"
                              title="Edit / Re-grade Student"
                            >
                              <span className="material-symbols-outlined text-sm sm:text-base">edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteSubmission(sub.id, sub.student_name)}
                              className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-background text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Student Result"
                            >
                              <span className="material-symbols-outlined text-sm sm:text-base">delete</span>
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