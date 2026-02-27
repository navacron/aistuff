import React, { useState } from 'react';
import { quizQuestions } from '../data/config';

export default function QuizWizard({ onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const current = quizQuestions[step];
  const progress = (step / quizQuestions.length) * 100;

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-close" onClick={onClose}>✕</button>

        <div className="quiz-header">
          <div className="quiz-title">Find Your Perfect Table</div>
          <div className="quiz-step-label">
            Question {step + 1} of {quizQuestions.length}
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="quiz-body">
          <h2 className="quiz-question">{current.question}</h2>
          <div className="quiz-options">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className="quiz-option"
                onClick={() => handleAnswer(current.id, opt.value)}
              >
                <span className="quiz-option-emoji">{opt.emoji}</span>
                <span className="quiz-option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {step > 0 && (
          <button className="quiz-back" onClick={handleBack}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
