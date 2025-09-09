// src/pages/AnswerKeyPage.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'; // Import useDropzone
import api from '../api';

const AnswerKeyPage = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, answer: '', type: 'SHORT', marks: 1 },
    { id: 2, answer: '', type: 'SHORT', marks: 1 },
    { id: 3, answer: '', type: 'SHORT', marks: 1 },
    { id: 4, answer: '', type: 'SHORT', marks: 1 },
    { id: 5, answer: '', type: 'SHORT', marks: 1 },
  ]);
  const [isScanning, setIsScanning] = useState(false); // New state for loading indicator
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for the exam.');
      return;
    }
    const payload = {
      title,
      subject,
      total_marks: totalMarks,
      questions: questions.map(q => ({
        answer: q.answer,
        type: q.type,
        marks: q.marks,
      })),
    };
    try {
      await api.post('/api/exams', payload); // Corrected URL with /api prefix
      alert('Answer key saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Errors:", error.response.data.errors);
        alert('Please make sure all answer fields are filled out.');
      } else {
        console.error("An error occurred:", error);
        alert('An error occurred while saving. Please try again.');
      }
    }
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, answer: '', type: 'SHORT', marks: 1 }]);
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const totalMarks = useMemo(() => {
    // Ensure marks are treated as numbers
    return questions.reduce((total, q) => total + (Number(q.marks) || 0), 0);
  }, [questions]);
  
  // --- NEW AI SCANNING LOGIC ---
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    // This state update will now happen immediately
    setIsScanning(true);

    // We use a timeout to push the heavy work to the next "tick" of the event loop,
    // giving React a chance to re-render the UI and show "Scanning..."
    setTimeout(async () => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append(`images[]`, file);
        });

        try {
            const response = await api.post('/api/answer-keys/scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const scannedQuestions = response.data.questions;
            const newQuestions = scannedQuestions.map((question, index) => ({
                id: index + 1,
                answer: question.answer,
                type: ['MCQ', 'TF', 'SHORT'].includes(question.type) ? question.type : 'SHORT',
                marks: 1,
            }));

            setQuestions(newQuestions);
            alert(`${scannedQuestions.length} questions scanned successfully! Please review and save.`);

        } catch (error) {
            console.error("Failed to scan answer key:", error);
            alert('An error occurred while scanning the answer key.');
        } finally {
            // This will now correctly hide the "Scanning..." message after the attempt
            setIsScanning(false);
        }
    }, 10); // A tiny 10ms delay is all that's needed
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
  });

  return (
    <div className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create Answer Key</h1>
          <p className="mt-2 text-subtle-text">Manually input answers or scan an image of the answer key.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-surface p-6 rounded-2xl">
          <div>
            <label htmlFor="exam-title" className="block text-sm font-medium text-white mb-2">Exam Title</label>
            <input
              id="exam-title"
              type="text"
              className="form-input block w-full rounded-xl border border-background bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
              placeholder="e.g., Biology Midterm 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="exam-subject" className="block text-sm font-medium text-white mb-2">Subject (Optional)</label>
            <input
              id="exam-subject"
              type="text"
              className="form-input block w-full rounded-xl border border-background bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
              placeholder="e.g., Biology"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Total Marks</label>
            <div className="flex items-center justify-center w-full h-[46px] rounded-xl bg-background text-white text-lg font-bold">
            {totalMarks}
            </div>  
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Manual Entry Section */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Manual Entry</h2>
            <div className="space-y-4">
            {questions.map((q, index) => (
                <div key={q.id} className="grid grid-cols-12 gap-4 items-center">
                    <label className="col-span-2 text-right font-medium text-white" htmlFor={`q-${q.id}`}>
                    Question {index + 1}
                    </label>
                    <div className="col-span-6">
                    <input
                        className="form-input block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
                        id={`q-${q.id}`}
                        placeholder="Enter correct answer"
                        type="text"
                        value={q.answer}
                        onChange={(e) => handleQuestionChange(q.id, 'answer', e.target.value)}
                    />
                    </div>
                    <div className="col-span-2">
                    <select
                        className="form-select block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white focus:border-primary focus:ring-0"
                        value={q.type}
                        onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value)}
                    >
                        <option value="SHORT">Short Answer</option>
                        <option value="MCQ">MCQ</option>
                        <option value="TF">True/False</option>
                    </select>
                    </div>
                    <div className="col-span-2">
                    <input
                        className="form-input block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
                        type="number"
                        min="1"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(q.id, 'marks', parseInt(e.target.value, 10))}
                    />
                    </div>
                </div>
                ))}
              <button onClick={addQuestion} className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-subtle-text transition-colors hover:text-white">
                <span className="material-symbols-outlined"> add_circle </span>
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Bulk Entry Section - NOW FUNCTIONAL */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Bulk Entry (Scan from Image)</h2>
            <div {...getRootProps()} className={`flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface bg-surface/50 p-8 text-center transition-colors cursor-pointer hover:border-primary/50 ${isDragActive ? 'border-primary bg-primary/20' : ''}`}>
              <input {...getInputProps()} />
              <div className="mb-4">
                <span className="material-symbols-outlined text-5xl text-primary"> upload_file </span>
              </div>
              {isScanning ? (
                  <p className="text-lg font-bold text-white">Scanning Answer Key...</p>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white">
                    {isDragActive ? "Drop the image here..." : "Drop image of answer key"}
                  </h3>
                  <p className="text-sm text-subtle-text">or click to browse</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-end gap-4">
          <button onClick={() => navigate('/dashboard')} className="rounded-full border border-solid border-surface px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-surface">
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-opacity hover:opacity-80">
            <span>Save Answer Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyPage;