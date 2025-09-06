// src/pages/DashboardPage.jsx
import React from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react'; // <-- Import for dropdown
import { Fragment } from 'react'; // <-- Import for dropdown

const GradeAssistLogo = () => (
  <svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      {/* SVG path is unchanged */}
      <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fillRule="evenodd"></path>
  </svg>
);

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background text-white overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface px-10 py-4">
        <div className="flex items-center gap-4 text-white">
          <GradeAssistLogo />
          <h2 className="text-white text-lg font-bold">GradeAssist</h2>
        </div>
        <nav className="flex flex-1 justify-center gap-2">
          <a className="rounded-full px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface" href="#">Dashboard</a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-subtle-text transition-colors hover:bg-surface hover:text-white" href="#">Exams</a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-subtle-text transition-colors hover:bg-surface hover:text-white" href="#">Students</a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-subtle-text transition-colors hover:bg-surface hover:text-white" href="#">Reports</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-surface text-subtle-text transition-colors hover:bg-opacity-75">
            <span className="material-symbols-outlined text-2xl"> notifications </span>
          </button>
          
          {/* 👇 NEW DROPDOWN MENU FOR LOGOUT 👇 */}
          <Menu as="div" className="relative">
            <Menu.Button className="size-10 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-offset-2 ring-offset-background ring-primary transition-transform hover:scale-110">
              <div className="size-full rounded-full" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=${user?.email}')` }} />
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => ( <a href="#" className={`${active ? 'bg-background' : ''} block px-4 py-2 text-sm text-white`}>Profile</a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={handleLogout} className={`${active ? 'bg-red-500/20' : ''} group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-400`}>
                        <span className="material-symbols-outlined mr-2 text-base"> logout </span>
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      <main className="flex-1 px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Class Performance Overview</h1>
            <p className="mt-1 text-subtle-text">Analyze class performance across all exams.</p>
          </div>
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

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-surface bg-surface p-6">
              <h2 className="text-lg font-semibold text-white">Score Distribution</h2>
              <div className="mt-6 grid grid-cols-7 items-end gap-4" style={{ height: '200px' }}>
                {/* 👇 BAR GRAPH FIX: Added rounded-t-full for the soft tops 👇 */}
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
                {/* 👇 LINE GRAPH FIX: Added the stroke and fill correctly 👇 */}
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
    </div>
  );
};

export default DashboardPage;