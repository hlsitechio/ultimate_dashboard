import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Calendar from '../pages/Calendar';
import Email from '../pages/Email';
import Shopping from '../pages/Shopping';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Notes from '../pages/Notes';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Storage from '../pages/Storage';
import Tasks from '../pages/Tasks';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />

      {/* Private Routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
      <Route path="/email" element={<PrivateRoute><Email /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/shopping" element={<PrivateRoute><Shopping /></PrivateRoute>} />
      <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
      <Route path="/storage" element={<PrivateRoute><Storage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

      {/* Catch all route - redirect to signin */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;