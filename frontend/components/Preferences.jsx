import React, { useState } from "react";
import "./Preferences.css";

const PREFERENCE_OPTIONS = [
  "Programming","Data Structures", "AI", "Frontend Development","Backend Development","Full Stack Development","DevOps", "Machine Learning","Computer Science"
];

const Preferences = ({ isOpen, onClose, onSave }) => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((o) => o !== option));
    } else if (selected.length < 3) {
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 3) {
      onSave(selected);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Your Top 3 Preferences</h2>
        <div className="preferences-options">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option}
              className={`pref-chip${selected.includes(option) ? " selected" : ""}`}
              onClick={() => handleSelect(option)}
              disabled={!selected.includes(option) && selected.length === 3}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={selected.length !== 3}>
            Save Preferences
          </button>
          <button onClick={onClose} className="secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;