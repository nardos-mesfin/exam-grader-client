// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExamsListPage from './pages/ExamsListPage.jsx'; // <-- IMPORT
import AnswerKeyPage from './pages/AnswerKeyPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthLayout from './components/AuthLayout.jsx';
import ExamResultsListPage from './pages/ExamResultsListPage.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><AuthLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="exams" element={<ExamsListPage />} /> {/* <-- MAIN EXAMS LIST */}
          <Route path="answer-keys/create" element={<AnswerKeyPage />} />
          <Route path="answer-keys/edit/:id" element={<AnswerKeyPage />} /> {/* <-- EDIT ROUTE */}
          <Route path="exams/upload" element={<UploadPage />} />
          <Route path="exams/review" element={<ReviewPage />} />
          <Route path="exams/:id/results" element={<ExamResultsListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;