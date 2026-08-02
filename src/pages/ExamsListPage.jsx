// src/pages/ExamsListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ExamsListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all created answer keys when page loads
  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/exams');
      setExams(response.data);
    } catch (error) {
      console.error('Failed to fetch answer keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await api.delete(`/api/exams/${id}`);
        setExams(exams.filter(exam => exam.id !== id));
        alert('Answer key deleted successfully.');
      } catch (error) {
        console.error('Failed to delete answer key:', error);
        alert('Could not delete answer key. Please try again.');
      }
    }
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Answer Keys</h1>
            <p className="mt-1 text-subtle-text">Manage all created exam answer keys.</p>
          </div>
          <button
            onClick={() => navigate('/answer-keys/create')}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Create New Answer Key</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-subtle-text py-12">Loading answer keys...</div>
        ) : exams.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-surface bg-surface/30 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-subtle-text mb-3">description</span>
            <h3 className="text-lg font-bold text-white mb-1">No Answer Keys Created Yet</h3>
            <p className="text-sm text-subtle-text mb-6">Create or scan your first answer key to start grading exams.</p>
            <button
              onClick={() => navigate('/answer-keys/create')}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-background"
            >
              Create Answer Key
            </button>
          </div>
        ) : (
          /* Grid of Answer Keys */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="flex flex-col justify-between rounded-2xl border border-surface bg-surface p-6 transition-all hover:border-primary/50">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{exam.title}</h3>
                    {exam.subject && (
                      <span className="shrink-0 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                        {exam.subject}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-subtle-text">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">quiz</span>
                      <span>{exam.questions_count || 0} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">grade</span>
                      <span>{exam.total_marks} Total Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      <span>Created {new Date(exam.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons in ExamsListPage.jsx */}
                <div className="mt-6 flex items-center justify-between border-t border-background/50 pt-4">
                {/* 👇 NEW VIEW RESULTS BUTTON 👇 */}
                <button
                    onClick={() => navigate(`/exams/${exam.id}/results`)}
                    className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-base">analytics</span>
                    <span>View Results ({exam.submissions_count || 0})</span>
                </button>

                <div className="flex items-center gap-2">
                    <button
                    onClick={() => navigate('/exams/upload', { state: { selectedExamId: exam.id } })}
                    className="flex size-9 items-center justify-center rounded-full bg-background text-subtle-text hover:text-white transition-colors"
                    title="Upload Student Exam"
                    >
                    <span className="material-symbols-outlined text-base">add_a_photo</span>
                    </button>
                    <button
                    onClick={() => navigate(`/answer-keys/edit/${exam.id}`)}
                    className="flex size-9 items-center justify-center rounded-full bg-background text-subtle-text hover:text-white transition-colors"
                    title="Edit Answer Key"
                    >
                    <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                    onClick={() => handleDelete(exam.id, exam.title)}
                    className="flex size-9 items-center justify-center rounded-full bg-background text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete Answer Key"
                    >
                    <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ExamsListPage;