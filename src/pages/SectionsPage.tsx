import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import { Users, ChevronRight } from 'lucide-react';

const SectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, setSelectedSection, getSectionNames, loadSections } = useAttendanceStore();

  useEffect(() => {
    // Ensure sections are loaded if page is refreshed
    loadSections().catch(() => undefined);
  }, [loadSections]);

  const handleSectionSelect = async (section: string) => {
    await setSelectedSection(section);
    navigate('/attendance');
  };

  const sections = getSectionNames();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Mobile First */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Select Class Section</h1>
        <p className="text-sm sm:text-base text-gray-600">Choose a section to take attendance</p>
      </div>

      {/* Sections Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((section) => {
          const studentCount = (students[section] || []).length;

          return (
            <button
              key={section}
              onClick={() => handleSectionSelect(section)}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300 transform active:scale-[0.98] p-4 sm:p-6 border border-gray-100 touch-manipulation"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all flex-shrink-0">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{section}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">{studentCount} students</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </div>

              <div className="text-left">
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                  <span>Recent Attendance</span>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 sm:h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">Total Sections</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{sections.length}</p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">Total Students</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {Object.values(students).reduce((sum, section) => sum + section.length, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">Avg. Class Size</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {Math.round(Object.values(students).reduce((sum, section) => sum + section.length, 0) / sections.length)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;
