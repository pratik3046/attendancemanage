import React, { useState } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { Calendar, Users, UserCheck, UserX, Edit3, Check, X } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { attendanceSessions, students, updateAttendanceStatus, isDarkMode } = useAttendanceStore();
  const [selectedSession, setSelectedSession] = useState<string>('');

  const session = attendanceSessions.find(s => s.id === selectedSession) || attendanceSessions[attendanceSessions.length - 1];

  const getStudentName = (studentId: string, section: string) => {
    const sectionStudents = students[section] || [];
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getStudentRollNumber = (studentId: string, section: string) => {
    const sectionStudents = students[section] || [];
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.rollNumber : 'N/A';
  };

  const handleStatusUpdate = (studentId: string, currentStatus: string) => {
    if (currentStatus === 'absent' && session) {
      updateAttendanceStatus(session.id, studentId, 'present');
    }
  };

  if (attendanceSessions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
        </div>
        <h2 className={`text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Attendance Records</h2>
        <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Take attendance first to see reports here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile First */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Reports</h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>View and manage attendance records</p>
        </div>

        {attendanceSessions.length > 1 && (
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className={`block w-full sm:w-64 px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Latest Session</option>
            {attendanceSessions.slice().reverse().map((s) => (
              <option key={s.id} value={s.id}>
                {s.section} - {s.date} at {s.time}
              </option>
            ))}
          </select>
        )}
      </div>

      {session && (
        <>
          {/* Session Summary - Mobile First */}
          <div className={`rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border ${
            isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{session.section}</h2>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {session.date} at {session.time}
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{session.presentCount}</p>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-red-600">{session.absentCount}</p>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {Math.round((session.presentCount / session.totalStudents) * 100)}%
                    </p>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Progress */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className={`flex justify-between text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Attendance Overview</span>
                <span>{session.presentCount}/{session.totalStudents} students present</span>
              </div>
              <div className={`w-full rounded-full h-2 sm:h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(session.presentCount / session.totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Student Lists - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Present Students */}
            <div className={`rounded-lg sm:rounded-xl shadow-lg border ${
              isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
            }`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-green-50 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <h3 className="font-semibold text-sm sm:text-base text-green-900">
                    Present Students ({session.presentCount})
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 max-h-[400px] overflow-y-auto">
                {session.records.filter(r => r.status === 'present').length === 0 ? (
                  <p className={`text-center py-4 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No students marked present</p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {session.records
                      .filter(r => r.status === 'present')
                      .map((record) => (
                        <div
                          key={record.studentId}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base text-green-900 truncate">
                              {getStudentName(record.studentId, session.section)}
                            </p>
                            <p className="text-xs sm:text-sm text-green-600">
                              {getStudentRollNumber(record.studentId, session.section)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="text-xs sm:text-sm font-medium text-green-600">Present</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Absent Students */}
            <div className={`rounded-lg sm:rounded-xl shadow-lg border ${
              isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
            }`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-red-50 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  <h3 className="font-semibold text-sm sm:text-base text-red-900">
                    Absent Students ({session.absentCount})
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 max-h-[400px] overflow-y-auto">
                {session.records.filter(r => r.status === 'absent').length === 0 ? (
                  <p className={`text-center py-4 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>All students present!</p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {session.records
                      .filter(r => r.status === 'absent')
                      .map((record) => (
                        <div
                          key={record.studentId}
                          className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2.5 sm:p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base text-red-900 truncate">
                              {getStudentName(record.studentId, session.section)}
                            </p>
                            <p className="text-xs sm:text-sm text-red-600">
                              {getStudentRollNumber(record.studentId, session.section)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between xs:justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(record.studentId, record.status)}
                              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-xs sm:text-sm touch-manipulation"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Mark Present</span>
                            </button>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                              <span className="text-xs sm:text-sm font-medium text-red-600">Absent</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats - Mobile First */}
          <div className={`rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border ${
            isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'
          }`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Session Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className={`text-center p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{session.totalStudents}</p>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</p>
              </div>
              <div className={`text-center p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-green-600">{session.presentCount}</p>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</p>
              </div>
              <div className={`text-center p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
                <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-red-600">{session.absentCount}</p>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</p>
              </div>
              <div className={`text-center p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {Math.round((session.presentCount / session.totalStudents) * 100)}%
                </p>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
