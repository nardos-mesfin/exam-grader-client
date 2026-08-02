// src/pages/UploadPage.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import api from '../api';

// Helper to convert File/Blob into a permanent Base64 Data URL
const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const UploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nativeCameraInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(
    location.state?.selectedExamId || sessionStorage.getItem('upload_selected_exam') || ''
  );
  const [uploading, setUploading] = useState(false);
  const [statusText, setUploadingStatusText] = useState('AI is Grading Exam...');

  // In-App Live Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (selectedExam) {
      sessionStorage.setItem('upload_selected_exam', selectedExam);
    }
  }, [selectedExam]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/api/exams');
        setExams(response.data);
      } catch (error) {
        console.error('Failed to fetch answer keys:', error);
      }
    };
    fetchExams();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open: openFileBrowser } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    noClick: true,
  });

  const handleNativeCameraCapture = (e) => {
    const capturedFiles = Array.from(e.target.files);
    if (capturedFiles.length > 0) {
      const filesWithPreview = capturedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    }
  };

  const startLiveCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 3840, min: 1920 },
          height: { ideal: 2160, min: 1080 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not open camera. Please allow camera permissions.');
      setIsCameraOpen(false);
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], `page_${files.length + 1}.jpg`, {
          type: 'image/jpeg',
        });
        const fileWithPreview = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        });
        setFiles((prev) => [...prev, fileWithPreview]);
      }
    }, 'image/jpeg', 0.95);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    const updatedFiles = [...files];
    const [movedItem] = updatedFiles.splice(fromIndex, 1);
    updatedFiles.splice(toIndex, 0, movedItem);
    setFiles(updatedFiles);
  };

  const compressPhoto = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression failed, using original file:', error);
      return file;
    }
  };

  const handleUpload = async () => {
    if (!selectedExam) {
      alert('Please select an Answer Key first.');
      return;
    }
    if (files.length === 0) {
      alert('Please take a photo or select at least one page of the exam paper.');
      return;
    }

    setUploading(true);
    setUploadingStatusText('Preparing permanent previews...');

    try {
      // 1. Generate permanent Data URLs for all captured photos
      const imagePreviews = await Promise.all(
        files.map((file) => fileToDataURL(file))
      );

      setUploadingStatusText('Optimizing photos...');

      // 2. Compress files for API upload
      const compressedFiles = await Promise.all(
        files.map((file) => compressPhoto(file))
      );

      setUploadingStatusText('AI is Grading Exam...');

      const formData = new FormData();
      formData.append('exam_id', selectedExam);

      compressedFiles.forEach((file) => {
        formData.append('pages[]', file);
      });

      const response = await api.post('/api/exam-submissions/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      sessionStorage.removeItem('upload_selected_exam');

      // 3. Navigate with unbreakable Data URLs!
      navigate('/exams/review', {
        state: {
          results: response.data.ai_results,
          answer_key: response.data.answer_key,
          imagePreviews: imagePreviews, // Unbreakable Base64 Data URLs!
          imagePreview: imagePreviews[0],
          examId: selectedExam,
        },
      });
    } catch (error) {
      console.error('Failed to process exam paper:', error);
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error';

      alert(`AI Grading Error:\n${serverMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Upload Exam Paper
          </h1>
          <p className="mt-2 text-subtle-text">
            Select an Answer Key, then snap photos or upload all pages for 1 student.
          </p>
        </div>

        {/* Hidden Native Camera Input */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          className="hidden"
          onChange={handleNativeCameraCapture}
        />

        {/* Answer Key Dropdown */}
        <div className="mb-6 rounded-2xl border border-surface bg-surface p-6">
          <label htmlFor="exam-select" className="block text-sm font-medium text-white mb-2">
            Select Target Answer Key
          </label>
          <select
            id="exam-select"
            className="form-select block w-full rounded-xl border border-background bg-background px-4 py-3 text-white focus:border-primary focus:ring-0"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="" disabled>-- Select an Answer Key --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} {exam.subject ? `(${exam.subject})` : ''} - {exam.total_marks} Marks
              </option>
            ))}
          </select>
        </div>

        {/* Upload Action Card */}
        <div
          {...getRootProps()}
          className={`flex flex-col rounded-2xl border-2 border-dashed border-surface bg-surface/50 px-6 py-10 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/20' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-4xl">photo_camera</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {isDragActive ? 'Drop pages here...' : 'Snap Photos or Choose Files'}
              </p>
              <p className="text-sm text-subtle-text mt-1">
                Upload Page 1, Page 2, etc. for 1 student
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startLiveCamera}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
              >
                <span className="material-symbols-outlined text-xl">videocam</span>
                <span>In-App Live Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-background border border-surface"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span>Native Phone Camera</span>
              </button>

              <button
                type="button"
                onClick={openFileBrowser}
                className="flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-subtle-text transition-colors hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">folder_open</span>
                <span>Gallery Files</span>
              </button>
            </div>
          </div>
        </div>

        {/* LIVE CAMERA MODAL */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
            <div className="flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md">
              <span className="text-sm font-bold text-primary">
                Pages Captured: {files.length}
              </span>
              <button
                onClick={stopLiveCamera}
                className="rounded-full bg-surface p-2 hover:bg-background"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-surface/80 backdrop-blur-md flex items-center justify-around">
              <button
                onClick={stopLiveCamera}
                className="px-6 py-2.5 rounded-full bg-surface text-sm font-bold border border-subtle-text/30"
              >
                Done ({files.length})
              </button>

              <button
                onClick={capturePhotoFromStream}
                className="flex size-16 items-center justify-center rounded-full bg-primary text-background shadow-lg transition-transform active:scale-95"
                title="Snap Photo"
              >
                <span className="material-symbols-outlined text-3xl">photo_camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Uploaded Pages Queue */}
        {files.length > 0 && (
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Captured Exam Pages ({files.length})
                </h2>
                <p className="text-xs text-subtle-text mt-0.5">
                  Check page order or tap arrows to reorder before grading.
                </p>
              </div>
              <button
                onClick={() => setFiles([])}
                className="text-xs font-bold text-red-400 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface bg-surface shadow-md"
                >
                  <div className="absolute top-2 left-2 z-10 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-background shadow-md">
                    Page {index + 1}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-subtle-text hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                    title="Remove Page"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>

                  <div className="aspect-[3/4] w-full bg-background overflow-hidden flex items-center justify-center">
                    <img
                      src={file.preview}
                      alt={`Page ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-background bg-surface/90 p-2">
                    <button
                      onClick={() => moveFile(index, index - 1)}
                      disabled={index === 0}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-subtle-text hover:bg-background hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Left"
                    >
                      <span className="material-symbols-outlined text-base">arrow_back</span>
                    </button>

                    <span className="text-[10px] text-subtle-text truncate max-w-[80px]">
                      {file.name}
                    </span>

                    <button
                      onClick={() => moveFile(index, index + 1)}
                      disabled={index === files.length - 1}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-subtle-text hover:bg-background hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Right"
                    >
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grade Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !selectedExam}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-background transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="size-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                <span>{statusText}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Grade Exam with AI ({files.length} Page{files.length > 1 ? 's' : ''})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;