import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Restricts a route to the given roles. Unauthenticated users go to /login;
// authenticated users without an allowed role go to /unauthorized.
export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
