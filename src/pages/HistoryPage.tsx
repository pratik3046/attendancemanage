import React, { useState } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { Calendar, User, TrendingUp, Filter, ChevronDown } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { students, getStudentHistory, getAttendancePercentage } = useAttendanceStore();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const sections = Object.keys(students);
  const sectionStudents = selectedSection ? students[selectedSection] || [] : [];
  const studentHistory = selectedStudent && selectedSection ? getStudentHistory(selectedStudent, selectedSection) : [];

  const filteredHistory = studentHistory.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  const monthlyPercentage = selectedStudent && selectedSection
    ? getAttendancePercentage(selectedStudent, selectedSection, selectedMonth, selectedYear)
    : 0;

  const yearlyPercentage = selectedStudent && selectedSection
    ? getAttendancePercentage(selectedStudent, selectedSection, undefined, selectedYear)
    : 0;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const getStudentName = (studentId: string) => {
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile First */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Student Attendance History</h1>
        <p className="text-sm sm:text-base text-gray-600">View individual student attendance records and statistics</p>
      </div>

      {/* Filters - Mobile First */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Section</label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setSelectedStudent('');
                }}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white touch-manipulation"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Student</label>
            <div className="relative">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedSection}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500 touch-manipulation"
              >
                <option value="">Select Student</option>
                {sectionStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Month</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white touch-manipulation"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Year</label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white touch-manipulation"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && selectedSection ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Student Info & Stats - Mobile First */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 md:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{getStudentName(selectedStudent)}</h2>
                  <p className="text-sm sm:text-base text-gray-600">{selectedSection}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Monthly</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{monthlyPercentage}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Yearly</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{yearlyPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Progress Bars - Mobile First */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                  <span>Monthly Attendance ({months[selectedMonth]} {selectedYear})</span>
                  <span>{monthlyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${monthlyPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                  <span>Yearly Attendance ({selectedYear})</span>
                  <span>{yearlyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${yearlyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records - Mobile First */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Attendance Records for {months[selectedMonth]} {selectedYear}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredHistory.length} record(s) found
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-500">No attendance records found for the selected period.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredHistory.map((record, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                        record.status === 'present'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                          record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="min-w-0">
                          <p className={`font-medium text-sm sm:text-base truncate ${
                            record.status === 'present' ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {record.date}
                          </p>
                          <p className={`text-xs sm:text-sm ${
                            record.status === 'present' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
          <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">Select a Student</h3>
          <p className="text-sm sm:text-base text-gray-600">Choose a section and student to view their attendance history.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
