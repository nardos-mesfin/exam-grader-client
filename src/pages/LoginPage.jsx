// src/pages/LoginPage.jsx
import React from 'react';

// A small component for the logo SVG to keep the main component clean
const GradeAssistLogo = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 3.33331H7.33333C5.32583 3.33331 3.66667 4.99248 3.66667 6.99998V17C3.66667 18.9477 5.23858 20.5833 7.16667 20.6625L7.33333 20.6666H16.6667C18.6742 20.6666 20.3333 19.0075 20.3333 17V6.99998C20.3333 5.05226 18.7614 3.41665 16.8333 3.33748L16.6667 3.33331ZM15.5 12.8333L11.6667 16.6666L10.5 15.5L13.1667 12.8333H8.5V11.1666H13.1667L10.5 8.49998L11.6667 7.33331L15.5 11.1666V12.8333Z"></path>
  </svg>
);

const LoginPage = () => {
  return (
    // Main container with the darkest background, occupying the full screen
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Header section */}
      <header className="px-10 py-4">
        <div className="flex items-center gap-3 text-white">
          <GradeAssistLogo />
          <h2 className="text-lg font-bold">GradeAssist</h2>
        </div>
      </header>

      {/* Main content area, configured to center the form */}
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-sm space-y-8 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              Secure Teacher Login
            </h1>
            <p className="mt-2 text-subtle-text">
              Access your exam correction dashboard.
            </p>
          </div>

          {/* The form card, using the slightly lighter 'surface' color */}
          <div className="rounded-2xl bg-surface p-8 shadow-2xl">
            <form className="space-y-6">
              <div>
                <label className="text-sm font-medium leading-none text-subtle-text" htmlFor="username">
                  Username
                </label>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text">
                    person
                  </span>
                  <input
                    className="form-input block w-full rounded-xl border-transparent bg-background py-3 pl-10 pr-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-primary"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium leading-none text-subtle-text" htmlFor="password">
                  Password
                </label>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text">
                    lock
                  </span>
                  <input
                    className="form-input block w-full rounded-xl border-transparent bg-background py-3 pl-10 pr-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-primary"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                  />
                </div>
              </div>
              <div className="flex items-center justify-start">
                <a className="text-sm text-subtle-text hover:text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div>
                <button
                  className="flex w-full justify-center rounded-full bg-primary px-4 py-3 text-base font-bold text-background transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                  type="submit"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
};

export default LoginPage;