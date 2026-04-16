import { useNavigate } from "react-router-dom";
import useFollow from "../../hooks/useFollow";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (photo) => {
    if (!photo) return "/default.png";

    return photo.startsWith("http")
        ? photo
        : `${BASE_URL}/${photo}`;
};

export default function StreamerCard({ item }) {
    const navigate = useNavigate();

    const {
        isFollowing,
        toggleFollow,
        loading
    } = useFollow(item?.channel_name);

    return (
        <div
            onClick={() => {
                if (item.is_live) {
                    navigate(`/live/${item.channel_name}`);
                } else {
                    navigate(`/profile/${item.channel_name}`);
                }
            }}
            className="relative rounded-[18px] overflow-hidden cursor-pointer"
        >
            {/* IMAGE */}
            <img
                src={getImageUrl(item.image)}
                className="w-full aspect-[3/4] object-cover"
            />

            {/* LIVE BADGE */}
            {item.is_live && (
                <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-[9px] px-2 py-[2px] rounded-full">
                        LIVE
                    </span>
                </div>
            )}

            {/* VIEW COUNT */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/30 backdrop-blur-[6px] px-2 py-[3px] rounded-full text-[9px]">
                <img src="/eye.png" className="w-3 h-3" />
                <span className="text-white">{item.views}</span>
            </div>

            {/* BOTTOM OVERLAY */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 bg-gradient-to-t from-black/80 to-transparent">

                <div className="flex items-center justify-between gap-2 bg-[#00000042] px-[7px] py-[7px] rounded-[23px]">

                    {/* USER INFO */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${item.channel_name}`);
                        }}
                    >
                        <img
                            src={getImageUrl(item.avatar)}
                            className="w-5 h-5 rounded-full object-cover"
                        />

                        <div>
                            <p className="text-[11px] text-white font-medium">
                                {item.name}
                            </p>

                            <p className="text-[9px] text-gray-400">
                                {item.likes}
                            </p>
                        </div>
                    </div>

                    {/* FOLLOW BUTTON */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // prevent navigation
                            toggleFollow();
                        }}
                        disabled={loading}
                        className={`text-[9px] px-2 py-[3px] rounded-full transition ${isFollowing
                                ? "bg-gray-500 text-white"
                                : "bg-[#e98834] text-black"
                            }`}
                    >
                        {loading
                            ? "..."
                            : isFollowing
                                ? "Following"
                                : "Follow"}
                    </button>

                </div>
            </div>
        </div>
    );
}