import { useProfile } from "../../hooks/useProfile";
import avatarFallback from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";

import { startLive, endLive } from "../../api/liveApi";

const StreamerProfile = () => {
    const { data, isLoading } = useProfile();
    const navigate = useNavigate();

    const user = data?.data || {};

    const handleGoLive = async () => {
        try {
            await startLive();
            navigate(`/live/${user.username}`);
        } catch (err) {
            console.error("GO LIVE ERROR:", err);
        }
    };

    const handleEndLive = async () => {
        try {
            await endLive();
            alert("Live ended");
        } catch (err) {
            console.error("END LIVE ERROR:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
                <div className="w-full max-w-[412px] px-4 pt-4 text-white">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] px-4 sm:px-5 pt-4 pb-24 space-y-5">

                {/* HEADER */}
                <div className="flex items-center gap-4">

                    <img
                        src={user?.display_photo || avatarFallback}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />

                    <div>
                        <h2 className="text-[16px] sm:text-lg font-semibold text-white">
                            {user?.username || "Streamer"}
                        </h2>

                        <p className="text-[11px] sm:text-xs text-gray-400">
                            Streamer Account
                        </p>
                    </div>

                </div>

                {/* ABOUT */}
                <div className="bg-[#1a1a1a] rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">About</p>
                    <p className="text-sm text-white break-words">
                        {user?.about_me || "No bio added"}
                    </p>
                </div>

                {/* STATS */}
                <div className="flex justify-between text-center">
                    <div>
                        <p className="text-sm font-semibold text-white">120</p>
                        <p className="text-xs text-gray-400">Followers</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">80</p>
                        <p className="text-xs text-gray-400">Following</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">0</p>
                        <p className="text-xs text-gray-400">Coins</p>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 sm:gap-3">

                    <button
                        onClick={handleGoLive}
                        className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-medium"
                    >
                        🔴 Go Live
                    </button>

                    <button
                        onClick={handleEndLive}
                        className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-medium"
                    >
                        End Live
                    </button>

                </div>

            </div>
        </div>
    );
};

export default StreamerProfile;