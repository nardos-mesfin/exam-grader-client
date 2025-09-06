// src/pages/AnswerKeyPage.jsx
import React, { useState } from 'react';

const AnswerKeyPage = () => {
  // State to hold a list of questions. Each question is an object.
  // We start with 5 questions as in the design.
  const [questions, setQuestions] = useState([
    { id: 1, answer: '' },
    { id: 2, answer: '' },
    { id: 3, answer: '' },
    { id: 4, answer: '' },
    { id: 5, answer: '' },
  ]);

  // Function to add a new blank question to the list
  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, answer: '' }]);
  };

  // Function to update the answer for a specific question
  const handleAnswerChange = (id, value) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, answer: value } : q)));
  };

  return (
    <div className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create Answer Key</h1>
          <p className="mt-2 text-subtle-text">Manually input answers or upload an Excel file for bulk entry.</p>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Manual Entry Section */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Manual Entry</h2>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-4">
                  <label className="w-28 text-right font-medium text-white" htmlFor={`q-${q.id}`}>
                    Question {index + 1}
                  </label>
                  <input
                    className="form-input block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0"
                    id={`q-${q.id}`}
                    placeholder="Enter answer"
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-subtle-text transition-colors hover:text-white"
              >
                <span className="material-symbols-outlined"> add_circle </span>
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Bulk Entry Section */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Bulk Entry</h2>
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface bg-surface/50 p-8 text-center transition-colors hover:border-primary/50">
              <div className="mb-4">
                <span className="material-symbols-outlined text-5xl text-primary"> upload_file </span>
              </div>
              <h3 className="text-lg font-bold text-white">Upload Excel File</h3>
              <p className="text-sm text-subtle-text">Drag and drop your file here, or click to browse.</p>
              <button className="mt-6 rounded-full bg-surface px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-opacity-75">
                <span>Browse Files</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-end gap-4">
          <button className="rounded-full border border-solid border-surface px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-surface">
            <span>Cancel</span>
          </button>
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-opacity hover:opacity-80">
            <span>Save Answer Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyPage;