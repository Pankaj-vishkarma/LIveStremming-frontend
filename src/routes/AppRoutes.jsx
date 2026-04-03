import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "../pages/onboarding/Onboarding";
import Feed from "../pages/main/Feed";
import ProtectedRoute from "./ProtectedRoute";
import { useProfile } from "../hooks/useProfile";

export default function AppRoutes() {
    const { data, isLoading } = useProfile();

    if (isLoading) return null;

    // 🔥 NEW CHECK
    const isProfileComplete =
        data?.username && data.username.trim() !== "";

    return (
        <Routes>

            {/* ✅ Public route (fixed) */}
            <Route
                path="/"
                element={
                    isProfileComplete
                        ? <Navigate to="/feed" replace />
                        : <Onboarding />
                }
            />

            {/* ✅ Optional onboarding */}
            <Route path="/onboarding/*" element={<Onboarding />} />

            {/* ✅ Protected */}
            <Route
                path="/feed"
                element={
                    <ProtectedRoute>
                        <Feed />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}