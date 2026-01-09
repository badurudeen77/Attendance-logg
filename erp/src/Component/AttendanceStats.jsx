import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, Award, BarChart3 } from "lucide-react";

const AttendanceStats = ({ students, attendance }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate percentages on mount
    students.forEach(student => {
      const targetPercentage = calculateMonthlyPercentage(student.id);
      animatePercentage(student.id, targetPercentage);
    });
  }, [students, attendance]);

  const animatePercentage = (studentId, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedPercentages(prev => ({ ...prev, [studentId]: Math.round(current) }));
    }, 20);
  };

  const calculateMonthlyPercentage = (studentId) => {
    const studentAttendance = attendance[studentId] || {};
    const dates = Object.keys(studentAttendance);
    if (dates.length === 0) return 0;

    const presentDays = dates.filter(date => studentAttendance[date] === 'present').length;
    return Math.round((presentDays / dates.length) * 100);
  };

  const getMonthlyStats = (studentId) => {
    const studentAttendance = attendance[studentId] || {};
    const monthly = {};
    
    Object.keys(studentAttendance).forEach(dateStr => {
      const date = new Date(dateStr);
      const monthKey = date.toISOString().slice(0, 7);
      if (!monthly[monthKey]) monthly[monthKey] = { present: 0, total: 0 };
      monthly[monthKey].total += 1;
      if (studentAttendance[dateStr] === 'present') {
        monthly[monthKey].present += 1;
      }
    });
    return monthly;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'from-green-400 to-emerald-600';
    if (percentage >= 75) return 'from-blue-400 to-cyan-600';
    if (percentage >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-600';
  };

  const getGradeBadge = (percentage) => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Excellent', color: 'bg-green-500' };
    if (percentage >= 75) return { emoji: '⭐', text: 'Good', color: 'bg-blue-500' };
    if (percentage >= 60) return { emoji: '👍', text: 'Average', color: 'bg-yellow-500' };
    return { emoji: '⚠️', text: 'Needs Attention', color: 'bg-red-500' };
  };

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header Section */}
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 mb-6 md:mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg animate-bounce-slow">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-4xl font-black text-white mb-1">Semester Statistics</h2>
              <p className="text-white/80 text-sm md:text-lg">Month-wise attendance breakdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 bg-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 w-full md:w-auto justify-center md:justify-start">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            <span className="text-white font-bold text-base md:text-lg">{students.length} Students</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? (
          students.map((student, index) => {
            const overallPercentage = calculateMonthlyPercentage(student.id);
            const animatedPercent = animatedPercentages[student.id] || 0;
            const monthlyStats = getMonthlyStats(student.id);
            const grade = getGradeBadge(overallPercentage);
            
            return (
              <div
                key={student.id}
                className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 
                           hover:scale-105 hover:bg-white/20 hover:shadow-3xl
                           transition-all duration-500 animate-fadeInUp group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Student Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-3xl md:text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      {student.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                        {student.name}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm font-medium">ID: {student.studentId || student.rollNo}</p>
                    </div>
                  </div>
                  <div className={`${grade.color} px-2 md:px-3 py-1 rounded-full text-white text-[10px] md:text-sm font-bold flex items-center gap-1 animate-pulse shrink-0`}>
                    <span>{grade.emoji}</span>
                    <span className="hidden xs:inline">{grade.text}</span>
                  </div>
                </div>

                {/* Overall Percentage Circle */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="10"
                          fill="none"
                        />
                        {/* Animated progress circle */}
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - animatedPercent / 100)}`}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-black text-white">{animatedPercent}%</p>
                          <p className="text-white/70 text-xs font-medium">Overall</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getGradeColor(overallPercentage)} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${animatedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <h4 className="text-white font-bold text-lg">Monthly Breakdown</h4>
                  </div>
                  {Object.keys(monthlyStats).length > 0 ? (
                    Object.entries(monthlyStats).map(([month, stats], idx) => {
                      const percentage = Math.round((stats.present / stats.total) * 100);
                      return (
                        <div
                          key={month}
                          className="bg-white/10 rounded-xl p-3 border border-white/20 
                                     hover:bg-white/15 hover:border-white/30 hover:scale-102
                                     transition-all duration-300 animate-slideInRight"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold">
                              {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-white font-bold">{percentage}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>Present: {stats.present}</span>
                            <span>Total: {stats.total}</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                            <div
                              className={`h-full bg-gradient-to-r ${getGradeColor(percentage)} rounded-full transition-all duration-1000`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-white/60">
                      <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No attendance data yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <BarChart3 className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white text-xl font-medium">No stats available</p>
            <p className="text-white/60">No students are currently enrolled.</p>
          </div>
        )}
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AttendanceStats;