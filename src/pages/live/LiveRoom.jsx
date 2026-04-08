import {
    LiveKitRoom,
    VideoConference,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLiveToken } from "../../api/liveApi";

export default function LiveRoom() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await getLiveToken(username);
                setToken(res.token);
                setUrl(res.livekit_url);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [username]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex items-center justify-center">
                <p className="text-[11px] text-gray-400">Joining live...</p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex flex-col items-center justify-center gap-3">
                <p className="text-[11px] text-gray-400">Unable to join stream</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-1.5 rounded-full text-[11px] bg-[#1a1a1a] text-white"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            {/* MOBILE CONTAINER (same as Feed) */}
            <div className="w-full max-w-[412px] h-screen relative overflow-hidden">

                {/* LIVE VIDEO */}
                <LiveKitRoom
                    serverUrl={url}
                    token={token}
                    connect={true}
                    video={true}
                    audio={true}
                    className="h-full w-full"
                >
                    <VideoConference />
                </LiveKitRoom>

                {/* 🔴 TOP BAR */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-50">

                    {/* LIVE BADGE */}
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-[6px] px-2 py-[4px] rounded-full text-[10px]">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-white">Live</span>
                    </div>

                    {/* EXIT BUTTON */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-black/30 backdrop-blur-[6px] px-3 py-[4px] rounded-full text-[10px] text-white"
                    >
                        Exit
                    </button>
                </div>

                {/* 👤 STREAMER INFO (BOTTOM SAME STYLE AS FEED) */}
                <div className="absolute bottom-3 left-3 right-3 z-50">

                    <div className="bg-[#00000042] backdrop-blur-[6px] px-[10px] py-[10px] rounded-[23px] flex items-center gap-2">

                        <img
                            src="/avatar1.png"
                            className="w-6 h-6 rounded-full object-cover"
                        />

                        <div className="leading-tight">
                            <p className="text-[12px] text-white font-medium">
                                {username}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                Live Streaming
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}