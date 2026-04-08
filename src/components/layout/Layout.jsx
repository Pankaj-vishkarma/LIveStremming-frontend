import Header from "./Header";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="w-full h-[100dvh] bg-[#0e0f0b] flex justify-center text-white overflow-hidden">

            <div className="w-full max-w-[412px] h-[100dvh] overflow-hidden relative flex flex-col">

                {/* HEADER */}
                <div className="px-4 pt-4">
                    <Header />
                </div>

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto no-scrollbar">

                    {/* PAGE CONTENT */}
                    <Outlet />

                </div>

                {/* BOTTOM NAV */}
                <BottomNav />

            </div>

        </div>
    );
};

export default Layout;