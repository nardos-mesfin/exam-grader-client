// src/pages/StudentsListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  if (loading) {
    return <div className="p-10 text-center text-white">Loading student records...</div>;
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Student Records</h1>
            <p className="mt-1 text-subtle-text">
              View and track student performance across all exams ({students.length} Total Students).
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6 rounded-2xl border border-surface bg-surface p-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text">
              search
            </span>
            <input
              type="text"
              className="form-input w-full rounded-xl border border-background bg-background py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredStudents.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-surface bg-surface/30 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-subtle-text mb-3">groups</span>
            <h3 className="text-lg font-bold text-white mb-1">No Student Records Found</h3>
            <p className="text-sm text-subtle-text">
              Grade student exams to automatically generate student dossiers.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-surface bg-surface shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background/60 border-b border-surface">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Student Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Exams Taken</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Overall Average %</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtle-text">Last Active</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-subtle-text">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background/50">
                  {filteredStudents.map((student, idx) => {
                    const avgPct = Math.round(Number(student.average_percentage) || 0);

                    return (
                      <tr key={idx} className="hover:bg-background/30 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 font-bold text-white flex items-center gap-3">
                          <div className="size-9 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm">
                            {student.student_name.charAt(0).toUpperCase()}
                          </div>
                          <span>{student.student_name}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-white">
                          {student.total_exams} Test{student.total_exams > 1 ? 's' : ''}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                            avgPct >= 80
                              ? 'bg-green-500/10 text-green-400'
                              : avgPct >= 50
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {avgPct}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">
                          {new Date(student.last_exam_date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/students/${encodeURIComponent(student.student_name)}`)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span>View Dossier</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
    </main>
  );
};

export default StudentsListPage;