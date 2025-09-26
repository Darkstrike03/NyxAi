import React, { useState, useEffect } from 'react';

const MoodBox = ({ currentMood, onMoodChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousMood, setPreviousMood] = useState(currentMood);

  const moodEmojis = {
    mysterious: '🌙',
    curious: '🔮',
    wise: '⭐',
    playful: '✨',
    contemplative: '🌌',
    excited: '💫',
    calm: '🌊',
    mystical: '🔯'
  };

  const moodTexts = {
    mysterious: 'Mysterious',
    curious: 'Curious',
    wise: 'Wise',
    playful: 'Playful',
    contemplative: 'Contemplative',
    excited: 'Excited',
    calm: 'Calm',
    mystical: 'Mystical'
  };

  const moodDescriptions = {
    mysterious: 'Shrouded in enigma',
    curious: 'Seeking knowledge',
    wise: 'Ancient wisdom flows',
    playful: 'Lighthearted energy',
    contemplative: 'Deep in thought',
    excited: 'Vibrant energy',
    calm: 'Peaceful serenity',
    mystical: 'Otherworldly presence'
  };

  // Animate mood changes
  useEffect(() => {
    if (currentMood !== previousMood) {
      setPreviousMood(currentMood);
    }
  }, [currentMood, previousMood]);

  const handleMoodClick = (mood) => {
    if (onMoodChange) {
      onMoodChange(mood);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const allMoods = Object.keys(moodEmojis);

  return (
    <div className={`mood-box ${isExpanded ? 'expanded' : ''}`}>
      {/* Current Mood Display */}
      <div className="mood-indicator" onClick={toggleExpanded}>
        <div className="mood-emoji">{moodEmojis[currentMood]}</div>
        <div className="mood-info">
          <div className="mood-text">{moodTexts[currentMood]}</div>
          <div className="mood-description">{moodDescriptions[currentMood]}</div>
        </div>
        <div className="expand-arrow">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Expanded Mood Options */}
      {isExpanded && (
        <div className="mood-options">
          <div className="mood-grid">
            {allMoods.map((mood) => (
              <button
                key={mood}
                className={`mood-option ${mood === currentMood ? 'active' : ''}`}
                onClick={() => handleMoodClick(mood)}
                title={moodDescriptions[mood]}
              >
                <span className="option-emoji">{moodEmojis[mood]}</span>
                <span className="option-text">{moodTexts[mood]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mood History Indicator */}
      <div className="mood-pulse"></div>
      
      <style jsx>{`
        .mood-box {
          position: fixed;
          bottom: 120px;
          right: 20px;
          z-index: 20;
          animation: mood-float 3s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 280px;
        }

        .mood-box.expanded {
          animation-play-state: paused;
          transform: translateY(-10px);
        }

        .mood-indicator {
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(147, 112, 219, 0.4);
          border-radius: 20px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(147, 112, 219, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
          position: relative;
          overflow: hidden;
        }

        .mood-indicator::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(147, 112, 219, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .mood-indicator:hover {
          transform: scale(1.02);
          border-color: #9370db;
          box-shadow: 0 12px 40px rgba(147, 112, 219, 0.4);
        }

        .mood-indicator:hover::before {
          left: 100%;
        }

        .mood-emoji {
          font-size: 1.8rem;
          animation: emoji-pulse 2s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(147, 112, 219, 0.3));
          transition: transform 0.3s ease;
        }

        .mood-indicator:hover .mood-emoji {
          transform: scale(1.1) rotate(10deg);
        }

        .mood-info {
          flex: 1;
          min-width: 0;
        }

        .mood-text {
          color: #e6e6fa;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.05rem;
          margin-bottom: 2px;
        }

        .mood-description {
          color: #b19cd9;
          font-size: 0.7rem;
          opacity: 0.8;
          font-style: italic;
        }

        .expand-arrow {
          color: #9370db;
          font-size: 0.8rem;
          transition: transform 0.3s ease;
          margin-left: 8px;
        }

        .mood-box.expanded .expand-arrow {
          transform: rotate(180deg);
        }

        /* Mood Options Panel */
        .mood-options {
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 15px;
          margin-top: 8px;
          padding: 15px;
          box-shadow: 0 8px 32px rgba(147, 112, 219, 0.2);
          animation: expand-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: bottom right;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .mood-option {
          background: rgba(34, 34, 68, 0.6);
          border: 1px solid rgba(147, 112, 219, 0.2);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #e6e6fa;
          font-size: 0.8rem;
          min-height: 40px;
        }

        .mood-option:hover {
          background: rgba(147, 112, 219, 0.2);
          border-color: rgba(147, 112, 219, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(147, 112, 219, 0.2);
        }

        .mood-option.active {
          background: rgba(147, 112, 219, 0.3);
          border-color: #9370db;
          box-shadow: 0 0 15px rgba(147, 112, 219, 0.4);
        }

        .option-emoji {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .option-text {
          font-weight: 300;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Mood Pulse Effect */
        .mood-pulse {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 25px;
          background: linear-gradient(45deg, #9370db, #dda0dd, #9370db);
          background-size: 400% 400%;
          animation: pulse-border 3s ease-in-out infinite;
          z-index: -1;
          opacity: 0.6;
        }

        /* Animations */
        @keyframes mood-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes emoji-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes expand-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            background-position: 0% 50%;
            opacity: 0.3;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.6;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .mood-box {
            bottom: 100px;
            right: 15px;
            max-width: 250px;
          }
          
          .mood-indicator {
            padding: 10px 14px;
            gap: 8px;
          }
          
          .mood-emoji {
            font-size: 1.5rem;
          }
          
          .mood-text {
            font-size: 0.85rem;
          }
          
          .mood-description {
            font-size: 0.65rem;
          }
          
          .mood-options {
            padding: 12px;
          }
          
          .mood-option {
            padding: 6px 10px;
            font-size: 0.75rem;
            min-height: 36px;
          }
          
          .option-emoji {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .mood-box {
            bottom: 90px;
            right: 10px;
            max-width: 220px;
          }
          
          .mood-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          
          .mood-indicator {
            padding: 8px 12px;
          }
          
          .mood-emoji {
            font-size: 1.4rem;
          }
        }

        /* Accessibility */
        .mood-option:focus {
          outline: 2px solid #9370db;
          outline-offset: 2px;
        }

        .mood-indicator:focus {
          outline: 2px solid #9370db;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .mood-box {
  position: fixed;
  bottom: 120px;
  right: 20px;
  z-index: 20;
  animation: mood-float 3s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 280px;
}

.mood-box.expanded {
  animation-play-state: paused;
  transform: translateY(-10px);
}

.mood-indicator {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(147, 112, 219, 0.4);
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(147, 112, 219, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.mood-indicator:hover {
  transform: scale(1.02);
  border-color: #9370db;
  box-shadow: 0 12px 40px rgba(147, 112, 219, 0.4);
}

.mood-emoji {
  font-size: 1.8rem;
  animation: emoji-pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(147, 112, 219, 0.3));
  transition: transform 0.3s ease;
}

.mood-indicator:hover .mood-emoji {
  transform: scale(1.1) rotate(10deg);
}

.mood-info {
  flex: 1;
  min-width: 0;
}

.mood-text {
  color: #e6e6fa;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  margin-bottom: 2px;
}

.mood-description {
  color: #b19cd9;
  font-size: 0.7rem;
  opacity: 0.8;
  font-style: italic;
}

.expand-arrow {
  color: #9370db;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  margin-left: 8px;
}

.mood-box.expanded .expand-arrow {
  transform: rotate(180deg);
}

/* Mood Options Panel */
.mood-options {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(147, 112, 219, 0.3);
  border-radius: 15px;
  margin-top: 8px;
  padding: 15px;
  box-shadow: 0 8px 32px rgba(147, 112, 219, 0.2);
  animation: expand-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.mood-option {
  background: rgba(34, 34, 68, 0.6);
  border: 1px solid rgba(147, 112, 219, 0.2);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e6e6fa;
  font-size: 0.8rem;
  min-height: 40px;
}

.mood-option:hover {
  background: rgba(147, 112, 219, 0.2);
  border-color: rgba(147, 112, 219, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 112, 219, 0.2);
}

.mood-option.active {
  background: rgba(147, 112, 219, 0.3);
  border-color: #9370db;
  box-shadow: 0 0 15px rgba(147, 112, 219, 0.4);
}

.option-emoji {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.option-text {
  font-weight: 300;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mood Pulse Effect */
.mood-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 25px;
  background: linear-gradient(45deg, #9370db, #dda0dd, #9370db);
  background-size: 400% 400%;
  animation: pulse-border 3s ease-in-out infinite;
  z-index: -1;
  opacity: 0.6;
}

/* Animations */
@keyframes mood-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes emoji-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes expand-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse-border {
  0%, 100% {
    background-position: 0% 50%;
    opacity: 0.3;
  }
  50% {
    background-position: 100% 50%;
    opacity: 0.6;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .mood-box {
    bottom: 100px;
    right: 15px;
    max-width: 250px;
  }
  
  .mood-indicator {
    padding: 10px 14px;
    gap: 8px;
  }
  
  .mood-emoji {
    font-size: 1.5rem;
  }
  
  .mood-text {
    font-size: 0.85rem;
  }
  
  .mood-description {
    font-size: 0.65rem;
  }
  
  .mood-options {
    padding: 12px;
  }
  
  .mood-option {
    padding: 6px 10px;
    font-size: 0.75rem;
    min-height: 36px;
  }
  
  .option-emoji {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .mood-box {
    bottom: 90px;
    right: 10px;
    max-width: 220px;
  }
  
  .mood-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .mood-indicator {
    padding: 8px 12px;
  }
  
  .mood-emoji {
    font-size: 1.4rem;
  `}</style>
    </div>
  );
};

export default MoodBox;