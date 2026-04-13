import {
    LiveKitRoom,
    VideoConference,
} from "@livekit/components-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    getLiveToken,
    startLive,
    endLive,
} from "../../api/liveApi";
import GiftPanel from "../../components/live/GiftPanel";
import LiveChat from "../../components/live/LiveChat";
import ViewerCount from "../../components/live/ViewerCount";
import { getSocket } from "../../socket";
import { useLiveChat } from "../../hooks/useLiveChat";
import { ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function LiveRoom() {
    const { username } = useParams();
    console.log("LiveRoom params:", username);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [openGift, setOpenGift] = useState(false);
    const [giftAnimation, setGiftAnimation] = useState(null);

    const [token, setToken] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const hasStartedRef = useRef(false);

    // SOCKET INIT
    const socketRef = useRef(null);

    if (!socketRef.current) {
        socketRef.current = getSocket();
    }

    const socket = socketRef.current;


    useEffect(() => {
        if (!socket || !username) return;

        socket.emit("join:room", username);
    }, [socket, username]);

    // LIVE CHAT HOOK
    const {
        messages,
        sendMessage,
        viewerCount,
    } = useLiveChat(socket, username, {
        id: user?._id,
        username: user?.username,
        avatar: user?.avatar,
    });

    function VideoRenderer() {
        const tracks = useTracks([
            { source: Track.Source.Camera, withPlaceholder: true },
        ]);

        if (!tracks || tracks.length === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center text-white">
                    Waiting for streamer...
                </div>
            );
        }

        return (
            <>
                {tracks.map((track, index) => {
                    if (!track?.publication) return null;

                    return (
                        <ParticipantTile
                            key={track.publication.trackSid || index}
                            trackRef={track}
                        />
                    );
                })}
            </>
        );
    }


    //  LIVE INIT 
    useEffect(() => {
        if (!user) return;

        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        let isMounted = true;

        const initLive = async () => {
            try {
                let response;

                const host = user?.role === "streamer";
                if (isMounted) setIsHost(host);

                if (host) {
                    response = await startLive();
                } else {
                    response = await getLiveToken(username);
                }

                if (!response || !response.token) return;

                const liveToken =
                    typeof response.token === "string"
                        ? response.token
                        : response.token?.jwt || response.token?.token;

                if (isMounted) {
                    setToken(liveToken);
                    setUrl(response.livekit_url);
                }

            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initLive();

        return () => {
            isMounted = false;
        };
    }, [username, user]);

    // EXIT
    const handleExit = async () => {
        try {
            if (isHost) await endLive();
        } catch (err) {
            console.error(err);
        } finally {
            navigate(-1);
        }
    };

    // AUTO EXIT WHEN STREAM ENDS
    useEffect(() => {
        if (!socket) return;

        const handleStreamEnd = (channelName) => {
            if (channelName === username) {
                console.log("🚪 Stream ended, exiting room...");

                navigate(-1);
            }
        };

        socket.on("streamer:offline", handleStreamEnd);

        return () => {
            socket.off("streamer:offline", handleStreamEnd);
        };
    }, [socket, username, navigate]);

    useEffect(() => {
        if (!socket) return;

        const handleGift = (data) => {
            setGiftAnimation({ ...data, id: Date.now() });

            // remove after 3 sec
            setTimeout(() => {
                setGiftAnimation(null);
            }, 3000);
        };

        socket.on("gift:received", handleGift);

        return () => {
            socket.off("gift:received", handleGift);
        };
    }, [socket]);

    useEffect(() => {
        const handleLocalGift = (e) => {
            const gift = e.detail;

            setGiftAnimation({
                giftName: gift.name,
                giftIcon: gift.icon,
            });

            setTimeout(() => {
                setGiftAnimation(null);
            }, 3000);
        };

        window.addEventListener("gift:local", handleLocalGift);

        return () => {
            window.removeEventListener("gift:local", handleLocalGift);
        };
    }, []);

    // LOADING
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400 text-sm">Joining live...</p>
            </div>
        );
    }

    // ERROR
    if (!token) {
        return (
            <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center gap-3">
                <p className="text-gray-400 text-sm">Unable to join stream</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black flex justify-center">
            <div className="w-full max-w-[412px] h-screen relative overflow-hidden bg-black">

                {/* LIVE VIDEO */}
                <LiveKitRoom
                    serverUrl={url}
                    token={token}
                    connect={true}
                    video={isHost}
                    audio={isHost}
                    connectOptions={{ autoSubscribe: true }}
                    className="absolute inset-0 w-full h-full z-0"
                >
                    <VideoRenderer />
                </LiveKitRoom>

                {/* TOP BAR */}
                <div className="absolute top-3 left-3 right-3 flex justify-between z-50">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-white">
                            {isHost ? "You are Live" : "Live"}
                        </span>

                        <ViewerCount count={viewerCount} />
                    </div>

                    <button
                        onClick={handleExit}
                        className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-white text-xs"
                    >
                        Exit
                    </button>
                </div>

                {/* CHAT */}
                <LiveChat
                    messages={messages}
                    onSend={sendMessage}
                />

                {/* STREAM INFO */}
                <div className="absolute bottom-[80px] right-3 z-50">
                    <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2">
                        <img
                            src="/avatar1.png"
                            className="w-7 h-7 rounded-full"
                        />
                        <span className="text-white text-sm">{username}</span>
                    </div>
                </div>

                {/* GIFT BUTTON */}
                <div className="absolute bottom-[80px] left-3 z-50">
                    <button
                        onClick={() => setOpenGift(true)}
                        className="bg-[#1a1a1a] backdrop-blur px-3 py-2 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition"
                    >
                        <span className="text-white text-sm">🎁</span>
                    </button>
                </div>

                {/*GIFT PANEL*/}
                <GiftPanel
                    isOpen={openGift}
                    onClose={() => setOpenGift(false)}
                    username={username}
                />

                {/* GIFT ANIMATION */}
                {giftAnimation && (
                    <div
                        key={giftAnimation.id}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[70]"
                    >
                        <div className="flex flex-col items-center animate-bounce">

                            <img
                                src={giftAnimation.giftIcon}
                                alt="gift"
                                className="w-20 h-20 object-contain animate-[spin_2s_linear_infinite]"
                            />

                            <p className="text-white text-sm mt-2 bg-black/60 px-3 py-1 rounded-full">
                                🎁 {giftAnimation.giftName}
                            </p>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}