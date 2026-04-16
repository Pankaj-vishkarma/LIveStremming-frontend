import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useFeed } from "../../hooks/useFeed"
import StreamerCard from "../../components/streamer/StreamerCard";

const tabs = ["For you", "Trending", "Most View", "Nearby"]
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Feed() {

    const [activeTab, setActiveTab] = useState("For you")
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedGlobal, setSelectedGlobal] = useState("Global")

    // search state
    const [searchTerm, setSearchTerm] = useState("")

    const navigate = useNavigate();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useFeed({ activeTab, selectedGlobal })

    const dynamicFeedData = (data?.pages || []).flatMap((page) => {
        return page?.streamers || [];
    });

    const mappedFeed = (dynamicFeedData || []).map((item) => {
        const validImage =
            item?.display_photo &&
            !item.display_photo.startsWith("blob:");

        const imageUrl = validImage
            ? item.display_photo.startsWith("http")
                ? item.display_photo
                : `${BASE_URL}/${item.display_photo}`
            : "/default.png";

        return {
            image: imageUrl,
            avatar: imageUrl,
            name: item?.channel_name || "Unknown",
            username: item?.username,
            channel_name: item?.channel_name,
            is_live: item?.is_live,
            views: item?.is_live ? "Live" : "0",
            likes: "0",
        };
    });

    // SEARCH FILTER
    const filteredFeed = mappedFeed.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const feedList = filteredFeed;

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

                {/* SEARCH BAR */}
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Search streamer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white text-sm px-4 py-2 rounded-full outline-none placeholder-gray-400"
                    />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                    {feedList.map((item, i) => (
                        <StreamerCard key={item.username + i} item={item} />
                    ))}
                </div>

                {/* LOAD MORE */}
                <div ref={loadMoreRef} className="h-5" />

                {isFetchingNextPage && (
                    <p className="text-center text-xs text-gray-400">Loading more...</p>
                )}

                {!hasNextPage && !isLoading && (
                    <p className="text-center text-xs text-gray-500">No more data</p>
                )}

            </div>
        </div>
    )
}