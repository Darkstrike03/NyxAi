import React, { useState, useEffect, useRef } from 'react';
import { useChatMemory } from '../hooks/useChatMemory';
import { searchWeb } from '../services/searchService';
import { getPersonality, updatePersonality } from '../config/personality';
import { storeSessionData } from '../services/cloudService';
import { generateResponse } from '../services/llmService'; // Import LLM API service
import MoodBox from './MoodBox';
import { analyzeMood } from '../utils/MoodAnalyzer';

const Chat = () => {
  const { logMessage } = useChatMemory();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to NYX, mortal. I am the goddess of the night, here to guide you through the mysteries of conversation.",
      sender: 'nyx',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState('mysterious');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const newMood = analyzeMood(userMessage.text);
    setCurrentMood(newMood); 

    await logMessage(inputText, 'neutral', 'chat'); // Log user message
    setInputText('');
    setIsTyping(true);

    try {
      // Check core memory first
      const personality = getPersonality();
      let aiResponse = checkCoreMemory(inputText, personality);

      if (!aiResponse) {
        // If no response from core memory, perform a web search
        const searchResults = await searchWeb(inputText);
        console.log('🔍 Search results:', searchResults);

        if (searchResults.length > 0) {
          const firstResult = searchResults[0];
          aiResponse = `I found this: ${firstResult.title} - ${firstResult.url}`;
        } else {
          // If no web search results, generate a response using the LLM
          aiResponse = await generateFallbackResponse(inputText, personality);
        }
      }

      const nyxMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'nyx',
        timestamp: new Date(),
        feedback: null, // Track feedback (thumbs-up or thumbs-down)
      };

      setMessages((prev) => [...prev, nyxMessage]);
      await logMessage(aiResponse, newMood, 'response'); // Log AI response
    } catch (error) {
      console.error('❌ Error during chat interaction:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: '[Error: Unable to fetch response]',
          sender: 'nyx',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Check core memory for a response
  const checkCoreMemory = (query, personality) => {
    const knowledgeBase = personality.knowledgeBase || [];
    const match = knowledgeBase.find((entry) =>
      query.toLowerCase().includes(entry.keyword.toLowerCase())
    );
    return match ? match.response : null;
  };

  // Generate a fallback response using the LLM
  const generateFallbackResponse = async (query, personality) => {
    try {
      const response = await generateResponse(query, personality); // Call LLM API
      console.log('🤖 Fallback response from LLM:', response);
      return response || "I'm not sure how to respond to that, but I'm always learning!";
    } catch (error) {
      console.error('❌ Error generating fallback response:', error);
      return "I'm having trouble thinking of a response right now. Please try again later.";
    }
  };

  // Handle feedback (thumbs-up or thumbs-down)
  const handleFeedback = async (messageId, feedback) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );

    const message = messages.find((msg) => msg.id === messageId);

    if (feedback === 'up') {
      // Store good responses in core memory
      const personality = getPersonality();
      const updatedKnowledgeBase = [
        ...(personality.knowledgeBase || []),
        { keyword: message.text, response: message.text },
      ];
      updatePersonality({ knowledgeBase: updatedKnowledgeBase });
      console.log('✅ Response stored in core memory:', message.text);
    } else {
      console.log('❌ Response marked for improvement:', message.text);
    }

    // Optionally, log feedback in Supabase
    await storeSessionData(messageId, { ...message, feedback });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      {/* Animated background */}
      <div className="chat-background">
        <div className="night-particles"></div>
        <div className="cosmic-dust"></div>
        <div className="stars"></div>
      </div>

      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <div className="nyx-avatar">
            <div className="avatar-glow"></div>
            <span className="avatar-symbol">🌙</span>
          </div>
          <div className="header-info">
            <h2 className="chat-title">NYX</h2>
            <p className="chat-status">Goddess of the Night • Online</p>
          </div>
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'nyx' ? 'nyx-message' : 'user-message'}`}>
              {message.sender === 'nyx' && (
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
                {message.sender === 'nyx' && (
                  <div className="feedback-buttons">
                    <button
                      className={`thumb-button ${message.feedback === 'up' ? 'active' : ''}`}
                      onClick={() => handleFeedback(message.id, 'up')}
                      title="Helpful response"
                    >
                      👍
                    </button>
                    <button
                      className={`thumb-button ${message.feedback === 'down' ? 'active' : ''}`}
                      onClick={() => handleFeedback(message.id, 'down')}
                      title="Needs improvement"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
              {message.sender === 'user' && (
                <div className="message-avatar user-avatar">
                  <span>👤</span>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-avatar">🌙</div>
              <div className="typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with the night..."
            className="message-input"
            rows="1"
          />
          <button
            type="button"
            className="send-button"
            disabled={!inputText.trim()}
            onClick={handleSendMessage}
          >
            <span className="send-icon">✦</span>
          </button>
        </div>
      </div>

      {/* Mood Box Component */}
      <MoodBox currentMood={currentMood} />

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f0f0f 100%);
          color: #e6e6fa;
          font-family: 'Arial', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated Background */
        .chat-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .night-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 40px 60px, rgba(147, 112, 219, 0.4), transparent),
            radial-gradient(1px 1px at 120px 20px, rgba(221, 160, 221, 0.3), transparent),
            radial-gradient(1px 1px at 170px 90px, rgba(186, 85, 211, 0.2), transparent);
          background-size: 300px 200px;
          animation: float-particles 20s linear infinite;
        }

        .cosmic-dust {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(1px 1px at 80px 10px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(1px 1px at 180px 50px, rgba(255, 255, 255, 0.05), transparent);
          background-size: 400px 300px;
          animation: drift 30s linear infinite reverse;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #fff, transparent),
            radial-gradient(1px 1px at 60px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 100px 50px, #fff, transparent);
          background-repeat: repeat;
          background-size: 200px 150px;
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes float-particles {
          from { transform: translateY(100vh); }
          to { transform: translateY(-100vh); }
        }

        @keyframes drift {
          from { transform: translateX(-100px); }
          to { transform: translateX(100px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Header */
        .chat-header {
          background: rgba(26, 26, 46, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(147, 112, 219, 0.2);
          padding: 15px 20px;
          z-index: 10;
          position: relative;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nyx-avatar {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, #4b0082, #663399);
          border: 2px solid #9370db;
        }

        .avatar-glow {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: linear-gradient(45deg, #9370db, #dda0dd);
          animation: pulse-glow 2s ease-in-out infinite;
          z-index: -1;
        }

        .avatar-symbol {
          font-size: 1.5rem;
          z-index: 2;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .header-info {
          flex: 1;
          margin-left: 15px;
        }

        .chat-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 300;
          background: linear-gradient(45deg, #9370db, #dda0dd);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .chat-status {
          margin: 0;
          font-size: 0.85rem;
          color: #b19cd9;
          opacity: 0.8;
        }

        .back-button {
          background: transparent;
          border: 1px solid rgba(147, 112, 219, 0.5);
          color: #b19cd9;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .back-button:hover {
          background: rgba(147, 112, 219, 0.2);
          border-color: #9370db;
          transform: translateX(-3px);
        }

        /* Messages Container */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          z-index: 5;
          position: relative;
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(26, 26, 46, 0.3);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(147, 112, 219, 0.5);
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 112, 219, 0.7);
        }

        .messages-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Messages */
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
        }

        .message-content {
          max-width: 70%;
          min-width: 0;
        }

        .message-bubble {
          padding: 12px 18px;
          border-radius: 20px;
          position: relative;
          backdrop-filter: blur(5px);
          border: 1px solid transparent;
          margin-bottom: 8px;
        }

        .nyx-message .message-bubble {
          background: rgba(147, 112, 219, 0.15);
          border-radius: 20px 20px 20px 5px;
          border-color: rgba(147, 112, 219, 0.3);
        }

        .user-message .message-bubble {
          background: rgba(34, 34, 68, 0.8);
          border-radius: 20px 20px 5px 20px;
          border-color: rgba(106, 106, 106, 0.3);
        }

        .message-text {
          margin: 0 0 8px 0;
          line-height: 1.4;
          word-wrap: break-word;
          color: #e6e6fa;
        }

        .nyx-message .message-text {
          color: #f0e6ff;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.6;
          color: #b19cd9;
        }

        /* Feedback Buttons */
        .feedback-buttons {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .thumb-button {
          background: rgba(26, 26, 46, 0.6);
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 12px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          opacity: 0.6;
        }

        .thumb-button:hover {
          opacity: 1;
          background: rgba(147, 112, 219, 0.2);
          border-color: rgba(147, 112, 219, 0.5);
          transform: scale(1.1);
        }

        .thumb-button.active {
          opacity: 1;
          background: rgba(147, 112, 219, 0.3);
          border-color: #9370db;
          transform: scale(1.05);
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: flex-end;
          margin-bottom: 20px;
          animation: fade-in 0.3s ease-in;
        }

        .typing-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4b0082, #663399);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          margin-right: 10px;
        }

        .typing-bubble {
          background: rgba(147, 112, 219, 0.2);
          border-radius: 18px 18px 18px 5px;
          padding: 12px 16px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(147, 112, 219, 0.3);
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9370db;
          animation: typing-bounce 1.4s ease-in-out infinite both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes typing-bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Input Container */
        .input-container {
          background: rgba(26, 26, 46, 0.9);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(147, 112, 219, 0.2);
          padding: 20px;
          z-index: 10;
          position: relative;
        }

        .input-wrapper {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          background: rgba(22, 33, 62, 0.8);
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 25px;
          padding: 12px 20px;
          color: #e6e6fa;
          font-size: 1rem;
          resize: none;
          max-height: 120px;
          min-height: 50px;
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
        }

        .message-input:focus {
          border-color: #9370db;
          box-shadow: 0 0 20px rgba(147, 112, 219, 0.2);
          background: rgba(22, 33, 62, 0.9);
        }

        .message-input::placeholder {
          color: rgba(230, 230, 250, 0.5);
          font-style: italic;
        }

        .send-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4b0082, #663399);
          border: 2px solid #9370db;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(147, 112, 219, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(75, 0, 130, 0.3);
        }

        .send-icon {
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .chat-header {
            padding: 12px 15px;
          }
          
          .header-content {
            gap: 10px;
          }
          
          .chat-title {
            font-size: 1.2rem;
          }
          
          .back-button {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
          
          .messages-container {
            padding: 15px;
          }
          
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
          
          .input-container {
            padding: 15px;
          }
          
          .message-input {
            font-size: 0.95rem;
          }

          .feedback-buttons {
            gap: 6px;
          }

          .thumb-button {
            padding: 4px 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;