// src/utils/formatError.js

/**
 * Extracts clean, human-readable error messages for Toast banners.
 */
export const formatBackendError = (error) => {
    // 1. Network / Wi-Fi Disconnected
    if (!error.response) {
      return error.message || 'Network Error - Server Unreachable';
    }
  
    const data = error.response?.data;
    let rawMessage = '';
  
    if (typeof data === 'object' && data !== null) {
      rawMessage =
        data.error_details?.error?.message ||
        data.error?.error?.message ||
        data.error?.message ||
        (data.errors && Object.values(data.errors).flat()[0]) ||
        data.message ||
        '';
    } else if (typeof data === 'string') {
      rawMessage = data;
    }
  
    if (!rawMessage) {
      return `Server Error (${error.response.status}): ${error.response.statusText || 'Unexpected error'}`;
    }
  
    const str = String(rawMessage);
  
    // 2. Smart Shortcuts for common API/Server errors
    if (str.includes('RESOURCE_EXHAUSTED') || str.includes('Quota exceeded')) {
      return 'Quota Exceeded: Gemini AI free daily limit reached.';
    }
    if (str.includes('API_KEY_INVALID') || str.includes('API key not valid')) {
      return 'Invalid API Key: Please check your key in Settings.';
    }
    if (str.includes('cURL error 28') || str.includes('Maximum execution time')) {
      return 'Server Timeout: AI request took too long. Please try again.';
    }
  
    // 3. For any other error, clean up newlines and return up to 180 characters
    const cleanStr = str.replace(/[\r\n]+/g, ' ').trim();
  
    return cleanStr.length > 180 ? `${cleanStr.substring(0, 177)}...` : cleanStr;
  };