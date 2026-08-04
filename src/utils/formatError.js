// src/utils/formatError.js

/**
 * Extracts ONLY the short, human-readable error message string from backend JSON responses.
 */
export const formatBackendError = (error) => {
    // 1. If Network / Wi-Fi Error (Server not reachable)
    if (!error.response) {
      return error.message || 'Network Error - Server Unreachable';
    }
  
    const data = error.response?.data;
  
    // 2. If data is an object, extract the exact message string
    if (typeof data === 'object' && data !== null) {
      
      // A. Check if Google Gemini returned a specific API error message
      const googleMessage =
        data.error_details?.error?.message ||
        data.error?.error?.message ||
        data.error?.message;
  
      if (googleMessage && typeof googleMessage === 'string') {
        return googleMessage;
      }
  
      // B. Check if Laravel returned validation errors (return the first validation message)
      if (data.errors && typeof data.errors === 'object') {
        const firstValidationError = Object.values(data.errors).flat()[0];
        if (firstValidationError) {
          return firstValidationError;
        }
      }
  
      // C. Check top-level Laravel response message
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
    }
  
    // 3. Fallback for raw HTML/Text 500 error pages
    if (typeof data === 'string' && data.length < 150) {
      return data;
    }
  
    return `Server Error (${error.response.status})`;
  };