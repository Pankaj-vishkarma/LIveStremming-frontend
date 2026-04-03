import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const ProtectedRoute = ({ children }) => {
    const { data, isLoading, isError } = useProfile();

    // 🔥 silent wait (no UI, no flicker)
    if (isLoading) {
        return null;
    }

    // ❌ not logged in
    if (isError || !data) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;