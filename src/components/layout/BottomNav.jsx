import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[412px] bg-[#0e0f0b] border-t border-[#1a1a1a] flex justify-around py-3 z-50 transform">

            <div
                onClick={() => navigate("/feed")}
                className={`flex flex-col items-center text-xs cursor-pointer ${location.pathname === "/feed" ? "text-[#e98834]" : "text-gray-400"
                    }`}
            >
                <img src="/live.png" className="w-[22px] h-[22px]" />
                <span>Live</span>
            </div>

            <div
                onClick={() => navigate("/streamers")}
                className={`flex flex-col items-center text-xs cursor-pointer ${location.pathname === "/streamers" ? "text-[#e98834]" : "text-gray-400"
                    }`}
            >
                <img src="/discover.png" className="w-[22px] h-[22px]" />
                <span>Discover</span>
            </div>

            <div
                onClick={() => navigate("/messages")}
                className={`flex flex-col items-center text-xs cursor-pointer ${location.pathname === "/messages" ? "text-[#e98834]" : "text-gray-400"
                    }`}
            >
                <img src="/chat.png" className="w-[22px] h-[22px]" />
                <span>Chat</span>
            </div>

            <div
                onClick={() => navigate("/profile")}
                className={`flex flex-col items-center text-xs cursor-pointer ${location.pathname === "/profile" ? "text-[#e98834]" : "text-gray-400"
                    }`}
            >
                <img src="/profile.png" className="w-[22px] h-[22px]" />
                <span>My Hub</span>
            </div>

        </div>
    );
};

export default BottomNav;