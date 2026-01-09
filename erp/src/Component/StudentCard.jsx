import React from "react";
import { CheckCircle, XCircle, Edit3 } from "lucide-react";

const StudentCard = ({ student, status, onMarkAttendance, onEdit }) => {
  const IconComponent = student.icon;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      {/* Student Info */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg">
          <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-2xl font-bold text-white truncate">{student.name}</h3>
          <p className="text-white/70 text-sm md:text-base font-medium truncate">{student.department} - {student.year}</p>
          <p className="text-white/50 text-xs md:text-sm">ID: {student.studentId || student.rollNo}</p>
        </div>
        
        {/* Edit Button - Visible on hover (desktop) or always (mobile) */}
        <button
          onClick={() => onEdit(student)}
          className="absolute -top-2 -right-2 p-2 bg-white/20 hover:bg-white text-white hover:text-indigo-600 rounded-full transition-all duration-300 md:opacity-0 group-hover:opacity-100 shadow-lg border border-white/30"
          title="Edit Student"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Attendance Buttons */}
      <div className="flex gap-2 md:gap-3">
        <button
          onClick={() => onMarkAttendance(student.id, "present")}
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
            status === "present"
              ? "bg-green-500 text-white shadow-xl shadow-green-500/50"
              : "bg-white/20 text-white hover:bg-green-500/50"
          }`}
        >
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
          Present
        </button>
        <button
          onClick={() => onMarkAttendance(student.id, "absent")}
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
            status === "absent"
              ? "bg-red-500 text-white shadow-xl shadow-red-500/50"
              : "bg-white/20 text-white hover:bg-red-500/50"
          }`}
        >
          <XCircle className="w-4 h-4 md:w-5 md:h-5" />
          Absent
        </button>
      </div>
    </div>
  );
};

export default StudentCard;