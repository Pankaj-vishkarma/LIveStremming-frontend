import { Routes, Route } from "react-router-dom";
import Onboarding from "../pages/onboarding/Onboarding";
import Feed from "../pages/main/Feed";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>

            {/* ✅ Public routes */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/onboarding/*" element={<Onboarding />} />

            {/* ✅ Protected route */}
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