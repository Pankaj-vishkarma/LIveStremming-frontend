import { useParams } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import { useProfile } from "../../hooks/useProfile";
import { useStreamerProfile } from "../../hooks/useStreamer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (photo) => {
    if (!photo) return "/default.png";
    return photo.startsWith("http")
        ? photo
        : `${BASE_URL}/${photo}`;
};

export default function ViewStreamer() {
    const { username } = useParams();

    const { data: myProfile } = useProfile();

    const {
        isFollowing,
        toggleFollow,
        loading: followLoading
    } = useFollow(username);

    //HOOK USED
    const {
        data: profile,
        isLoading,
        isError
    } = useStreamerProfile(username);

    const isSelf =
        myProfile?.username &&
        profile?.username &&
        myProfile.username === profile.username;

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center items-center text-white text-sm">
                Loading...
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center items-center text-white text-sm">
                Streamer not found
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
            <div className="w-full max-w-[412px] px-4 pt-6 pb-24 space-y-5">

                <div className="flex flex-col items-center gap-3">
                    <img
                        src={getImageUrl(profile.display_photo)}
                        className="w-24 h-24 rounded-full object-cover"
                    />

                    <div className="text-center">
                        <p className="text-white text-[15px] font-semibold">
                            {profile.channel_name}
                        </p>

                        <p className="text-gray-400 text-[11px] mt-1">
                            @{profile.username}
                        </p>
                    </div>

                    <p className="text-gray-400 text-[11px] text-center px-4">
                        {profile.channel_description || "No description"}
                    </p>
                </div>

                {!isSelf && (
                    <div className="flex justify-center">
                        <button
                            onClick={toggleFollow}
                            disabled={followLoading}
                            className={`px-5 py-[6px] rounded-full text-[12px] font-medium transition ${isFollowing
                                    ? "bg-gray-500 text-white"
                                    : "bg-[#e98834] text-black"
                                }`}
                        >
                            {followLoading
                                ? "..."
                                : isFollowing
                                    ? "Following"
                                    : "Follow"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}