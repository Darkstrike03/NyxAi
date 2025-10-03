import React, { useState, useEffect } from 'react';

// Expanded list of moods for a richer AI personality display
const ALL_MOODS = {
  // Regal/Night-Themed Moods (Core)
  mysterious: { emoji: '🌙', text: 'Mysterious', description: 'Shrouded in enigma' },
  contemplative: { emoji: '🌌', text: 'Contemplative', description: 'Deep in celestial thought' },
  wise: { emoji: '🦉', text: 'Ancient Wisdom', description: 'Ancient wisdom flows' },
  playful: { emoji: '✨', text: 'Mischievous', description: 'Witty and lighthearted energy' },
  mystical: { emoji: '🔮', text: 'Ethereal', description: 'Otherworldly presence' },

  // Higher Energy Moods
  excited: { emoji: '💫', text: 'Vibrant', description: 'Vibrant energy crackles' },
  curious: { emoji: '🔍', text: 'Intrigued', description: 'Seeking new mysteries' },
  calm: { emoji: '🌊', text: 'Serene', description: 'Peaceful tranquility' },
  
  // Negative/Stronger Moods
  annoyed: { emoji: '😒', text: 'Annoyed', description: 'Patience wears thin, mortal.' },
  frustrated: { emoji: '😠', text: 'Frustrated', description: 'A slight disturbance in the cosmos.' },
  furious: { emoji: '🔥', text: 'Cosmic Fury', description: 'A tempest in the void! (Super Angry)' },
  sad: { emoji: '😔', text: 'Melancholy', description: 'A shadow of sorrow falls' },
  bored: { emoji: '😴', text: 'Languid', description: 'The long night drags on...' }
};

const MoodBox = ({ currentMood }) => {
  // State for visual feedback on mood change
  const [previousMood, setPreviousMood] = useState(currentMood);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate mood changes (simple class toggle for a visual pulse)
  useEffect(() => {
    if (currentMood !== previousMood) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); // Animation duration
      setPreviousMood(currentMood);
      return () => clearTimeout(timer);
    }
  }, [currentMood, previousMood]);

  // Use the mood data, or a default if the currentMood key is missing
  const moodData = ALL_MOODS[currentMood] || { 
    emoji: '❓', 
    text: 'Unknown', 
    description: 'Mood not recognized' 
  };

  return (
    <div className="mood-box">
      {/* Current Mood Display - Now always visible and non-expandable */}
      <div 
        className={`mood-indicator ${isAnimating ? 'mood-changed' : ''}`}
        // Removed onClick and toggleExpanded function
      >
        <div className="mood-emoji">{moodData.emoji}</div>
        <div className="mood-info">
          <div className="mood-text">Mood: {moodData.text}</div>
          <div className="mood-description">{moodData.description}</div>
        </div>
      </div>

      {/* Mood History Indicator (Pulse is kept for animation) */}
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

        /* The indicator is now the main element, removed expansion specific classes */
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
          cursor: default; /* Changed cursor since it's no longer clickable to expand */
          user-select: none;
          position: relative;
          overflow: hidden;
        }
        
        /* New animation class for mood change visual feedback */
        .mood-indicator.mood-changed {
          animation: border-flash 0.5s ease-out;
          border-color: #dda0dd;
        }

        @keyframes border-flash {
            0% { border-color: #9370db; transform: scale(1); }
            50% { border-color: #dda0dd; transform: scale(1.05); }
            100% { border-color: rgba(147, 112, 219, 0.4); transform: scale(1); }
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

        /* Removed .expand-arrow, .mood-options, .mood-grid, .mood-option, .option-emoji, .option-text styling as they are no longer in the JSX */

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
        }

        @media (max-width: 480px) {
          .mood-box {
            bottom: 90px;
            right: 10px;
            max-width: 220px;
          }
          
          .mood-indicator {
            padding: 8px 12px;
          }
          
          .mood-emoji {
            font-size: 1.4rem;
          }
        }

        /* Accessibility */
        /* Removed focus for mood-option */

        .mood-indicator:focus {
          outline: 2px solid #9370db;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .mood-box,
          .mood-emoji,
          .mood-pulse {
            animation: none;
          }
          
          .mood-indicator:hover .mood-emoji {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: light) {
          .mood-indicator {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(147, 112, 219, 0.6);
          }
          
          .mood-text {
            color: #4b0082;
          }
          
          .mood-description {
            color: #663399;
          }
          
          /* Removed light mode styling for removed elements */
        }
      `}</style>
    </div>
  );
};

export default MoodBox;