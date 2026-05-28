import { Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
