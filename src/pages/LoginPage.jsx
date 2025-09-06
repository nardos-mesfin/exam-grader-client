// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import api from '../api'; // <-- Import our configured Axios instance

// ... (The GradeAssistLogo component remains the same)
const GradeAssistLogo = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 3.33331H7.33333C5.32583 3.33331 3.66667 4.99248 3.66667 6.99998V17C3.66667 18.9477 5.23858 20.5833 7.16667 20.6625L7.33333 20.6666H16.6667C18.6742 20.6666 20.3333 19.0075 20.3333 17V6.99998C20.3333 5.05226 18.7614 3.41665 16.8333 3.33748L16.6667 3.33331ZM15.5 12.8333L11.6667 16.6666L10.5 15.5L13.1667 12.8333H8.5V11.1666H13.1667L10.5 8.49998L11.6667 7.33331L15.5 11.1666V12.8333Z"></path>
  </svg>
);

const LoginPage = () => {
  // --- STATE MANAGEMENT ---
  // State to hold the email and password from the input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to hold any validation errors from the API
  const [errors, setErrors] = useState({});
  // State to manage the loading state of the login button
  const [loading, setLoading] = useState(false);

  // --- FORM SUBMISSION HANDLER ---
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // 1. Make the handshake request to the root-level URL.
      await api.get('/sanctum/csrf-cookie');

      // 2. Make the login request to the /api prefixed URL.
      //    Both requests use the SAME Axios instance, ensuring cookie consistency.
      await api.post('/api/login', { email, password });

      console.log('Login Successful!');
      window.location.pathname = "/dashboard";
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Validation Errors:', error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error('An unexpected error occurred:', error);
        setErrors({ general: ['The credentials do not match our records.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-10 py-4">
        <div className="flex items-center gap-3 text-white">
          <GradeAssistLogo />
          <h2 className="text-lg font-bold">GradeAssist</h2>
        </div>
      </header>
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
          <div className="rounded-2xl bg-surface p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-medium leading-none text-subtle-text" htmlFor="email">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text">
                    person
                  </span>
                  <input
                    className="form-input block w-full rounded-xl border-transparent bg-background py-3 pl-10 pr-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-primary"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password[0]}</p>}
              </div>
              {errors.general && <p className="text-sm text-red-500 text-center">{errors.general[0]}</p>}
              <div className="flex items-center justify-start">
                <a className="text-sm text-subtle-text hover:text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div>
                <button
                  className="flex w-full justify-center rounded-full bg-primary px-4 py-3 text-base font-bold text-background transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:scale-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Log In'}
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