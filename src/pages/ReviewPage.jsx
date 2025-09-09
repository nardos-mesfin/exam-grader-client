// src/pages/ReviewPage.jsx
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreInput from '../components/ScoreInput';

// Helper function to get color/status based on score.
const getScoreStatus = (score, maxScore) => {
  if (maxScore === 0) return { color: 'green', text: 'Correct' };
  if (score <= 0) return { color: 'red', text: 'Incorrect' };
  if (score >= maxScore) return { color: 'green', text: 'Correct' };
  return { color: 'yellow', text: 'Partial' };
};

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- DATA INITIALIZATION & STATE ---
  const aiResults = location.state?.results || { student_name: 'Unnamed Student', grades: [] };
  const answerKey = location.state?.answer_key || [];
  const imagePreview = location.state?.imagePreview || null;
  const examId = location.state?.examId || null;

  const [studentName, setStudentName] = useState(aiResults.student_name);
  
  const [grades, setGrades] = useState(() =>
    (aiResults.grades || []).map((grade) => {
      const keyInfo = answerKey.find(q => q.question_number === grade.question_number) || {};
      return {
        ...grade,
        correct_answer: keyInfo.correct_answer || 'N/A',
        possible_marks: keyInfo.marks || 0,
        question_type: keyInfo.question_type || 'SHORT',
        ai_score: grade.score,
      };
    })
  );
  
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('status');

  // --- MEMOIZED CALCULATIONS ---
  const { totalScore, totalPossibleMarks, scoreColorClass } = useMemo(() => {
    const totalPossible = answerKey.reduce((total, q) => total + (q.marks || 0), 0);
    const currentScore = grades.reduce((total, grade) => total + (Number(grade.score) || 0), 0);
    const status = getScoreStatus(currentScore, totalPossible);
    const colorClass = {
      red: 'text-red-400',
      yellow: 'text-yellow-400',
      green: 'text-primary',
    }[status.color];
    return { totalScore: currentScore, totalPossibleMarks: totalPossible, scoreColorClass: colorClass };
  }, [grades, answerKey]);

  const categorizedQuestions = useMemo(() => {
    const correct = [], partial = [], incorrect = [];
    grades.forEach((grade, index) => {
      const { color } = getScoreStatus(grade.score, grade.possible_marks);
      const questionData = { ...grade, originalIndex: index };
      if (color === 'green') correct.push(questionData);
      else if (color === 'yellow') partial.push(questionData);
      else incorrect.push(questionData);
    });
    return { correct, partial, incorrect };
  }, [grades]);

  const questionsByType = useMemo(() => {
    const types = { MCQ: [], TF: [], SHORT: [] };
    grades.forEach((grade, index) => {
      const type = ['MCQ', 'TF', 'SHORT'].includes(grade.question_type) ? grade.question_type : 'SHORT';
      types[type].push({ ...grade, originalIndex: index });
    });
    return types;
  }, [grades]);

  const selectedQuestion = grades[selectedQuestionIndex];

  // --- HANDLER FUNCTIONS ---
  const handleScoreChange = (index, newScore) => {
    const updatedGrades = grades.map((grade, i) =>
      i === index ? { ...grade, score: newScore } : grade
    );
    setGrades(updatedGrades);
  };

  const markAsIncorrect = () => handleScoreChange(selectedQuestionIndex, 0);

  const markAsCorrect = () => {
    const maxScore = grades[selectedQuestionIndex].possible_marks;
    handleScoreChange(selectedQuestionIndex, maxScore);
  };
  
  const handleSaveFinalGrades = () => {
    alert(`Grades saved! Final Score: ${totalScore} / ${totalPossibleMarks}`);
  };

  if (!selectedQuestion) {
    return (
      <div className="flex-1 p-10 text-center text-white">
        <h1 className="text-2xl font-bold">No Grading Data Found</h1>
        <p className="mt-2 text-subtle-text">Please go back and upload an exam paper to begin the review process.</p>
        <button onClick={() => navigate('/exams/upload')} className="mt-6 rounded-full bg-primary px-6 py-3 text-base font-bold text-background">
          Go to Upload Page
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-1 gap-6 p-6">
      {/* --- LEFT COLUMN --- */}
      <div className="flex-1 flex flex-col gap-6 w-1/2">
        {/* ✅ THIS IS THE CORRECTED HEADER SECTION */}
        <div>
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Exam Paper Review</h1>
            <div className={`text-xl font-bold bg-surface px-4 py-2 rounded-lg ${scoreColorClass}`}>
            Total Score: {totalScore} / {totalPossibleMarks}
            </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <label htmlFor="student-name-review" className="text-base text-subtle-text">For Student:</label>
            <input
            id="student-name-review"
            type="text"
            className="form-input w-64 rounded-md border-transparent bg-surface/50 px-3 py-1 text-base font-bold text-white focus:border-primary focus:ring-primary"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            />
        </div>
        </div>

        {/* --- CURRENT QUESTION FOCUS CARD --- */}
        <div className="flex flex-col gap-4 bg-surface p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Question {selectedQuestion.question_number}</h3>
            <span className="text-xs font-semibold bg-background/50 text-subtle-text px-2 py-1 rounded">
              {selectedQuestion.question_type}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-green-400 font-semibold mb-1">Correct Answer</p>
              <p className="text-lg text-white font-mono bg-background/50 p-3 rounded-md min-h-[50px]">
                {selectedQuestion.correct_answer}
              </p>
            </div>
            <div className={`border-l-4 pl-4 ${ {red: 'border-red-500', yellow: 'border-yellow-500', green: 'border-green-500'}[getScoreStatus(selectedQuestion.score, selectedQuestion.possible_marks).color] }`}>
              <p className={`text-sm font-semibold mb-1 ${ {red: 'text-red-400', yellow: 'text-yellow-400', green: 'text-green-400'}[getScoreStatus(selectedQuestion.score, selectedQuestion.possible_marks).color] }`}>
                Student's Answer
              </p>
              <p className="text-lg text-white font-mono bg-background/50 p-3 rounded-md min-h-[50px]">
                {selectedQuestion.student_answer}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-background/50 p-4 rounded-lg mt-4">
            <ScoreInput
              score={selectedQuestion.score}
              maxScore={selectedQuestion.possible_marks}
              onScoreChange={(newScore) => handleScoreChange(selectedQuestionIndex, newScore)}
            />
            <div className="flex items-center gap-2">
              {selectedQuestion.score < selectedQuestion.possible_marks ? (
                <button onClick={markAsCorrect} className="flex items-center gap-2 rounded-full h-10 px-4 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Mark as Correct</span>
                </button>
              ) : (
                <button onClick={markAsIncorrect} className="flex items-center gap-2 rounded-full h-10 px-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  <span>Mark as Incorrect</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- ALL QUESTIONS OVERVIEW --- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Questions</h2>
            <div className="flex items-center gap-2 rounded-full bg-surface p-1">
              <button onClick={() => setFilterMode('status')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${filterMode === 'status' ? 'bg-primary text-background' : 'text-subtle-text hover:bg-background/50'}`}>By Status</button>
              <button onClick={() => setFilterMode('type')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${filterMode === 'type' ? 'bg-primary text-background' : 'text-subtle-text hover:bg-background/50'}`}>By Type</button>
            </div>
          </div>
          
          <div className="mt-2">
            {filterMode === 'status' ? (
              <>
                {categorizedQuestions.incorrect.length > 0 && (<div><h3 className="text-sm font-bold text-red-400 mb-2">INCORRECT</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{categorizedQuestions.incorrect.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
                {categorizedQuestions.partial.length > 0 && (<div className="mt-4"><h3 className="text-sm font-bold text-yellow-400 mb-2">PARTIAL CREDIT</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{categorizedQuestions.partial.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
                {categorizedQuestions.correct.length > 0 && (<div className="mt-4"><h3 className="text-sm font-bold text-green-400 mb-2">CORRECT</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{categorizedQuestions.correct.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
              </>
            ) : (
              <>
                {questionsByType.SHORT.length > 0 && (<div><h3 className="text-sm font-bold text-blue-400 mb-2">SHORT ANSWER</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{questionsByType.SHORT.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
                {questionsByType.MCQ.length > 0 && (<div className="mt-4"><h3 className="text-sm font-bold text-purple-400 mb-2">MULTIPLE CHOICE</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{questionsByType.MCQ.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
                {questionsByType.TF.length > 0 && (<div className="mt-4"><h3 className="text-sm font-bold text-indigo-400 mb-2">TRUE / FALSE</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{questionsByType.TF.map((grade) => (<QuestionCard key={grade.originalIndex} grade={grade} isSelected={selectedQuestionIndex === grade.originalIndex} onClick={() => setSelectedQuestionIndex(grade.originalIndex)} />))}</div></div>)}
              </>
            )}
          </div>
        </div>
        
        <div className="mt-auto flex justify-end pt-6">
          <button onClick={handleSaveFinalGrades} className="rounded-full bg-primary px-8 py-3 text-base font-bold text-background transition-transform hover:scale-105">
            Save Final Grade
          </button>
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="flex-1 flex flex-col gap-4 bg-surface rounded-xl p-4 sticky top-6 h-[calc(100vh-6rem)]">
        <h2 className="text-xl font-bold">Scanned Exam Paper</h2>
        <div className="flex-1 w-full bg-background rounded-lg overflow-hidden">
          <div
            className="w-full h-full bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${imagePreview})` }}
          ></div>
        </div>
      </div>
    </main>
  );
};

const QuestionCard = ({ grade, isSelected, onClick }) => {
    const status = getScoreStatus(grade.score, grade.possible_marks);
    const colorClasses = {
        red: 'bg-red-500/10 text-red-400',
        yellow: 'bg-yellow-500/10 text-yellow-400',
        green: 'bg-green-500/10 text-green-400',
    };

    return (
        <div onClick={onClick} className={`flex flex-col gap-3 p-4 rounded-lg bg-surface border-2 transition-colors cursor-pointer ${isSelected ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
            <div className="flex items-center justify-between">
                <p className="font-semibold text-white">Question {grade.question_number}</p>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[status.color]}`}>
                    {status.text}
                </span>
            </div>
            <p className="text-sm text-subtle-text truncate">{grade.student_answer}</p>
        </div>
    );
};

export default ReviewPage;