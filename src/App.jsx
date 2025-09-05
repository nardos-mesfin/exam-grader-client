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
    <div className="App">
      <header className="App-header">
        <h1>Exam Grader App</h1>
        <p>API Status: <strong>{message}</strong></p>
      </header>
    </div>
  );
}

export default App;