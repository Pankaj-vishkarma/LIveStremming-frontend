import Header from "./Header";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="w-full h-[100dvh] bg-[#0e0f0b] flex justify-center text-white overflow-hidden">

            {/* SAME AS FEED ROOT */}
            <div className="w-full max-w-[412px] h-[100dvh] overflow-hidden relative flex flex-col">

                {/* HEADER (FIXED POSITION) */}
                <div className="px-4 pt-4">
                    <Header />
                </div>

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto no-scrollbar">

                    {/* PAGE CONTENT (NO CHANGE) */}
                    <Outlet />

                </div>

                {/* BOTTOM NAV */}
                <BottomNav />

            </div>

        </div>
    );
};

export default Layout;