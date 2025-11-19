import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import { Mail, Lock, BookOpen } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('teacher@school.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAttendanceStore((state) => state.login);
  const loadSections = useAttendanceStore((state) => state.loadSections);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) {
      try {
        await loadSections();
      } catch {}
      window.location.href = '/sections';
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center px-3 sm:px-4 py-6 page-transition">
      <div className="w-full max-w-md">
        {/* Logo Section - Mobile First */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 sm:mb-2">AttendanceTracker</h1>
          <p className="text-sm sm:text-base text-blue-100 px-4">Smart attendance management for educators</p>
        </div>

        {/* Login Form - Mobile First */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 text-center">Teacher Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all touch-manipulation"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all touch-manipulation"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98] touch-manipulation"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800">
              Sign in with your registered email and password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
