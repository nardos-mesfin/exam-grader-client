// src/api.js
import axios from 'axios';
import Cookies from 'js-cookie'; // Import the library

// Create a single, unified Axios instance for the entire application.
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// THIS IS THE MAGIC PART: An Axios Interceptor
api.interceptors.request.use(config => {
  // This function will run before every single request is sent by this instance.

  // 1. Read the raw, potentially encoded XSRF-TOKEN from the cookies.
  const xsrfToken = Cookies.get('XSRF-TOKEN');

  if (xsrfToken) {
    // 2. Decode the token. The `decodeURIComponent` function is a built-in
    //    JavaScript function that correctly handles replacing %3D with = and
    //    any other URL-encoded characters.
    const decodedXsrfToken = decodeURIComponent(xsrfToken);
    
    // 3. Manually set the X-XSRF-TOKEN header on the outgoing request
    //    with the correctly decoded value.
    config.headers['X-XSRF-TOKEN'] = decodedXsrfToken;
  }

  // 4. Return the modified config so the request can proceed.
  return config;
});

export default api;