// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import AuthLayout from './components/AuthLayout.jsx'; 
import AnswerKeyPage from './pages/AnswerKeyPage.jsx'; 
import UploadPage from './pages/UploadPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
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
          <Route path="exams/upload" element={<UploadPage />} /> 
          <Route path="exams/review" element={<ReviewPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;