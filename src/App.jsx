import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // The URL of our Laravel API endpoint
    fetch('http://127.0.0.1:8000/api/test')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setMessage('Failed to connect to the API. Is it running?');
      });
  }, []); // The empty array means this effect runs only once

  return (
    <h1 className="text-4xl font-bold text-green-500">
    Tailwind is working 🎉
  </h1>
  );
}

export default App;