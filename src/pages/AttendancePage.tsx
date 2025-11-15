import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import TinderCard from 'react-tinder-card';
import { Check, X, RotateCcw, ArrowLeft, Users, UserCheck, UserX } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedSection,
    students,
    currentAttendance,
    processedStudents,
    startAttendanceSession,
    markAttendance,
    submitAttendanceSession,
  } = useAttendanceStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sectionStudents = students[selectedSection] || [];

  useEffect(() => {
    if (!selectedSection) {
      navigate('/sections');
      return;
    }
    startAttendanceSession();
  }, [selectedSection, navigate, startAttendanceSession]);

  useEffect(() => {
    setIsComplete(processedStudents.length >= sectionStudents.length);
  }, [processedStudents.length, sectionStudents.length]);

  const handleSwipe = (direction: string, studentId: string) => {
    const status = direction === 'right' ? 'present' : 'absent';
    markAttendance(studentId, status);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleButtonClick = (studentId: string, status: 'present' | 'absent') => {
    markAttendance(studentId, status);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    await submitAttendanceSession();
    navigate('/reports');
  };

  const presentCount = Object.values(currentAttendance).filter(status => status === 'present').length;
  const absentCount = Object.values(currentAttendance).filter(status => status === 'absent').length;
  const remainingCount = sectionStudents.length - processedStudents.length;

  if (!selectedSection) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Attendance Complete!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">You have marked attendance for all students in {selectedSection}.</p>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{sectionStudents.length}</p>
              <p className="text-xs sm:text-sm text-blue-600">Total</p>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs sm:text-sm text-green-600">Present</p>
            </div>
            <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs sm:text-sm text-red-600">Absent</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsComplete(false);
              }}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base touch-manipulation"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Review Again</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 active:from-green-800 active:to-blue-800 transition-all transform active:scale-[0.98] text-sm sm:text-base touch-manipulation"
            >
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Submit Attendance</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header - Mobile First */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => navigate('/sections')}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 active:text-black transition-colors self-start touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Back to Sections</span>
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{selectedSection} Attendance</h1>
        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm text-gray-600">
            {processedStudents.length} of {sectionStudents.length} students
          </p>
        </div>
      </div>

      {/* Stats - Mobile First Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-blue-600">{sectionStudents.length}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Present</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-600">{presentCount}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <UserX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Absent</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-red-600">{absentCount}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Remaining</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-600">{remainingCount}</p>
        </div>
      </div>

      {/* Progress Bar - Mobile First */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
          <span>Progress</span>
          <span>{Math.round((processedStudents.length / sectionStudents.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${(processedStudents.length / sectionStudents.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Card Stack - Mobile First Responsive */}
      <div className="relative h-[400px] sm:h-96 flex justify-center items-center">
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:w-80 h-[360px] sm:h-80">
          {sectionStudents.map((student, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + 3;
            const zIndex = sectionStudents.length - index;
            const scale = index === currentIndex ? 1 : index === currentIndex + 1 ? 0.95 : 0.9;
            const translateY = (index - currentIndex) * 8;

            if (!isVisible) return null;

            return (
              <TinderCard
                key={student.id}
                onSwipe={(dir) => handleSwipe(dir, student.id)}
                preventSwipe={['up', 'down']}
                className="absolute inset-0"
              >
                <div
                  className="w-full h-full bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-8 flex flex-col justify-center items-center cursor-pointer select-none transition-transform duration-200 touch-manipulation"
                  style={{
                    zIndex,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 text-center px-2">{student.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">Roll No: {student.rollNumber}</p>

                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={() => handleButtonClick(student.id, 'absent')}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors transform active:scale-95 text-sm sm:text-base touch-manipulation"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Absent</span>
                    </button>
                    <button
                      onClick={() => handleButtonClick(student.id, 'present')}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors transform active:scale-95 text-sm sm:text-base touch-manipulation"
                    >
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Present</span>
                    </button>
                  </div>
                </div>
              </TinderCard>
            );
          })}

          {currentIndex >= sectionStudents.length && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-base sm:text-lg">All students processed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions - Mobile First */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-blue-800 text-center text-xs sm:text-sm">
          <strong>Swipe right</strong> for Present or <strong>swipe left</strong> for Absent.
          You can also use the buttons below each card.
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
