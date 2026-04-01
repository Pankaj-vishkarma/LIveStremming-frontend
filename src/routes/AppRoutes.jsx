import { Routes, Route } from "react-router-dom"
import Onboarding from "../pages/onboarding/Onboarding"
import Feed from "../pages/main/Feed"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/feed" element={<Feed />} />
        </Routes>
    )
}