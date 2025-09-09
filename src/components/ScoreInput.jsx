// src/components/ScoreInput.jsx
import React from 'react';

const ScoreInput = ({ score, onScoreChange, maxScore }) => {
  const handleDecrement = () => {
    const newScore = Math.max(0, score - 1);
    onScoreChange(newScore);
  };

  const handleIncrement = () => {
    const newScore = Math.min(maxScore, score + 1);
    onScoreChange(newScore);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onScoreChange('');
    } else {
      const newScore = Math.max(0, Math.min(maxScore, parseInt(value, 10) || 0));
      onScoreChange(newScore);
    }
  };
  
  const handleBlur = (e) => {
    if (e.target.value === '') {
      onScoreChange(0);
    }
  };

  return (
    <div className="flex items-center gap-2">
    <button onClick={handleDecrement} disabled={score <= 0} className="flex items-center justify-center size-8 rounded-full bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
      <span className="material-symbols-outlined">remove</span>
    </button>
    <input
      type="number"
      className="form-input w-20 rounded-md border-surface bg-background py-1 px-2 text-white text-center font-bold text-lg"
      value={score}
      onChange={handleChange}
      onBlur={handleBlur}
      min="0"
      max={maxScore}
    />
    <button onClick={handleIncrement} disabled={score >= maxScore} className="flex items-center justify-center size-8 rounded-full bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
      <span className="material-symbols-outlined">add</span>
    </button>
    
    {/* 👇 THIS IS THE NEW PART 👇 */}
    <span className="text-subtle-text font-medium">/ {maxScore}</span>
    {/* 👆 END OF NEW PART 👆 */}
  </div>
);
};

export default ScoreInput;