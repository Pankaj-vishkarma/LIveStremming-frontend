import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center items-center text-white">
            <Outlet />
        </div>
    );
};

export default AuthLayout;