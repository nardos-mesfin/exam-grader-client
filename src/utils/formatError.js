// src/utils/formatError.js

/**
 * Universally formats any Axios error / backend JSON response into a clear readable string.
 */
export const formatBackendError = (error) => {
    // 1. If no response from server (Network / Wi-Fi disconnected)
    if (!error.response) {
      return error.message || 'Network Error - Server Unreachable';
    }
  
    const data = error.response.data;
  
    // 2. If backend returned a JSON response object
    if (typeof data === 'object' && data !== null) {
      
      // If backend returned Laravel validation errors
      if (data.errors && typeof data.errors === 'object') {
        const validationList = Object.values(data.errors).flat().join('\n• ');
        return `${data.message || 'Validation Error'}:\n• ${validationList}`;
      }
  
      // If backend returned nested error details
      if (data.error_details) {
        const details = typeof data.error_details === 'object'
          ? JSON.stringify(data.error_details, null, 2)
          : data.error_details;
        return `${data.message || 'Error'}\n\nDetails:\n${details}`;
      }
  
      if (data.error) {
        const errStr = typeof data.error === 'object'
          ? JSON.stringify(data.error, null, 2)
          : data.error;
        return `${data.message || 'Error'}\n\nDetails:\n${errStr}`;
      }
  
      // If backend returned a simple message
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
  
      // Fallback: Pretty-print the entire raw JSON from backend
      return JSON.stringify(data, null, 2);
    }
  
    // 3. Fallback for raw HTML 500 error pages
    return `Server Error (${error.response.status}):\n${String(data).substring(0, 200)}`;
  };