import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import { Home, Users, FileText, History, LogOut, User } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, teacherName, logout } = useAttendanceStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const navItems = [
    { path: '/sections', icon: Home, label: 'Home' },
    { path: '/attendance', icon: Users, label: 'Attendance' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - Mobile First */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center min-w-0">
              <h1 className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                AttendanceTracker
              </h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 text-gray-700">
                <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{teacherName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Mobile First with Horizontal Scroll */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-14 sm:top-16 z-40">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex gap-2 sm:gap-4 md:gap-8 overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                               (item.path === '/sections' && location.pathname === '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 border-b-2 transition-colors whitespace-nowrap touch-manipulation ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 active:border-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content - Mobile First Padding */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
