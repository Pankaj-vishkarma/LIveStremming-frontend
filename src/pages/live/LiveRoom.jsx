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

export default function LiveRoom() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [token, setToken] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const hasStartedRef = useRef(false);

    // CHAT STATE (DUMMY)
    const [messages, setMessages] = useState([
        { id: 1, user: "rahul", text: "🔥 Nice stream!" },
        { id: 2, user: "aman", text: "Camera clear hai 👌" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // auto scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                user: user?.data?.username || "me",
                text: input,
            },
        ]);

        setInput("");
    };

    useEffect(() => {
        if (!user) return;

        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        let isMounted = true;

        const initLive = async () => {
            try {
                let response;

                // SAME LOGIC (UNCHANGED)
                const host = user?.data?.role === "streamer";
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
            <div className="w-full max-w-[412px] h-screen relative overflow-hidden">

                {/* 🎥 LIVE VIDEO */}
                <LiveKitRoom
                    serverUrl={url}
                    token={token}
                    connect={true}
                    video={isHost}
                    audio={isHost}
                    className="h-full w-full"
                >
                    <VideoConference />
                </LiveKitRoom>

                {/* TOP BAR */}
                <div className="absolute top-3 left-3 right-3 flex justify-between z-50">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-white">
                            {isHost ? "You are Live" : "Live"}
                        </span>
                    </div>

                    <button
                        onClick={handleExit}
                        className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-white text-xs"
                    >
                        Exit
                    </button>
                </div>

                {/* CHAT */}
                <div className="absolute bottom-24 left-3 right-3 z-50 max-h-[35%] overflow-y-auto">
                    <div className="space-y-1 text-xs">
                        {messages.map((msg) => (
                            <div key={msg.id} className="text-white">
                                <span className="font-semibold mr-1">
                                    {msg.user}:
                                </span>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* INPUT */}
                <div className="absolute bottom-3 left-3 right-3 z-50 flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-black/40 backdrop-blur px-3 py-2 rounded-full text-white text-sm outline-none"
                    />

                    <button
                        onClick={handleSend}
                        className="px-4 bg-[#ff2d55] rounded-full text-white text-sm"
                    >
                        Send
                    </button>
                </div>

                {/* STREAM INFO */}
                <div className="absolute bottom-16 left-3 z-50">
                    <div className="bg-black/40 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2">
                        <img
                            src="/avatar1.png"
                            className="w-7 h-7 rounded-full"
                        />
                        <span className="text-white text-sm">{username}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}