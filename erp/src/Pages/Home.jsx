import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/attendance");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <span>AttendanceLogger</span>
          </div>
          
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full
                       font-semibold transition-all duration-300
                       hover:bg-white hover:text-blue-600
                       hover:scale-105 hover:shadow-xl hover:shadow-white/30
                       border-2 border-white/30 hover:border-white
                       group"
          >
            <span className="text-xl transform group-hover:rotate-12 transition-transform duration-300">👤</span>
            <span>Login</span>
          </Link>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        ></div>
      ))}

      <div className={`text-center max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Title Section with Gradient Text */}
        <div className="mb-16">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 mb-6 drop-shadow-2xl animate-fadeInUp leading-tight">
            Attendance Logger
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8 rounded-full animate-expandWidth"></div>
          <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Track semester attendance percentage month-wise. Built with React,
            Express & MongoDB
          </p>
        </div>

        {/* Feature Cards with Stagger Animation */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          
          <div 
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20
                        transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:bg-white/20
                        hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/50
                        animate-fadeInUp group cursor-pointer"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
              📊
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-blue-200 transition-colors">
              Real-time Tracking
            </h3>
            <ul className="text-blue-50 space-y-3 text-left">
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300">
                <span className="text-blue-300">▸</span> Date picker for easy selection
              </li>
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300" style={{ transitionDelay: '0.1s' }}>
                <span className="text-blue-300">▸</span> Month-wise percentage calculation
              </li>
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300" style={{ transitionDelay: '0.2s' }}>
                <span className="text-blue-300">▸</span> Present/Absent status marking
              </li>
            </ul>
          </div>

          <div 
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20
                        transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:bg-white/20
                        hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/50
                        animate-fadeInUp group cursor-pointer"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
              ⚡
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-purple-200 transition-colors">
              Modern Stack
            </h3>
            <ul className="text-purple-50 space-y-3 text-left">
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300">
                <span className="text-purple-300">▸</span> React + DatePicker frontend
              </li>
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300" style={{ transitionDelay: '0.1s' }}>
                <span className="text-purple-300">▸</span> Express API backend
              </li>
              <li className="flex items-center gap-3 transform group-hover:translate-x-2 transition-all duration-300" style={{ transitionDelay: '0.2s' }}>
                <span className="text-purple-300">▸</span> MongoDB data storage
              </li>
            </ul>
          </div>

        </div>

        {/* Enhanced CTA Button */}
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-3 bg-white text-blue-600 px-14 py-6 rounded-full
                     font-bold text-xl transition-all duration-500
                     hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white
                     hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50
                     shadow-xl animate-fadeInUp relative overflow-hidden group"
          style={{ animationDelay: '0.8s' }}
        >
          <span className="relative z-10">Get Started</span>
          <span className="text-2xl transform group-hover:translate-x-2 transition-transform duration-300 relative z-10">→</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-expandWidth {
          animation: expandWidth 1.5s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;