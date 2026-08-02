// src/pages/ExportReportPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ExportReportPage = () => {
  const { id } = useParams(); // Exam ID
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [exportFormat, setExportFormat] = useState('excel'); // 'excel' or 'pdf'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/exams/${id}/results`);
        setExam(res.data.exam);
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error('Failed to load export data:', error);
        alert('Could not load exam data for export.');
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (!exam || submissions.length === 0) {
      alert('No submission data available to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student Name,Score,Total Possible,Percentage,Graded Date\n';

    submissions.forEach((sub) => {
      const possible = sub.total_possible_marks || exam.total_marks || 1;
      const pct = Math.round((sub.final_score / possible) * 100);
      const date = new Date(sub.created_at).toLocaleDateString();

      // Escape quotes in student name
      const cleanName = `"${sub.student_name.replace(/"/g, '""')}"`;
      csvContent += `${cleanName},${sub.final_score},${possible},${pct}%,${date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exam.title.replace(/\s+/g, '_')}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print
  const handlePrintPDF = () => {
    window.print();
  };

  const handleExport = () => {
    if (exportFormat === 'excel') {
      handleExportCSV();
    } else {
      handlePrintPDF();
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-white">Preparing export report...</div>;
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Bar */}
        <div className="mb-8 flex items-center gap-4 print:hidden">
          <button
            onClick={() => navigate(`/exams/${id}/results`)}
            className="flex size-9 items-center justify-center rounded-full bg-surface text-subtle-text hover:text-white transition-colors"
            title="Back to Results"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Export Exam Results</h1>
            <p className="text-subtle-text text-sm">
              Download grades for <span className="font-bold text-white">{exam?.title}</span> in your preferred format.
            </p>
          </div>
        </div>

        {/* Format Selection Card (Hidden when printing) */}
        <div className="space-y-8 print:hidden">
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <h3 className="text-xl font-bold text-white">Select Export Format</h3>
            <p className="mt-1 text-sm text-subtle-text">Choose whether you'd like the results as an Excel spreadsheet or a printable PDF.</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Excel Option */}
              <label
                onClick={() => setExportFormat('excel')}
                className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                  exportFormat === 'excel'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : 'border-surface bg-background hover:bg-surface'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">table_view</span>
                    <span className="text-base font-bold text-white">Excel (.csv)</span>
                  </div>
                  <span className="mt-2 text-sm text-subtle-text">Best for gradebooks and data entry.</span>
                </div>
              </label>

              {/* PDF Option */}
              <label
                onClick={() => setExportFormat('pdf')}
                className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : 'border-surface bg-background hover:bg-surface'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-primary">picture_as_pdf</span>
                    <span className="text-base font-bold text-white">Print / Save PDF</span>
                  </div>
                  <span className="mt-2 text-sm text-subtle-text">Ideal for printing and physical archives.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end border-t border-surface pt-6">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-background transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined">download</span>
              <span>{exportFormat === 'excel' ? 'Download Excel (.csv)' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        {/* REPORT PREVIEW TABLE (This is what prints when saving as PDF) */}
        <div className="mt-10 rounded-2xl border border-surface bg-surface p-6 print:border-none print:bg-white print:text-black">
          <div className="mb-6 flex items-center justify-between border-b border-background/60 pb-4 print:border-gray-300">
            <div>
              <h2 className="text-2xl font-bold text-white print:text-black">{exam?.title} - Class Report</h2>
              <p className="text-sm text-subtle-text print:text-gray-600">Subject: {exam?.subject || 'N/A'} | Total Marks: {exam?.total_marks}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-subtle-text print:text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
              <p className="text-sm font-bold text-primary print:text-black">{submissions.length} Students Graded</p>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-background/60 text-xs font-bold uppercase text-subtle-text print:border-gray-300 print:text-gray-700">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Graded Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background/40 print:divide-gray-200">
              {submissions.map((sub, index) => {
                const possible = sub.total_possible_marks || exam?.total_marks || 1;
                const pct = Math.round((sub.final_score / possible) * 100);

                return (
                  <tr key={sub.id} className="text-sm text-white print:text-black">
                    <td className="py-3 px-4 font-bold">{index + 1}</td>
                    <td className="py-3 px-4 font-bold">{sub.student_name}</td>
                    <td className="py-3 px-4">{sub.final_score} / {possible}</td>
                    <td className="py-3 px-4 font-bold">{pct}%</td>
                    <td className="py-3 px-4 text-xs text-subtle-text print:text-gray-600">{new Date(sub.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
};

export default ExportReportPage;