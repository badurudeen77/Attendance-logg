import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  Award, 
  ClipboardList, 
  Edit3, 
  BarChart3,
  Home,
  GraduationCap,
  Book,
  Pencil,
  Target,
  Trophy,
  Star,
  Loader2,
  Plus,
  X
} from "lucide-react";
import StudentCard from "../Component/StudentCard";
import AttendanceStats from "../Component/AttendanceStats";
import DatePicker from "../Component/DataPicker";
import { attendanceService, studentService } from "../services/api";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("mark");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", year: "", department: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Mapping for icons (since they aren't stored in DB)
  const iconMap = [GraduationCap, Book, Pencil, Target, Trophy, Star];

  // Auto-hide success popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => setShowSuccessPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/login");
        return;
      }

      // Fetch students
      const response = await studentService.getAllStudents();
      console.log("Students data received:", response);
      
      // Handle both array and object responses
      const studentsData = Array.isArray(response) ? response : (response.data || response.students || []);
      
      const studentsWithIcons = studentsData.map((s, index) => ({
        ...s,
        id: s._id || s.id, // Handle both _id and id
        icon: iconMap[index % iconMap.length],
        avatar: "👨‍🎓" // Default avatar for stats view
      }));
      setStudents(studentsWithIcons);

      // Fetch attendance
      if (viewMode === "mark") {
        // Fetch attendance for selected date only
        const dateStr = selectedDate.toISOString().split("T")[0];
        const attendanceResponse = await attendanceService.getAttendanceByDate(dateStr);
        const dayAttendance = Array.isArray(attendanceResponse) ? attendanceResponse : (attendanceResponse.data || []);
        
        const attendanceMap = {};
        dayAttendance.forEach(record => {
          const rDateStr = new Date(record.date).toISOString().split("T")[0];
          const studentId = record.studentId?._id || record.studentId; // Handle populated studentId
          if (!attendanceMap[studentId]) attendanceMap[studentId] = {};
          attendanceMap[studentId][rDateStr] = record.status.toLowerCase();
        });
        setAttendance(prev => ({ ...prev, ...attendanceMap }));
      } else {
        // Fetch all attendance for the selected month for stats
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        const monthlyResponse = await attendanceService.getAllMonthlyAttendance(month, year);
        const monthlyData = Array.isArray(monthlyResponse) ? monthlyResponse : (monthlyResponse.data || []);
        
        const attendanceMap = {};
        monthlyData.forEach(record => {
          const rDateStr = new Date(record.date).toISOString().split("T")[0];
          const studentId = record.studentId?._id || record.studentId; // Handle populated studentId
          if (!attendanceMap[studentId]) attendanceMap[studentId] = {};
          attendanceMap[studentId][rDateStr] = record.status.toLowerCase();
        });
        setAttendance(attendanceMap);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch students and attendance on component mount and date change
  useEffect(() => {
    fetchData();
  }, [selectedDate, navigate, viewMode]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await studentService.registerStudent(newStudent);
      setIsModalOpen(false);
      setNewStudent({ name: "", year: "", department: "" });
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error adding student:", err);
      const errorMsg = typeof err === 'string' ? err : (err.message || "Failed to add student");
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent({
      id: student.id,
      name: student.name,
      year: student.year,
      department: student.department,
      email: student.email,
      course: student.course
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await studentService.updateStudent(editingStudent.id, editingStudent);
      setIsEditModalOpen(false);
      setEditingStudent(null);
      fetchData(); // Refresh list to show updated details
    } catch (err) {
      console.error("Error updating student:", err);
      const errorMsg = typeof err === 'string' ? err : (err.message || "Failed to update student");
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      
      // Send to backend
      await attendanceService.markAttendance({
        studentId,
        date: dateStr,
        status: status.charAt(0).toUpperCase() + status.slice(1) // "Present" or "Absent"
      });

      // Update local state
      setAttendance((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [dateStr]: status,
        },
      }));

      // Show success popup
      setShowSuccessPopup(true);
    } catch (err) {
      alert(err.message || "Failed to mark attendance");
    }
  };

  const getAttendanceStatus = (studentId) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return attendance[studentId]?.[dateStr] || null;
  };

  const calculateDayStats = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const present = students.filter(s => attendance[s.id]?.[dateStr] === "present").length;
    const absent = students.filter(s => attendance[s.id]?.[dateStr] === "absent").length;
    const total = students.length;
    return { 
      present, 
      absent, 
      total, 
      percentage: total ? ((present / total) * 100).toFixed(1) : 0 
    };
  };

  const stats = calculateDayStats();

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}
        {/* Home Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full
                       font-semibold transition-all duration-300
                       hover:bg-white hover:text-indigo-600
                       hover:scale-105 hover:shadow-xl hover:shadow-white/30
                       border-2 border-white/30 hover:border-white
                       group"
          >
            <Home className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header with Floating Animation */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-3xl px-4 py-4 md:px-8 md:py-6 shadow-2xl border border-white/20 w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
              <ClipboardList className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight">
                Attendance Logger
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-lg font-medium">Track, Manage & Analyze</p>
          </div>
        </div>

        {/* Date Selector Component */}
        <DatePicker 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-3 md:p-4 shadow-xl hover:scale-105 transition-transform duration-300">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2" />
            <p className="text-white/80 text-[10px] md:text-sm font-medium">Total Students</p>
            <p className="text-xl md:text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-3 md:p-4 shadow-xl hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2" />
            <p className="text-white/80 text-[10px] md:text-sm font-medium">Present</p>
            <p className="text-xl md:text-3xl font-bold text-white">{stats.present}</p>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-3 md:p-4 shadow-xl hover:scale-105 transition-transform duration-300">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2" />
            <p className="text-white/80 text-[10px] md:text-sm font-medium">Absent</p>
            <p className="text-xl md:text-3xl font-bold text-white">{stats.absent}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl p-3 md:p-4 shadow-xl hover:scale-105 transition-transform duration-300">
            <Award className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2" />
            <p className="text-white/80 text-[10px] md:text-sm font-medium">Attendance</p>
            <p className="text-xl md:text-3xl font-bold text-white">{stats.percentage}%</p>
          </div>
        </div>

        {/* View Toggle and Add Student */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-8">
          <div className="flex w-full md:w-auto gap-2 md:gap-4">
            <button
              onClick={() => setViewMode("mark")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 transform hover:scale-105 ${
                viewMode === "mark"
                  ? "bg-white text-indigo-600 shadow-2xl scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
              Mark
            </button>
            <button
              onClick={() => setViewMode("stats")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 transform hover:scale-105 ${
                viewMode === "stats"
                  ? "bg-white text-purple-600 shadow-2xl scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
              Stats
            </button>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm md:text-lg bg-green-500 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-green-600"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Student
          </button>
        </div>

        {/* Add Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-indigo-600">Add New Student</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="Enter student name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. 1st Year, 2024"
                    value={newStudent.year}
                    onChange={(e) => setNewStudent({...newStudent, year: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. Computer Science"
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? "Adding..." : "Register Student"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {isEditModalOpen && editingStudent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-indigo-600">Update Student</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="Enter student name"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. 1st Year, 2024"
                    value={editingStudent.year}
                    onChange={(e) => setEditingStudent({...editingStudent, year: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. Computer Science"
                    value={editingStudent.department}
                    onChange={(e) => setEditingStudent({...editingStudent, department: e.target.value})}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? "Updating..." : "Update Details"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Student Cards View */}
        {viewMode === "mark" && (
          students.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  status={getAttendanceStatus(student.id)}
                  onMarkAttendance={markAttendance}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
              <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white text-xl font-medium">No students found</p>
              <p className="text-white/60">Add students to your database to start tracking attendance.</p>
            </div>
          )
        )}

        {/* Stats View Component */}
        {viewMode === "stats" && (
          <AttendanceStats 
            students={students} 
            attendance={attendance} 
          />
        )}
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-md border-2 border-green-500 rounded-2xl px-8 py-4 shadow-2xl flex items-center gap-4">
            <div className="bg-green-500 rounded-full p-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-indigo-900 font-bold text-lg">Success!</p>
              <p className="text-indigo-600/80 font-medium">Today's attendance is recorded</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;