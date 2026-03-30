import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ROLE_PERMISSIONS = {
  admin:   ['dashboard', 'reports', 'users'],
  manager: ['dashboard', 'tasks', 'in-progress', 'completed', 'reports'],
  user:    ['dashboard', 'tasks', 'in-progress', 'completed'],
}

export default function ProtectedRoute({ children, routeKey }) {
  const { isAuthenticated, authLoading, user } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Verifying user...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (routeKey) {
    const role = user?.role?.toLowerCase();
    const allowed = ROLE_PERMISSIONS[role] ?? []
    if (!allowed.includes(routeKey)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-sm">You don't have permission to view this page.</p>
        </div>
      )
    }
}

  return children;
}