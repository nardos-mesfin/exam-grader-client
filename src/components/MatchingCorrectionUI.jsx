// src/components/MatchingCorrectionUI.jsx
import React, { useState, useEffect, useMemo } from 'react';

// Helper function to parse strings like "1-D, 2-I, 3-C" into an object
const parsePairs = (str) => {
  const pairs = {};
  if (!str) return pairs; // Handle null or undefined strings
  
  // Regex to handle different separators like ", " or just " "
  str.split(/, ?| +/).forEach(part => {
    const [key, value] = part.split('-');
    if (key && value) {
      pairs[key.trim()] = value.trim();
    }
  });
  return pairs;
};

const MatchingCorrectionUI = ({ question, onScoreUpdate }) => {
  // Use useMemo to parse only when the input strings change
  const correctPairs = useMemo(() => parsePairs(question.correct_answer), [question.correct_answer]);
  const studentPairs = useMemo(() => parsePairs(question.student_answer), [question.student_answer]);

  // Create a combined state for each sub-question
  const [subQuestions, setSubQuestions] = useState(() =>
    Object.keys(correctPairs).map(key => {
      const studentAnswer = studentPairs[key] || 'N/A';
      const correctAnswer = correctPairs[key];
      
      // ✅ FIX #1: Compare each pair individually and case-insensitively
      return {
        key: key,
        correct: correctAnswer,
        student: studentAnswer,
        isCorrect: studentAnswer.toLowerCase() === correctAnswer.toLowerCase(),
      };
    })
  );

  // This effect runs whenever the user toggles a pair's correctness
  useEffect(() => {
    // Calculate the number of pairs the user has marked as correct
    const correctCount = subQuestions.filter(q => q.isCorrect).length;
    // The total number of pairs in the answer key
    const possibleCount = Object.keys(correctPairs).length;
    
    // ✅ FIX #2: Calculate the proportional score correctly
    // Avoid division by zero
    const proportionalScore = (possibleCount > 0)
      ? Math.round((correctCount / possibleCount) * question.possible_marks)
      : 0;
    
    onScoreUpdate(proportionalScore);

  }, [subQuestions, onScoreUpdate, question.possible_marks, correctPairs]);

  // Handler to toggle the correctness of a single pair
  const toggleCorrectness = (index) => {
    const updated = [...subQuestions];
    updated[index].isCorrect = !updated[index].isCorrect;
    setSubQuestions(updated);
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-12 text-xs font-bold text-subtle-text px-4">
        <div className="col-span-2">Item</div>
        <div className="col-span-4">Correct Answer</div>
        <div className="col-span-4">Student's Answer</div>
        <div className="col-span-2 text-center">Result</div>
      </div>
      {subQuestions.map((sub, index) => (
        <div key={sub.key} className="grid grid-cols-12 items-center bg-background/50 p-3 rounded-lg">
          <div className="col-span-2 font-bold text-white">{sub.key}</div>
          <div className="col-span-4 font-mono text-white">{sub.correct}</div>
          <div className={`col-span-4 font-mono ${sub.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {sub.student}
          </div>
          <div className="col-span-2 flex justify-center">
            <button onClick={() => toggleCorrectness(index)} className={`rounded-full px-3 py-1 text-xs font-semibold ${sub.isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {sub.isCorrect ? 'Correct' : 'Incorrect'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchingCorrectionUI;