import React, { useState } from 'react';
import './Quiz.css';

const TOPICS = [
  'Artificial Intelligence',
  'Frontend Development',
  'Backend Development',
  'Machine Learning',
  'Generative AI',
  'DSA',
  'Computer Fundamentals',
  'Fullstack Development'
];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  const handleTopicSelect = (selectedTopic) => {
  setLoading(true);
  setTopic(selectedTopic);
  fetch('http://127.0.0.1:8003/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Topic: selectedTopic })
  })
    .then(res => res.json())
    .then(data => {
      // Handle new error format (string) and old error format (object)
      if (
        (typeof data.error === 'string' && data.error.includes('rate limit')) ||
        (data.error && data.error.code === 'rate_limit_exceeded')
      ) {
        setQuestions([]);
        setLoading(false);
        alert("Rate limit reached. Please try again after some time.");
        setTopic('');
        return;
      }
      if (!data.quiz || !data.quiz.length) {
        setQuestions([]);
        setLoading(false);
        alert("No questions found for this topic. Please try another topic.");
        setTopic('');
        return;
      }
      setQuestions(data.quiz);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
};

  const handleCustomTopicStart = () => {
    if (!customTopic.trim()) return;
    handleTopicSelect(customTopic.trim());
  };

  const handleOptionClick = (optionKey) => {
    setSelected(optionKey);
  };

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  // Progress calculation
  const progress = questions.length ? ((current + (showScore ? 1 : 0)) / questions.length) * 100 : 0;

  if (!topic) {
    return (
      <div className="quiz-bg">
        <div className="quiz-card select-topic-card">
          <h2 className="quiz-title">🚀 Choose Your Quiz Topic</h2>
          <div className="topic-list">
            {TOPICS.map((t) => (
              <button
                key={t}
                className="topic-btn"
                onClick={() => handleTopicSelect(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="custom-topic">
            <input
              type="text"
              placeholder="Or enter your own topic"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              className="custom-topic-input"
            />
            <button
              className="topic-btn"
              onClick={handleCustomTopicStart}
              disabled={!customTopic.trim()}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="quiz-bg">
      <div className="quiz-card loading-card">
        <div className="loader"></div>
        <p>Loading quiz...</p>
      </div>
    </div>
  );

  if (!questions.length) return (
    <div className="quiz-bg">
      <div className="quiz-card">
        <h2>No questions found for this topic.</h2>
        <button className="topic-btn" onClick={() => { setTopic(''); setQuestions([]); }}>Back</button>
      </div>
    </div>
  );

  

  if (showScore) {
    return (
      <div className="quiz-bg">
        <div className="quiz-card score-card">
          <h2>🎉 Quiz Complete!</h2>
          <div className="score-circle">
            <span>{score}</span>
            <small>/ {questions.length}</small>
          </div>
          <p className="score-message">
            {score === questions.length
              ? "Perfect! 🏆"
              : score > questions.length / 2
              ? "Great job! 💡"
              : "Keep practicing! 💪"}
          </p>
          <button className="topic-btn" onClick={() => { setTopic(''); setQuestions([]); setCurrent(0); setScore(0); setShowScore(false); }}>Try Another Quiz</button>
        </div>
      </div>
    );
  }

  const optionsArr = Object.entries(questions[current].options);

  return (
    <div className="quiz-bg">
      <div className="quiz-card">
        <div className="quiz-progress-bar">
          <div className="quiz-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="quiz-header">
          <span className="quiz-topic">{topic}</span>
          <span className="quiz-qno">Q{current + 1} / {questions.length}</span>
        </div>
        <h3 className="quiz-question">{questions[current].question}</h3>
        <div className="quiz-options">
          {optionsArr.map(([key, value]) => {
            let optionClass = "quiz-option";
            if (selected !== null) {
              if (key === questions[current].answer) {
                optionClass += " correct";
              } else if (key === selected) {
                optionClass += " incorrect";
              }
            }
            return (
              <button
                key={key}
                className={optionClass}
                onClick={() => handleOptionClick(key)}
                disabled={selected !== null}
              >
                <span className="option-key">{key}</span>
                <span className="option-value">{value}</span>
              </button>
            );
          })}
        </div>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={selected === null}
        >
          {current === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};




export default Quiz;