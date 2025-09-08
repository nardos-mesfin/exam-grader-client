// src/pages/UploadPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch the list of existing exams when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        // We need to build this /api/exams GET endpoint next
        const response = await api.get('/api/exams');
        setExams(response.data);
      } catch (error) {
        console.error("Failed to fetch exams", error);
      }
    };
    fetchExams();
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    // Add preview URLs to the files so we can display images
    const filesWithPreview = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] }
  });

  const handleUpload = async () => {
    if (!selectedExam) {
      alert('Please select an exam first.');
      return;
    }
    if (files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    setUploading(true);

    // We'll upload files one by one
    for (const file of files) {
      const formData = new FormData();
      formData.append('exam_id', selectedExam);
      formData.append('image', file);

      try {
        console.log(`Uploading ${file.name}...`);
        const response = await api.post('/api/exam-submissions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log(`Successfully processed ${file.name}:`, response.data.extracted_text);
        // Here you would update the file's state to "processed"
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Here you would update the file's state to "error"
      }
    }
    setUploading(false);
    alert('All uploads processed!');
  };

  return (
    <main className="flex-1 px-10 sm:px-20 md:px-40 py-12">
      <div className="mx-auto flex max-w-4xl flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-white">Upload Exam Papers</h1>
          <p className="mt-2 text-lg text-subtle-text">Easily upload scanned papers for automated grading.</p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="exam-select" className="block text-sm font-medium text-white mb-2">Select Exam Answer Key</label>
          <select
            id="exam-select"
            className="form-select block w-full rounded-xl border border-surface bg-background px-4 py-3 text-white focus:border-primary focus:ring-0"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="" disabled>Select an exam...</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        </div>

        <div
          {...getRootProps()}
          className={`flex flex-col rounded-xl border-2 border-dashed border-surface bg-surface/50 px-6 py-14 text-center transition-colors cursor-pointer hover:border-primary/50 ${isDragActive ? 'border-primary bg-primary/20' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-4xl"> upload_file </span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {isDragActive ? "Drop the files here ..." : "Drag and drop or browse to upload"}
              </p>
              <p className="text-sm text-subtle-text">Supported formats: JPEG, PNG</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">Upload Queue</h2>
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-surface p-4">
                <img src={file.preview} alt="preview" className="size-10 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-subtle-text">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !selectedExam}
            className="flex min-w-[12rem] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-background transition hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined"> upload </span>
            <span>{uploading ? 'Processing...' : `Upload ${files.length} File(s)`}</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;