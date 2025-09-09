// src/utils/imageCompressor.js
import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,          // Max file size in MB
    maxWidthOrHeight: 1920, // Max width or height
    useWebWorker: true,    // Use a web worker for better performance
  };
  try {
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    return file; // If compression fails, return the original file
  }
};