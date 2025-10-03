import React from 'react';

const Message = ({ message }) => {
  const isNyx = message.sender === 'nyx';
  const isUser = message.sender === 'user';

  return (
    <div className={`message ${isNyx ? 'nyx-message' : 'user-message'}`}>
      {isNyx && (
        <div className="message-avatar">
          <span>🌙</span>
        </div>
      )}
      <div className="message-content">
        <div className="message-bubble">
          <p className="message-text">{message.text}</p>
          <span className="message-time">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {isUser && (
        <div className="message-avatar user-avatar">
          <span>👤</span>
        </div>
      )}
      
      <style jsx>{`
        .message {
          display: flex;
          margin-bottom: 20px;
          align-items: flex-end;
          animation: slide-in 0.3s ease-out;
        }

        .user-message {
          justify-content: flex-end;
        }

        .nyx-message {
          justify-content: flex-start;
        }

        .message-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          margin: 0 10px;
          background: linear-gradient(45deg, #4b0082, #663399);
          border: 2px solid #9370db;
          box-shadow: 0 2px 10px rgba(147, 112, 219, 0.3);
          flex-shrink: 0;
        }

        .user-avatar {
          background: linear-gradient(45deg, #2e2e2e, #4a4a4a);
          border-color: #6a6a6a;
          box-shadow: 0 2px 10px rgba(106, 106, 106, 0.3);
        }

        .message-content {
          max-width: 70%;
          min-width: 0;
          flex: 1;
        }

        .message-bubble {
          padding: 12px 18px;
          border-radius: 20px;
          position: relative;
          backdrop-filter: blur(5px);
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(147, 112, 219, 0.2);
        }

        .nyx-message .message-bubble {
          background: rgba(147, 112, 219, 0.15);
          border-radius: 20px 20px 20px 5px;
          border-color: rgba(147, 112, 219, 0.3);
        }

        .nyx-message .message-bubble:hover {
          background: rgba(147, 112, 219, 0.2);
          border-color: rgba(147, 112, 219, 0.4);
        }

        .user-message .message-bubble {
          background: rgba(34, 34, 68, 0.8);
          border-radius: 20px 20px 5px 20px;
          border-color: rgba(106, 106, 106, 0.3);
        }

        .user-message .message-bubble:hover {
          background: rgba(34, 34, 68, 0.9);
          border-color: rgba(106, 106, 106, 0.4);
        }

        .message-text {
          margin: 0 0 8px 0;
          line-height: 1.5;
          word-wrap: break-word;
          color: #e6e6fa;
          font-size: 0.95rem;
        }

        .nyx-message .message-text {
          color: #f0e6ff;
          text-shadow: 0 1px 3px rgba(147, 112, 219, 0.1);
        }

        .user-message .message-text {
          color: #e6e6fa;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.6;
          color: #b19cd9;
          font-weight: 300;
          display: block;
          text-align: right;
        }

        .nyx-message .message-time {
          text-align: left;
        }

        /* Message delivery states */
        .message.sending .message-bubble {
          opacity: 0.7;
          transform: scale(0.98);
        }

        .message.delivered .message-bubble {
          animation: message-delivered 0.3s ease-out;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes message-delivered {
          0% { transform: scale(0.98); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        /* Special message types */
        .message.system .message-bubble {
          background: rgba(147, 112, 219, 0.1);
          border: 1px solid rgba(147, 112, 219, 0.2);
          text-align: center;
          border-radius: 15px;
          font-style: italic;
          opacity: 0.8;
        }

        .message.system .message-text {
          color: #b19cd9;
          font-size: 0.85rem;
        }

        /* Long text handling */
        .message-text {
          max-width: 100%;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        /* Link styling within messages */
        .message-text a {
          color: #dda0dd;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .message-text a:hover {
          color: #e6b3ff;
        }

        /* Code blocks in messages */
        .message-text code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.85em;
          color: #dda0dd;
        }

        .message-text pre {
          background: rgba(0, 0, 0, 0.4);
          padding: 10px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 8px 0;
          border: 1px solid rgba(147, 112, 219, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .message-content {
            max-width: 80%;
          }
          
          .message-avatar {
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
            margin: 0 8px;
          }
          
          .message-bubble {
            padding: 10px 15px;
          }
          
          .message-text {
            font-size: 0.9rem;
            line-height: 1.4;
          }
          
          .message-time {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 480px) {
          .message-content {
            max-width: 85%;
          }
          
          .message-avatar {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
            margin: 0 6px;
          }
          
          .message-bubble {
            padding: 8px 12px;
          }
          
          .message-text {
            font-size: 0.85rem;
          }
        }

        /* Accessibility */
        .message:focus-within {
          outline: 2px solid rgba(147, 112, 219, 0.5);
          outline-offset: 2px;
          border-radius: 8px;
        }

        .message-bubble:focus {
          outline: none;
        }

        /* Print styles */
        @media print {
          .message {
            break-inside: avoid;
            margin-bottom: 10px;
          }
          
          .message-bubble {
            border: 1px solid #ccc !important;
            background: white !important;
            color: black !important;
          }
          
          .message-time {
            color: #666 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Message;