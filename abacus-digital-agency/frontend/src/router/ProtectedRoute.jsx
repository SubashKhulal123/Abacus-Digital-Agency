import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';

/**
 * Wraps admin-only route subtrees. Renders a lightweight loading state
 * while the session check is in flight, then either renders the nested
 * routes (<Outlet />) or redirects to /admin/login, preserving the
 * originally requested path so the login flow can redirect back.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
