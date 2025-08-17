import React, { useState,useEffect} from 'react';
import './Quiz.css';
import {useLocation} from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
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

async function trimPDFto40(file) {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  if (pdfDoc.getPageCount() <= 40) {
    return file;
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, [...Array(40).keys()]);
  copiedPages.forEach((p) => newPdf.addPage(p));

  const newBytes = await newPdf.save();
  return new File([newBytes], `trimmed-${file.name}`, { type: 'application/pdf' });
}

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const location = useLocation();
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const topicFromURL = params.get("topic");
  if (topicFromURL && !topic) {
    handleTopicSelect(topicFromURL);
  }
}, [location]);

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleFileUpload = async () => {
  if (!uploadFile) return;

  setLoading(true);
  setTopic('Uploaded File');

  let finalFile = uploadFile;
  if (uploadFile.type === 'application/pdf') {
    try {
      finalFile = await trimPDFto40(uploadFile);
    } catch (e) {
      console.error('Error trimming PDF:', e);
    }
  }

  const formData = new FormData();
  formData.append('file', finalFile);

  fetch('https://quizzes-production.up.railway.app/quiz_with_file', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success || !data.data || !data.data.length) {
        setQuestions([]);
        setLoading(false);
        alert("No questions generated. Try another file.");
        setTopic('');
        return;
      }
      setQuestions(data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
};


  const handleTopicSelect = (selectedTopic) => {
  setLoading(true);
  setTopic(selectedTopic);
  fetch('https://quizzes-production.up.railway.app/quiz', {
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
        <h2 className="quiz-title"> Choose How You Want to Start Your Quiz</h2>

        <div className="quiz-section">
          <h3 className="section-title">📚 Pick a Predefined Topic</h3>
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
        </div>

        <div className="quiz-section">
          <h3 className="section-title">📝 Enter Your Own Topic</h3>
          <div className="custom-topic">
            <input
              type="text"
              placeholder="Type your custom topic here"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              className="custom-topic-input"
            />
            <button
              className="topic-bt"
              onClick={handleCustomTopicStart}
              disabled={!customTopic.trim()}
            >
              Start
            </button>
          </div>
        </div>

        <div className="quiz-section">
          <h3 className="section-title">📄 Or Upload a File</h3>
          <div className="file-upload-container">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              id="fileUpload"
              onChange={e => setUploadFile(e.target.files[0])}
              className="file-input"
            />
            <div className="file-label-container">
            <label htmlFor="fileUpload" className="file-label">
              Choose File
            </label>
            <button
              className="topic-btn upload-btn"
              onClick={handleFileUpload}
              disabled={!uploadFile}
            >
              Upload & Start Quiz
            </button>
            </div>
          </div>
          {uploadFile && (
            <p className="file-name">Selected: {uploadFile.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

  if(loading){
    return (
      <div className="quiz-bg">
        <div className="quiz-card loading-card">
          <h2>Loading questions...</h2>
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  if (!loading&&!questions.length) return (
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

        <div className="quiz-question-area">
         <div className="question-with-hint">
        <h3 className="quiz-question">{questions[current].question}</h3>
        <button className="hint-btn" onClick={toggleHint}>💡</button>
        </div>
        </div>

        {showHint && (
          <div className="quiz-hint">
            {questions[current].hint}
          </div>
        )}

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
          onClick={() => {
            handleNext();
            setShowHint(false); // reset hint on next
          }}
          disabled={selected === null}
        >
          {current === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};




export default Quiz;