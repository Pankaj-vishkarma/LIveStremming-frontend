import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useFeed } from "../../hooks/useFeed"
import { useSocket } from "../../hooks/useSocket";
import StreamerCard from "../../components/streamer/StreamerCard";


const tabs = ["For you", "Trending", "Most View", "Nearby"]
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (photo) => {
    if (!photo) return "/default.png";

    return photo.startsWith("http")
        ? photo
        : `${BASE_URL}/${photo}`;
};

export default function Feed() {

    const [activeTab, setActiveTab] = useState("For you")
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedGlobal, setSelectedGlobal] = useState("Global")
    const socket = useSocket();

    // LOCAL LIVE STATE
    const [liveStreamers, setLiveStreamers] = useState([])

    const navigate = useNavigate();

    const dropdownOptions = ["Global", "India", "USA", "UK"]

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useFeed({ activeTab, selectedGlobal })

    // INITIAL LOAD
    useEffect(() => {
        const dynamicFeedData = (data?.pages || []).flatMap((page) => {
            return page?.streamers || [];
        });

        const mapped = dynamicFeedData.map((item) => ({
            image: getImageUrl(item?.display_photo),
            avatar: getImageUrl(item?.display_photo),
            name: item?.channel_name || "Unknown",
            username: item?.username,
            channel_name: item?.channel_name,
            is_live: item?.is_live,
            views: item?.is_live ? "Live" : "0",
            likes: "0",
        }));

        // merge instead of overwrite
        setLiveStreamers((prev) => {
            const live = mapped.filter((item) => item.is_live);

            const merged = [...prev];

            live.forEach((item) => {
                if (!merged.find((m) => m.username === item.username)) {
                    merged.push(item);
                }
            });

            return merged;
        });

    }, [data]);

    // SOCKET LISTENERS
    useEffect(() => {
        if (!socket) return;

        const handleLive = (streamer) => {
            try {
                if (!streamer?.username || !streamer?.channel_name) {
                    console.warn("Invalid streamer data:", streamer);
                    return;
                }

                setLiveStreamers((prev) => {
                    const exists = prev.find((s) => s.username === streamer.username);
                    if (exists) return prev;

                    return [
                        {
                            image: getImageUrl(streamer.display_photo),
                            avatar: getImageUrl(streamer.display_photo),
                            name: streamer.channel_name,
                            username: streamer.username,
                            channel_name: streamer.channel_name,
                            views: "Live",
                            likes: "0",
                            is_live: true,
                        },
                        ...prev,
                    ];
                });
            } catch (err) {
                console.error("LIVE SOCKET ERROR:", err);
            }
        };

        const handleOffline = (username) => {
            try {
                setLiveStreamers((prev) =>
                    prev.filter((s) => s.username !== username)
                );
            } catch (err) {
                console.error("OFFLINE SOCKET ERROR:", err);
            }
        };

        socket.on("streamer:live", handleLive);
        socket.on("streamer:offline", handleOffline);

        return () => {
            socket.off("streamer:live", handleLive);
            socket.off("streamer:offline", handleOffline);
        };
    }, [socket]);

    const loadMoreRef = useRef(null)

    useEffect(() => {
        const currentRef = loadMoreRef.current

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage()
            }
        })

        if (currentRef) observer.observe(currentRef)

        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [hasNextPage, fetchNextPage])

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] h-screen overflow-y-auto no-scrollbar px-3 sm:px-4 pt-4 pb-24 sm:pb-28 space-y-4 sm:space-y-5">

                {/* TABS */}
                <div className="flex justify-center items-center gap-2 overflow-x-auto no-scrollbar pr-2">

                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs whitespace-nowrap transition
                            ${activeTab === tab
                                    ? "bg-[#e98834] text-black"
                                    : "bg-[#1a1a1a] text-white"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {!isLoading && liveStreamers.length === 0 && (
                    <div className="flex justify-center items-center h-[60vh] text-gray-400 text-sm">
                        No users are online right now.
                    </div>
                )}

                {/* GRID */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                    {liveStreamers.map((item, i) => (
                        <StreamerCard key={item.username + i} item={item} />
                    ))}

                </div>

                <div ref={loadMoreRef} className="h-5" />

                {isFetchingNextPage && (
                    <p className="text-center text-xs text-gray-400">Loading more...</p>
                )}

            </div>
        </div>
    )
}