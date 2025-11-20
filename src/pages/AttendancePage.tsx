import React, { useState, useEffect, useMemo, createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import TinderCard from 'react-tinder-card';
import { Check, X, RotateCcw, ArrowLeft, Users, UserCheck, UserX } from 'lucide-react';

// Define the specific interface for the TinderCard ref
interface TinderCardRef {
  swipe: (dir: 'left' | 'right' | 'up' | 'down') => Promise<void>;
  restoreCard: () => Promise<void>;
}

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
    isDarkMode,
  } = useAttendanceStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Get students safely
  const sectionStudents = useMemo(() => students[selectedSection] || [], [students, selectedSection]);


  // Using the object itself in the dependency array causes refs to regenerate on every render.
  const childRefs = useMemo(
    () =>
      Array(sectionStudents.length)
        .fill(0)
        .map(() => createRef<TinderCardRef>()),
    [sectionStudents.length] 
  );

  useEffect(() => {
    if (!selectedSection) {
      return;
    }
    startAttendanceSession();
  }, [selectedSection, startAttendanceSession]);

  useEffect(() => {
    const allProcessed = processedStudents.length >= sectionStudents.length && sectionStudents.length > 0;
    setIsComplete(allProcessed);
  }, [processedStudents.length, sectionStudents.length]);

  const handleSwipe = (direction: string, studentId: string) => {
    const status = direction === 'right' ? 'present' : 'absent';
    markAttendance(studentId, status);
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      // Check if we've processed all students
      if (newIndex >= sectionStudents.length) {
        setTimeout(() => setIsComplete(true), 300);
      }
      return newIndex;
    });
  };

  
  const handleButtonClick = (status: 'present' | 'absent', cardIndex: number) => {
    // Only process if this is the current top card
    if (cardIndex !== currentIndex) {
      console.log('Ignoring click on non-top card. Current:', currentIndex, 'Clicked:', cardIndex);
      return;
    }
    
    const student = sectionStudents[cardIndex];
    if (!student) {
      console.log('No student found at index:', cardIndex);
      return;
    }
    
    console.log('Processing:', student.name, 'Status:', status, 'Index:', cardIndex);
    
    // Mark attendance
    markAttendance(student.id, status);
    
    // Advance to next card
    const newIndex = currentIndex + 1;
    console.log('Advancing from', currentIndex, 'to', newIndex);
    setCurrentIndex(newIndex);
    
    // Check if we're done
    if (newIndex >= sectionStudents.length) {
      console.log('All', sectionStudents.length, 'students processed!');
      setTimeout(() => {
        setIsComplete(true);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    await submitAttendanceSession();
    navigate('/reports');
  };

  const presentCount = Object.values(currentAttendance).filter(status => status === 'present').length;
  const absentCount = Object.values(currentAttendance).filter(status => status === 'absent').length;
  const remainingCount = sectionStudents.length - processedStudents.length;

  if (!selectedSection) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className={`rounded-2xl shadow-xl p-6 sm:p-10 border ${
          isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'
          }`}>
            <Users className="h-7 w-7 text-blue-500" />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Choose a class first</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please select a section from the sections page before taking attendance.
          </p>
          <button
            onClick={() => navigate('/sections')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go to Sections
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 px-4 py-6">
        <div className={`rounded-2xl shadow-xl p-6 sm:p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Complete!</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>You have marked attendance for all students in {selectedSection}.</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
              <p className="text-2xl font-bold text-blue-600">{sectionStudents.length}</p>
              <p className="text-sm text-blue-600 font-medium">Total</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-green-600 font-medium">Present</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-red-600 font-medium">Absent</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsComplete(false);
                startAttendanceSession();
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-lg transition-colors font-medium ${
                isDarkMode 
                  ? 'border-slate-600 text-gray-300 hover:bg-slate-700 active:bg-slate-600' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <RotateCcw className="h-5 w-5" />
              <span>Review Again</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 active:from-green-800 active:to-blue-800 transition-all transform active:scale-95 font-medium shadow-md"
            >
              <Check className="h-5 w-5" />
              <span>Submit Attendance</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <button
          onClick={() => navigate('/sections')}
          className={`flex items-center gap-2 transition-colors self-start ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Sections</span>
          
        </button>
        <div className="flex flex-col items-start sm:items-end">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedSection} Attendance</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {processedStudents.length} of {sectionStudents.length} processed
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{sectionStudents.length}</p>
        </div>

        <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="h-4 w-4 text-green-600" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
        </div>

        <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <UserX className="h-4 w-4 text-red-600" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
        </div>

        <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-purple-600" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remaining</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{remainingCount}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
        <div className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <span>Progress</span>
          <span>{sectionStudents.length > 0 ? Math.round((processedStudents.length / sectionStudents.length) * 100) : 0}%</span>
        </div>
        <div className={`w-full rounded-full h-2.5 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${sectionStudents.length > 0 ? (processedStudents.length / sectionStudents.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[450px] w-full flex justify-center items-center overflow-hidden py-4">
        <div className="relative w-full max-w-sm h-96">
          {sectionStudents.map((student, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + 3;
            const zIndex = sectionStudents.length - index;
            const depth = index - currentIndex;
            const isTopCard = depth === 0;
            const scale = isTopCard ? 1 : depth === 1 ? 0.98 : 0.96;
            const translateY = depth * 6;
            const rotate = isTopCard ? 0 : depth === 1 ? -2 : 2;
            const opacity = 1;

            if (!isVisible) return null;

            return (
              <div key={student.id} className="absolute inset-0 flex items-center justify-center touch-pan-x">
                <TinderCard
                  ref={childRefs[index]}
                  onSwipe={(dir: string) => handleSwipe(dir, student.id)}
                  preventSwipe={['up', 'down']}
                  swipeRequirementType="position"
                  className="w-full h-full flex items-center justify-center"
                >
                  <div
                    className={`w-full h-full rounded-3xl shadow-2xl border p-6 flex flex-col justify-center items-center transition-all duration-300 select-none cursor-grab active:cursor-grabbing touch-pan-x ${
                      isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
                    }`}
                    style={{
                      zIndex,
                      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity,
                      pointerEvents: isTopCard ? 'auto' : 'none',
                    }}
                  >
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-3xl font-bold text-white tracking-wider">
                      {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</h3>
                  <p className={`mb-8 font-medium px-4 py-1 rounded-full ${isDarkMode ? 'text-gray-300 bg-slate-700' : 'text-gray-500 bg-gray-50'}`}>
                    Roll No: {student.rollNumber}
                  </p>

                  <div 
                    className="flex gap-4 w-full px-4 mt-auto"
                    style={{ 
                      pointerEvents: 'auto',
                      touchAction: 'auto'
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Absent touched for index:', index, 'student:', student.name);
                        handleButtonClick('absent', index);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('Absent clicked for index:', index, 'student:', student.name);
                        handleButtonClick('absent', index);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 rounded-xl font-semibold transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <X className="h-5 w-5" />
                      <span>Absent</span>
                    </button>
                    <button
                      type="button"
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Present touched for index:', index, 'student:', student.name);
                        handleButtonClick('present', index);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('Present clicked for index:', index, 'student:', student.name);
                        handleButtonClick('present', index);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 rounded-xl font-semibold transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Check className="h-5 w-5" />
                      <span>Present</span>
                    </button>
                  </div>
                  </div>
                </TinderCard>
              </div>
            );
          })}

          {currentIndex >= sectionStudents.length && (
            <div className={`absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-dashed ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-center">
                <p className="text-gray-400 text-lg font-medium">No more students</p>
                <p className="text-gray-400 text-sm">Please submit attendance</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className={`border rounded-lg p-4 text-center ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-100'}`}>
        <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          <span className="font-bold">Swipe Right</span> for Present • <span className="font-bold">Swipe Left</span> for Absent
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
