import { useSelector } from "react-redux";

export const useAuth = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    return {
        user,
        isAuthenticated,
        role: user?.role,
        isAdmin: user?.role === "admin",
        isStreamer: user?.role === "streamer",
    };
};