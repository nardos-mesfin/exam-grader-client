// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- IMPORT THE BOUNCER
import AuthLayout from './components/AuthLayout.jsx'; // <-- IMPORT LAYOUT
import AnswerKeyPage from './pages/AnswerKeyPage.jsx'; // <-- IMPORT NEW PAGE
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* PROTECTED ROUTES WRAPPED IN THE LAYOUT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          {/* These are the "children" of the layout */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="answer-keys/create" element={<AnswerKeyPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;