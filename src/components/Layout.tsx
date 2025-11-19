import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAttendanceStore } from '../store/attendanceStore';
import { Home, Users, FileText, History, LogOut, User, Menu, X, Sun, Moon } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, teacherName, logout, isDarkMode, toggleDarkMode } = useAttendanceStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const handleLogout = () => {
    setIsMobileNavOpen(false);
    logout();
    window.location.href = '/';
  };

  const handleMobileNavClick = () => {
    setIsMobileNavOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <Outlet />
      </div>
    );
  }

  const navItems = [
    { path: '/sections', icon: Home, label: 'Home' },
    { path: '/attendance', icon: Users, label: 'Attendance' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/history', icon: History, label: 'History' },
  ];

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return currentDateTime.toLocaleDateString('en-US', options);
  };

  const getActiveIndex = () => {
    const index = navItems.findIndex(item => 
      location.pathname === item.path || (item.path === '/sections' && location.pathname === '/')
    );
    return index >= 0 ? index : 0;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>

      {/* Unified Header with Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/98 shadow-2xl shadow-black/40' 
          : 'bg-gray-50/98 shadow-lg'
      } backdrop-blur-xl`}>
        <div className="w-full max-w-7xl mx-auto">
          {/* Top Bar - Logo and User Info */}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            {/* Logo */}
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                AttendanceTracker
              </h1>
              <p className={`hidden sm:block text-xs truncate ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {formatDateTime()}
              </p>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className={`flex items-center justify-center rounded-xl p-2 sm:hidden ${
                  isDarkMode 
                    ? 'text-white hover:bg-slate-800 active:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
                aria-label="Toggle navigation menu"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-5 h-5">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isMobileNavOpen ? 0 : 1,
                      rotate: isMobileNavOpen ? 90 : 0,
                      scale: isMobileNavOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isMobileNavOpen ? 1 : 0,
                      rotate: isMobileNavOpen ? 0 : -90,
                      scale: isMobileNavOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.button>
              <motion.button
                onClick={toggleDarkMode}
                className={`hidden sm:flex items-center justify-center rounded-xl p-2.5 ${
                  isDarkMode 
                    ? 'text-amber-400 hover:bg-slate-800 active:bg-slate-700' 
                    : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
                aria-label="Toggle dark mode"
                whileTap={{ scale: 0.9, rotate: 15 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                isDarkMode 
                  ? 'text-white bg-slate-800/80' 
                  : 'text-gray-700 bg-white/80'
              }`}>
                <div className={`rounded-full p-1.5 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <User className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium text-sm truncate max-w-[140px]">{teacherName || 'Teacher'}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${
                  isDarkMode 
                    ? 'text-red-400 hover:bg-red-500/20 active:bg-red-500/30' 
                    : 'text-red-600 hover:bg-red-50 active:bg-red-100'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Pills - Desktop */}
          <nav className="hidden sm:flex justify-center px-4 sm:px-6 lg:px-8 pb-3">
            <div className={`relative flex gap-2 p-1.5 rounded-2xl w-fit ${
              isDarkMode 
                ? 'bg-slate-800/60' 
                : 'bg-white/60'
            }`}>
              {/* Sliding Pill Background */}
              <div 
                className={`absolute top-1.5 bottom-1.5 rounded-xl transition-all duration-300 ease-out ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20'
                }`}
                style={{
                  left: `${getActiveIndex() * 25 + 1.5}%`,
                  width: 'calc(25% - 0.375rem)',
                }}
              />
              
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                                 (item.path === '/sections' && location.pathname === '/');

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  >
                    <motion.div
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm ${
                        isActive
                          ? 'text-white'
                          : isDarkMode
                            ? 'text-gray-100 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 sm:hidden ${
              isDarkMode 
                ? 'bg-slate-950' 
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}
          >
            <div className="h-full overflow-y-auto">
              {/* Close Button */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex justify-end p-4"
              >
                <motion.button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-center rounded-xl p-2 ${
                    isDarkMode 
                      ? 'text-white hover:bg-slate-800 active:bg-slate-700' 
                      : 'text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                  aria-label="Close navigation menu"
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>
            
              <div className="grid gap-3 px-4 pb-4 pb-safe">
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className={`flex flex-col items-center text-center gap-3 rounded-2xl border px-6 py-4 ${
                    isDarkMode 
                      ? 'border-slate-600 bg-slate-800/95 shadow-xl shadow-black/30' 
                      : 'border-gray-100 bg-white/90 shadow-sm'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg"
                  >
                    {teacherName ? teacherName.charAt(0).toUpperCase() : 'T'}
                  </motion.div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Logged in as</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{teacherName || 'Teacher'}</p>
                  </div>
                  <div className={`w-full pt-2 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>{formatDateTime()}</p>
                  </div>
                  <motion.button
                    onClick={() => {
                      toggleDarkMode();
                      handleMobileNavClick();
                    }}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                      isDarkMode 
                        ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:shadow-lg hover:text-amber-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </motion.button>
                </motion.div>
              
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === '/sections' && location.pathname === '/');

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        to={item.path}
                        onClick={handleMobileNavClick}
                      >
                        <motion.div
                          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-5 text-lg font-semibold ${
                            isActive
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/20'
                                : 'border-blue-200 bg-blue-50 text-blue-600 shadow-sm'
                              : isDarkMode
                                ? 'border-slate-600 bg-slate-800/95 text-white hover:border-slate-500 hover:bg-slate-700 hover:shadow-lg shadow-black/20'
                                : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <motion.div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                              isActive
                                ? isDarkMode 
                                  ? 'bg-blue-500/30 text-blue-200' 
                                  : 'bg-blue-100 text-blue-600'
                                : isDarkMode 
                                  ? 'bg-slate-700 text-gray-100' 
                                  : 'bg-gray-50 text-gray-500'
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="h-6 w-6" />
                          </motion.div>
                          <span>{item.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className={`mt-2 flex items-center justify-center gap-3 rounded-xl border px-6 py-5 text-lg font-semibold ${
                    isDarkMode 
                      ? 'border-red-800/50 bg-red-500/20 text-red-200 hover:border-red-700 hover:bg-red-500/30 active:bg-red-500/40 hover:shadow-lg shadow-black/20' 
                      : 'border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100 active:bg-red-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <LogOut className="h-6 w-6" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Mobile First Padding */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
