import { Navigate } from "react-router-dom";
import { useAdminProfile } from "../hooks/useAdmin";

export default function AdminProtectedRoute({ children }) {
    const { data, isLoading, isError } = useAdminProfile();

    // Loading UI
    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex items-center justify-center">
                <p className="text-white text-sm">Loading...</p>
            </div>
        );
    }

    // Not logged in or error
    if (isError || !data?.data) {
        return <Navigate to="/admin/login" replace />;
    }

    const admin = data.data;

    // Extra safety: role check
    if (!admin?.role || admin.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    //  Allowed (admin verified)
    return children;
}