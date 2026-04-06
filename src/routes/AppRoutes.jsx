import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "../pages/onboarding/Onboarding";
import Feed from "../pages/main/Feed";
import Messages from "../pages/main/Messages";
import Profile from "../pages/main/Profile";
import Streamers from "../pages/main/Streamers";

import ProtectedRoute from "./ProtectedRoute";
import { useProfile } from "../hooks/useProfile";
import Layout from "../components/layout/Layout";

export default function AppRoutes() {
    const { data, isLoading } = useProfile();

    if (isLoading) return null;

    // profile complete check
    const isProfileComplete =
        data?.username && data.username.trim() !== "";

    return (
        <Routes>

            {/* Splash / Onboarding */}
            <Route
                path="/"
                element={
                    isProfileComplete
                        ? <Navigate to="/feed" replace />
                        : <Onboarding />
                }
            />

            {/* Optional onboarding */}
            <Route path="/onboarding/*" element={<Onboarding />} />

            {/* MAIN APP (ALL UNDER LAYOUT) */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/feed" element={<Feed />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/streamers" element={<Streamers />} />
            </Route>

        </Routes>
    );
}