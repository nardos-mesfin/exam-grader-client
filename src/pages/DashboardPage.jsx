// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/dashboard/analytics');
        setAnalytics(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-white">Loading live analytics...</div>;
  }

  const hasData = analytics?.has_data || false;

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Title Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Class Performance Overview</h1>
            <p className="mt-1 text-subtle-text">Live class performance metrics across all graded exams.</p>
          </div>
          <button
            onClick={() => navigate('/exams/upload')}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>Grade New Exam Paper</span>
          </button>
        </div>

        {/* Live Stat Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Class Average Score</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
              {hasData ? `${analytics.average_pct}%` : '0%'}
            </p>
          </div>

          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Top Performer</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white truncate">
              {hasData ? analytics.top_performer : 'N/A'}
            </p>
          </div>

          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Total Graded Exams</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">
              {hasData ? analytics.total_graded : 0}
            </p>
          </div>
        </div>

        {/* Distribution Bar Chart & Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Score Distribution Chart */}
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <h2 className="text-lg font-semibold text-white">Score Distribution (%)</h2>
            <div className="mt-6 grid grid-cols-7 items-end gap-4" style={{ height: '200px' }}>
              {(analytics?.distribution || [0, 0, 0, 0, 0, 0, 0]).map((count, idx) => {
                const maxCount = Math.max(...(analytics?.distribution || [1]), 1);
                const heightPct = Math.round((count / maxCount) * 100);

                return (
                  <div key={idx} className="flex h-full flex-col justify-end items-center group relative">
                    <span className="text-[10px] font-bold text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      className="bg-primary rounded-t-full w-full transition-all duration-500"
                      style={{ height: `${count > 0 ? Math.max(heightPct, 8) : 0}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-4 text-center">
              <p className="text-xs font-medium text-subtle-text">0-10%</p>
              <p className="text-xs font-medium text-subtle-text">11-20%</p>
              <p className="text-xs font-medium text-subtle-text">21-30%</p>
              <p className="text-xs font-medium text-subtle-text">31-40%</p>
              <p className="text-xs font-medium text-subtle-text">41-50%</p>
              <p className="text-xs font-medium text-subtle-text">51-60%</p>
              <p className="text-xs font-medium text-subtle-text">61-100%</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-surface bg-surface p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Quick Shortcuts</h2>
              <p className="text-sm text-subtle-text mb-6">Manage exams, student records, and answer keys.</p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/exams')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-background hover:bg-background/80 transition-colors border border-surface"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="font-bold text-white text-sm">View All Answer Keys</span>
                  </div>
                  <span className="material-symbols-outlined text-subtle-text">arrow_forward</span>
                </button>

                <button
                  onClick={() => navigate('/students')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-background hover:bg-background/80 transition-colors border border-surface"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    <span className="font-bold text-white text-sm">View Student Records</span>
                  </div>
                  <span className="material-symbols-outlined text-subtle-text">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-background text-xs text-subtle-text">
              GradeAssist AI System Active & Connected
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Graded Submissions</h2>
          
          {!hasData || analytics?.recent_submissions?.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-surface bg-surface/30 p-8 text-center text-subtle-text text-sm">
              No recent exam submissions found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-surface bg-surface shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-background/60 border-b border-surface">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold uppercase text-subtle-text">Student Name</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase text-subtle-text">Exam</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase text-subtle-text">Score</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase text-subtle-text">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-bold uppercase text-subtle-text">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-background/50">
                    {analytics.recent_submissions.map((sub) => {
                      const possible = sub.total_possible_marks || sub.exam?.total_marks || 1;
                      const pct = Math.round((sub.final_score / possible) * 100);

                      return (
                        <tr key={sub.id} className="hover:bg-background/30 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 font-bold text-white">{sub.student_name}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">{sub.exam?.title || 'Exam'}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-primary">{sub.final_score} / {possible} ({pct}%)</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">{new Date(sub.created_at).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/exams/${sub.exam_id}/results`)}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              View Class Roster
                            </button>
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

      </div>
    </main>
  );
};

export default DashboardPage;