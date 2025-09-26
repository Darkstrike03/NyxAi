import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
   const navigate = useNavigate();
  const handleExploreClick = () => {
    // This will navigate to chat.js - you can implement routing here
    navigate('/Chat');
  };

  return (
    <div className="home-container">
      {/* Animated background with stars */}
      <div className="night-sky">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
      
      {/* Moon */}
      <div className="moon"></div>
      
      {/* Main content */}
      <div className={`main-content ${mounted ? 'fade-in' : ''}`}>
        <div className="logo-section">
          <h1 className="nyx-title">
            <span className="letter n">N</span>
            <span className="letter y">Y</span>
            <span className="letter x">X</span>
          </h1>
          <p className="subtitle">Goddess of the Night</p>
          <div className="mystical-line"></div>
        </div>
        
        <div className="description">
          <p className="tagline">
            Enter the realm of mysteries and conversations that transcend the ordinary
          </p>
        </div>
        
        <button 
          className="explore-button"
          onClick={handleExploreClick}
        >
          <span className="button-text">Explore Now</span>
          <div className="button-glow"></div>
        </button>
        
        {/* Mystical symbols */}
        <div className="symbols">
          <div className="symbol symbol-1">✦</div>
          <div className="symbol symbol-2">✧</div>
          <div className="symbol symbol-3">⋆</div>
          <div className="symbol symbol-4">✦</div>
        </div>
      </div>
      
      <style jsx>{`
        .home-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f0f 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial', sans-serif;
        }

        /* Night Sky Animation */
        .night-sky {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .stars, .stars2, .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: move-stars 100s linear infinite;
        }

        .stars {
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                          radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                          radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: move-stars 200s linear infinite;
        }

        .stars2 {
          background-image: radial-gradient(1px 1px at 40px 60px, #fff, transparent),
                          radial-gradient(1px 1px at 120px 20px, rgba(255,255,255,0.9), transparent),
                          radial-gradient(1px 1px at 170px 90px, #eee, transparent);
          background-repeat: repeat;
          background-size: 250px 120px;
          animation: move-stars 300s linear infinite;
        }

        .stars3 {
          background-image: radial-gradient(1px 1px at 80px 10px, #fff, transparent),
                          radial-gradient(2px 2px at 180px 50px, rgba(255,255,255,0.7), transparent),
                          radial-gradient(1px 1px at 230px 80px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 300px 150px;
          animation: move-stars 400s linear infinite;
        }

        @keyframes move-stars {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }

        /* Floating Particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(147, 112, 219, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          width: 4px;
          height: 4px;
          animation: float 15s ease-in-out infinite;
        }

        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; width: 3px; height: 3px; }
        .particle-2 { top: 20%; left: 80%; animation-delay: -2s; width: 5px; height: 5px; }
        .particle-3 { top: 60%; left: 20%; animation-delay: -4s; width: 2px; height: 2px; }
        .particle-4 { top: 80%; left: 70%; animation-delay: -6s; width: 4px; height: 4px; }
        .particle-5 { top: 30%; left: 50%; animation-delay: -8s; width: 3px; height: 3px; }
        .particle-6 { top: 70%; left: 90%; animation-delay: -10s; width: 6px; height: 6px; }
        .particle-7 { top: 40%; left: 15%; animation-delay: -12s; width: 2px; height: 2px; }
        .particle-8 { top: 90%; left: 40%; animation-delay: -14s; width: 4px; height: 4px; }
        .particle-9 { top: 15%; left: 60%; animation-delay: -1s; width: 3px; height: 3px; }
        .particle-10 { top: 50%; left: 85%; animation-delay: -3s; width: 5px; height: 5px; }
        .particle-11 { top: 25%; left: 30%; animation-delay: -5s; width: 2px; height: 2px; }
        .particle-12 { top: 75%; left: 10%; animation-delay: -7s; width: 4px; height: 4px; }
        .particle-13 { top: 35%; left: 75%; animation-delay: -9s; width: 3px; height: 3px; }
        .particle-14 { top: 85%; left: 55%; animation-delay: -11s; width: 6px; height: 6px; }
        .particle-15 { top: 5%; left: 45%; animation-delay: -13s; width: 2px; height: 2px; }
        .particle-16 { top: 65%; left: 65%; animation-delay: -15s; width: 4px; height: 4px; }
        .particle-17 { top: 45%; left: 5%; animation-delay: -2.5s; width: 3px; height: 3px; }
        .particle-18 { top: 55%; left: 95%; animation-delay: -4.5s; width: 5px; height: 5px; }
        .particle-19 { top: 95%; left: 25%; animation-delay: -6.5s; width: 2px; height: 2px; }
        .particle-20 { top: 85%; left: 35%; animation-delay: -8.5s; width: 4px; height: 4px; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }

        /* Moon */
        .moon {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle at 30% 30%, #f8f8ff 0%, #e6e6fa 40%, #d8bfd8 100%);
          border-radius: 50%;
          box-shadow: 0 0 50px rgba(248, 248, 255, 0.3);
          animation: glow 4s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 50px rgba(248, 248, 255, 0.3); }
          to { box-shadow: 0 0 80px rgba(248, 248, 255, 0.6); }
        }

        /* Main Content */
        .main-content {
          text-align: center;
          z-index: 10;
          position: relative;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1.5s ease-out;
        }

        .main-content.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .nyx-title {
          font-size: 6rem;
          font-weight: 300;
          margin: 0;
          background: linear-gradient(45deg, #9370db, #e6e6fa, #dda0dd, #b19cd9);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(147, 112, 219, 0.5);
          letter-spacing: 0.5rem;
        }

        .letter {
          display: inline-block;
          animation: letter-glow 2s ease-in-out infinite;
        }

        .letter.n { animation-delay: 0s; }
        .letter.y { animation-delay: 0.5s; }
        .letter.x { animation-delay: 1s; }

        @keyframes letter-glow {
          0%, 100% { transform: translateY(0); text-shadow: 0 0 30px rgba(147, 112, 219, 0.5); }
          50% { transform: translateY(-10px); text-shadow: 0 0 50px rgba(147, 112, 219, 0.8); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .subtitle {
          font-size: 1.2rem;
          color: #b19cd9;
          margin: 10px 0 30px 0;
          font-weight: 300;
          letter-spacing: 0.2rem;
          opacity: 0.9;
        }

        .mystical-line {
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #9370db, transparent);
          margin: 0 auto 40px auto;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.2); }
        }

        .tagline {
          font-size: 1.1rem;
          color: #e6e6fa;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 50px auto;
          opacity: 0.8;
          font-weight: 300;
        }

        .explore-button {
          position: relative;
          background: linear-gradient(45deg, #4b0082, #663399, #7b68ee);
          border: 2px solid #9370db;
          color: white;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: 0.1rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          text-transform: uppercase;
        }

        .explore-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(147, 112, 219, 0.4);
          border-color: #dda0dd;
        }

        .button-text {
          position: relative;
          z-index: 2;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .explore-button:hover .button-glow {
          left: 100%;
        }

        /* Mystical Symbols */
        .symbols {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .symbol {
          position: absolute;
          color: rgba(147, 112, 219, 0.6);
          font-size: 2rem;
          animation: symbol-float 8s ease-in-out infinite;
        }

        .symbol-1 { top: 20%; left: 15%; animation-delay: 0s; }
        .symbol-2 { top: 30%; right: 20%; animation-delay: 2s; }
        .symbol-3 { bottom: 25%; left: 25%; animation-delay: 4s; }
        .symbol-4 { bottom: 35%; right: 30%; animation-delay: 6s; }

        @keyframes symbol-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-15px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
          75% { transform: translateY(-15px) rotate(270deg); opacity: 0.6; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nyx-title {
            font-size: 4rem;
            letter-spacing: 0.3rem;
          }
          
          .tagline {
            font-size: 1rem;
            padding: 0 20px;
          }
          
          .moon {
            width: 80px;
            height: 80px;
            top: 5%;
            right: 5%;
          }
          
          .symbols .symbol {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .nyx-title {
            font-size: 3rem;
            letter-spacing: 0.2rem;
          }
          
          .explore-button {
            padding: 12px 30px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;