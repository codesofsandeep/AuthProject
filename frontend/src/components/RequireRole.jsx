import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ children, role }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <p>Loading...</p>; // wait until silent refresh completes

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.roles.includes(role)) return <Navigate to="/" replace />;

    return children;
}
