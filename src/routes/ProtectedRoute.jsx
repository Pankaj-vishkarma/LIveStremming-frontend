import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const ProtectedRoute = ({ children }) => {
    const { data, isLoading, isError } = useProfile();

    // ⏳ show loader
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // ❌ Not logged in (401 case)
    if (isError || !data) {
        return <Navigate to="/" replace />;
    }

    // ✅ Logged in
    return children;
};

export default ProtectedRoute;