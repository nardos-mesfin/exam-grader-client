// src/pages/DashboardPage.jsx
import React from 'react';

const DashboardPage = () => {
  // All the logic (useAuth, useNavigate, handleLogout) is now in AuthLayout.
  // This component is now purely for displaying the dashboard content.
  return (
    <main className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Class Performance Overview</h1>
          <p className="mt-1 text-subtle-text">Analyze class performance across all exams.</p>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Average Score</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">78%</p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Top Performer</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">Ethan Carter</p>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <p className="text-base font-medium text-subtle-text">Lowest Score</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">55%</p>
          </div>
        </div>

        {/* Graphs */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <h2 className="text-lg font-semibold text-white">Score Distribution</h2>
            <div className="mt-6 grid grid-cols-7 items-end gap-4" style={{ height: '200px' }}>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '10%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '60%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '90%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '30%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '0%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '100%' }}></div></div>
              <div className="flex h-full flex-col justify-end"><div className="bg-primary rounded-t-full" style={{ height: '80%' }}></div></div>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-4 text-center">
                <p className="text-xs font-medium text-subtle-text">0-10</p>
                <p className="text-xs font-medium text-subtle-text">11-20</p>
                <p className="text-xs font-medium text-subtle-text">21-30</p>
                <p className="text-xs font-medium text-subtle-text">31-40</p>
                <p className="text-xs font-medium text-subtle-text">41-50</p>
                <p className="text-xs font-medium text-subtle-text">51-60</p>
                <p className="text-xs font-medium text-subtle-text">61-70</p>
            </div>
          </div>
          <div className="rounded-2xl border border-surface bg-surface p-6">
            <h2 className="text-lg font-semibold text-white">Class Improvement</h2>
            <div className="mt-4" style={{ height: '220px' }}>
              <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="236" x2="236" y1="1" y2="149">
                    <stop stopColor="#4ade80" stopOpacity="0.3"></stop>
                    <stop offset="1" stopColor="#4ade80" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#chartGradient)"></path>
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#4ade80" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
            </div>
            <div className="mt-2 flex justify-around">
                <p className="text-xs font-medium text-subtle-text">Exam 1</p>
                <p className="text-xs font-medium text-subtle-text">Exam 2</p>
                <p className="text-xs font-medium text-subtle-text">Exam 3</p>
                <p className="text-xs font-medium text-subtle-text">Exam 4</p>
            </div>
          </div>
        </div>

        {/* Commonly Missed Questions Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white">Commonly Missed Questions</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-surface bg-surface">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle-text">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle-text">Missed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle-text">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">Question 3</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">25%</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text"><span className="inline-flex items-center rounded-full bg-yellow-900/50 px-2.5 py-0.5 text-xs font-medium text-yellow-300">Medium</span></td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">Question 7</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">30%</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text"><span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-300">Hard</span></td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">Question 12</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text">15%</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-subtle-text"><span className="inline-flex items-center rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-300">Easy</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;