import React, { useState } from 'react';
import { quizQuestions, tables } from '../data/tables';

function matchScore(table, answers) {
  let score = 0;

  if (answers.environment) {
    if (table.environment === answers.environment || table.environment === 'both') score += 3;
    else return -1; // hard mismatch
  }

  if (answers.space) {
    if (table.size === answers.space) score += 2;
    else if (answers.space === 'full' && table.size === 'mid') score += 0;
    else if (answers.space === 'mid' && table.size === 'full') score += 1;
  }

  if (answers.skillLevel) {
    const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
    const idx = levels.indexOf(answers.skillLevel);
    const tIdx = levels.indexOf(table.skillLevel);
    score += Math.max(0, 2 - Math.abs(idx - tIdx));
  }

  if (answers.budget) {
    const [min, max] = answers.budget.split('-').map(Number);
    const price = table.salePrice ?? table.price;
    if (price >= min && price <= max) score += 3;
    else if (price < min) score += 1;
  }

  return score;
}

export default function QuizWizard({ onResults, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      // Score all tables and return sorted results
      const scored = tables
        .map((t) => ({ table: t, score: matchScore(t, newAnswers) }))
        .filter((r) => r.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.table);
      onResults(scored);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const current = quizQuestions[step];
  const progress = ((step) / quizQuestions.length) * 100;

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
