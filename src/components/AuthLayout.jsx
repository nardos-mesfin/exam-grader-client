// src/components/AuthLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Outlet is where the child route will render
import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../api';

const GradeAssistLogo = () => (
    <svg className="size-8 text-primary" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path clipRule="evenodd" d="M39.475...Z" fillRule="evenodd"></path> {/* Truncated for brevity */}
    </svg>
);

const AuthLayout = () => {
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
        {/* ... This is the exact same header from the dashboard ... */}
        <div className="flex items-center gap-4 text-white">
          <GradeAssistLogo />
          <h2 className="text-white text-lg font-bold">GradeAssist</h2>
        </div>
        <nav className="flex flex-1 justify-center gap-2">
          <a onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface">Dashboard</a>
          <a onClick={() => navigate('/answer-keys/create')} className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-subtle-text transition-colors hover:bg-surface hover:text-white">Exams</a>
          {/* ... other nav links ... */}
        </nav>
        <div className="flex items-center gap-4">
            <Menu as="div" className="relative z-50">
                <Menu.Button className="size-10 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-offset-2 ring-offset-background ring-primary transition-transform hover:scale-110">
                    <div className="size-full rounded-full" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=${user?.email}')` }} />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => ( <button onClick={handleLogout} className={`${active ? 'bg-red-500/20' : ''} group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-400`}>Logout</button> )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
      </header>
      {/* Outlet will render the specific page (Dashboard or AnswerKey) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;