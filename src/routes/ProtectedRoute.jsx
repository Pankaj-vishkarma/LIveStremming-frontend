import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const queryClient = useQueryClient();

    // React Query cache
    const cachedUser = queryClient.getQueryData(["profile"]);

    // Redux state
    const { isAuthChecked } = useSelector((state) => state.auth);

    // wait for auth check
    if (!isAuthChecked) {
        return null;
    }

    
    if (!cachedUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;