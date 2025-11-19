import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAttendanceStore } from './store/attendanceStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SectionsPage from './pages/SectionsPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAttendanceStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Public Route wrapper (redirects to sections if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAttendanceStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/sections" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route
            path="/sections"
            element={
              <ProtectedRoute>
                <SectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
