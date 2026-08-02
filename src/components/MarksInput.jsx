// src/components/MarksInput.jsx
import React from 'react';

const MarksInput = ({ marks, onMarksChange }) => {
  const handleDecrement = () => {
    const newMarks = Math.max(1, marks - 1); // Marks should not go below 1
    onMarksChange(newMarks);
  };

  const handleIncrement = () => {
    // We can set a reasonable upper limit like 100
    const newMarks = Math.min(100, marks + 1);
    onMarksChange(newMarks);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onMarksChange('');
    } else {
      const newMarks = Math.max(1, Math.min(100, parseInt(value, 10) || 1));
      onMarksChange(newMarks);
    }
  };
  
  const handleBlur = (e) => {
    if (e.target.value === '') {
      onMarksChange(1); // Default to 1 if left empty
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleDecrement} disabled={marks <= 1} className="flex items-center justify-center size-8 rounded-full bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <span className="material-symbols-outlined">remove</span>
      </button>
      <input
        type="number"
        className="form-input w-20 rounded-md border-surface bg-background py-1 px-2 text-white text-center font-bold text-lg"
        value={marks}
        onChange={handleChange}
        onBlur={handleBlur}
        min="1"
      />
      <button onClick={handleIncrement} disabled={marks >= 100} className="flex items-center justify-center size-8 rounded-full bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default MarksInput;