import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">

            <div className="w-full max-w-[412px] bg-[#0e0f0b] border-t border-[#1a1a1a] flex justify-around items-center py-2 sm:py-3 px-2 sm:px-3">

                <div
                    onClick={() => navigate("/feed")}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer gap-[2px]
                    ${location.pathname === "/feed" ? "text-[#e98834]" : "text-gray-400"}`}
                >
                    <img src="/live.png" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    <span>Live</span>
                </div>

                <div
                    onClick={() => navigate("/streamers")}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer gap-[2px]
                    ${location.pathname === "/streamers" ? "text-[#e98834]" : "text-gray-400"}`}
                >
                    <img src="/discover.png" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    <span>Discover</span>
                </div>

                <div
                    onClick={() => navigate("/messages")}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer gap-[2px]
                    ${location.pathname === "/messages" ? "text-[#e98834]" : "text-gray-400"}`}
                >
                    <img src="/chat.png" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    <span>Chat</span>
                </div>

                <div
                    onClick={() => navigate("/profile")}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer gap-[2px]
                    ${location.pathname === "/profile" ? "text-[#e98834]" : "text-gray-400"}`}
                >
                    <img src="/profile.png" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    <span>My Hub</span>
                </div>

            </div>

        </div>
    );
};

export default BottomNav;