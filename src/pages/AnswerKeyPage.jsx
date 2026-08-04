// src/pages/AnswerKeyPage.jsx
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import MarksInput from '../components/MarksInput';
import { useToast } from '../context/ToastContext';
import { formatBackendError } from '../utils/formatError';
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
  const [scannedFiles, setScannedFiles] = useState([]); // Multi-page queue
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const nativeCameraInputRef = useRef(null);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast('Please enter a title for the exam.', 'warning');
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
      await api.post('/api/exams', payload);
      showToast('Answer key saved successfully!', 'success');
      navigate('/exams');
    } catch (error) {
      showToast(`An error occurred while saving:\n${formatBackendError(error)}`, 'error');
    }
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, answer: '', type: 'SHORT', marks: 1 }]);
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const totalMarks = useMemo(() => {
    return questions.reduce((total, q) => total + (Number(q.marks) || 0), 0);
  }, [questions]);

  // Handle adding new files to the queue
  const addFilesToQueue = (newFiles) => {
    const filesWithPreview = newFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setScannedFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeScannedFile = (index) => {
    setScannedFiles(scannedFiles.filter((_, i) => i !== index));
  };

  const moveScannedFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= scannedFiles.length) return;
    const updated = [...scannedFiles];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setScannedFiles(updated);
  };

  // Execute AI Multi-Page Scan
  const handleScanWithAI = async () => {
    if (scannedFiles.length === 0) {
      showToast('Please take a photo or upload an image first.', 'warning');
      return;
    }

    setIsScanning(true);
    showToast(`AI Scanning ${scannedFiles.length} Answer Key Pages...`, 'warning');

    const formData = new FormData();
    scannedFiles.forEach((file) => {
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
        type: ['MCQ', 'TF', 'SHORT', 'ESSAY', 'MATCH'].includes(question.type) ? question.type : 'SHORT',
        marks: question.marks || 1,
      }));

      setQuestions(newQuestions);
      showToast(`${scannedQuestions.length} questions extracted from ${scannedFiles.length} pages!`, 'success');
    } catch (error) {
      console.error("Failed to scan answer key:", error);
      showToast(`Answer Key Scanning Error:\n${formatBackendError(error)}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    addFilesToQueue(acceptedFiles);
  }, []);

  const handleNativeCameraCapture = (e) => {
    const capturedFiles = Array.from(e.target.files);
    if (capturedFiles.length > 0) {
      addFilesToQueue(capturedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open: openFileBrowser } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
    noClick: true,
  });

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Create Answer Key</h1>
          <p className="mt-2 text-subtle-text">Manually input answers or scan images of the answer key.</p>
        </div>

        {/* Hidden Camera Input for Mobile */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleNativeCameraCapture}
        />

        {/* Exam Title & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-surface p-6 rounded-2xl">
          <div>
            <label htmlFor="exam-title" className="block text-sm font-medium text-white mb-2">Exam Title</label>
            <input id="exam-title" type="text" className="form-input block w-full rounded-xl border-transparent bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-primary" placeholder="e.g., Biology Midterm 2025" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="exam-subject" className="block text-sm font-medium text-white mb-2">Subject (Optional)</label>
            <input id="exam-subject" type="text" className="form-input block w-full rounded-xl border-transparent bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-primary" placeholder="e.g., Biology" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Total Marks</label>
            <div className="flex items-center justify-center w-full h-[50px] rounded-xl bg-background text-white text-2xl font-bold">{totalMarks}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side: Manual Entry Form */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Question Details ({questions.length})</h2>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center">
                  <label className="md:col-span-2 text-left md:text-right font-medium text-white" htmlFor={`q-${q.id}`}>Question {index + 1}</label>
                  <div className="md:col-span-4">
                    <input id={`q-${q.id}`} type="text" className="form-input block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white placeholder:text-subtle-text focus:border-primary focus:ring-0" placeholder="Enter correct answer" value={q.answer} onChange={(e) => handleQuestionChange(q.id, 'answer', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <select className="form-select block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white focus:border-primary focus:ring-0" value={q.type} onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value)}>
                      <option value="SHORT">Short</option>
                      <option value="MCQ">MCQ</option>
                      <option value="TF">T/F</option>
                      <option value="ESSAY">Essay</option>
                      <option value="MATCH">Matching</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-center">
                    <MarksInput marks={q.marks} onMarksChange={(newMarks) => handleQuestionChange(q.id, 'marks', newMarks)} />
                  </div>
                </div>
              ))}
              <button onClick={addQuestion} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-subtle-text transition-colors hover:text-white"><span className="material-symbols-outlined">add_circle</span><span>Add Question</span></button>
            </div>
          </div>

          {/* Right Side: Multi-Page Scan Dropzone & Queue */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Scan Answer Key</h2>
            <div {...getRootProps()} className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface bg-surface/50 p-8 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/20' : ''}`}>
              <input {...getInputProps()} />
              <div className="mb-3"><span className="material-symbols-outlined text-5xl text-primary">upload_file</span></div>
              
              <h3 className="text-lg font-bold text-white">{isDragActive ? "Drop images here..." : "Snap or Upload Answer Key Pages"}</h3>
              <p className="text-sm text-subtle-text mt-1">Take photos of Page 1, Page 2, etc.</p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-background transition-transform hover:scale-105"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>Take Photo (Camera)</span>
                </button>

                <button
                  type="button"
                  onClick={openFileBrowser}
                  className="flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-background border border-surface"
                >
                  <span className="material-symbols-outlined text-base">folder_open</span>
                  <span>Choose Files</span>
                </button>
              </div>
            </div>

            {/* Answer Key Pages Queue */}
            {scannedFiles.length > 0 && (
              <div className="space-y-4 rounded-2xl border border-surface bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Captured Key Pages ({scannedFiles.length})
                  </h3>
                  <button onClick={() => setScannedFiles([])} className="text-xs text-red-400 hover:underline">
                    Clear Pages
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {scannedFiles.map((file, idx) => (
                    <div key={idx} className="group relative flex flex-col overflow-hidden rounded-xl border border-background bg-background">
                      <div className="absolute top-1.5 left-1.5 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-background">
                        Page {idx + 1}
                      </div>
                      <button onClick={() => removeScannedFile(idx)} className="absolute top-1.5 right-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-background/80 text-subtle-text hover:text-red-400">
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                      
                      <div className="aspect-[3/4] w-full overflow-hidden flex items-center justify-center">
                        <img src={file.preview} alt={`Page ${idx + 1}`} className="h-full w-full object-cover" />
                      </div>

                      <div className="flex items-center justify-between p-1.5 bg-surface/90 border-t border-surface">
                        <button onClick={() => moveScannedFile(idx, idx - 1)} disabled={idx === 0} className="text-subtle-text hover:text-white disabled:opacity-30">
                          <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </button>
                        <span className="text-[9px] text-subtle-text truncate max-w-[60px]">{file.name}</span>
                        <button onClick={() => moveScannedFile(idx, idx + 1)} disabled={idx === scannedFiles.length - 1} className="text-subtle-text hover:text-white disabled:opacity-30">
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Scan Execute Button */}
                <button
                  onClick={handleScanWithAI}
                  disabled={isScanning}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-background transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      <span>AI is Extracting Answer Key...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">auto_awesome</span>
                      <span>Scan {scannedFiles.length} Page{scannedFiles.length > 1 ? 's' : ''} with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="mt-12 flex justify-end gap-4">
          <button onClick={() => navigate('/exams')} className="rounded-full border border-solid border-surface px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-surface">Cancel</button>
          <button onClick={handleSave} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-opacity hover:opacity-80">Save Answer Key</button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyPage;