import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GoLivePanel = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const handleGoLive = () => {
        if (!user?.username) return;
        navigate(`/live/${user.username}`);
    };

    return (
        <div className="w-full px-3 sm:px-4 mt-3">

            <div className="bg-[#1a1a1a] rounded-[18px] p-3 sm:p-4">

                {/* HEADER */}
                <div className="mb-3">
                    <h2 className="text-[13px] sm:text-[14px] text-white font-semibold">
                        Start Live Streaming
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-gray-400">
                        Go live and connect with your audience
                    </p>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleGoLive}
                    className="w-full py-2 rounded-full text-[11px] sm:text-xs font-medium 
          bg-[#e98834] text-black"
                >
                    🔴 Go Live
                </button>

            </div>

        </div>
    );
};

export default GoLivePanel;