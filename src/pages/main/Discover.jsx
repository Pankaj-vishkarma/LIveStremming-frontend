import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useFeed } from "../../hooks/useFeed"

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
                        <div
                            key={item.name + i}
                            onClick={() => {
                                if (item.is_live && item.username) {
                                    navigate(`/live/${item.username}`);
                                }
                            }}
                            className={`relative rounded-[18px] sm:rounded-[22px] overflow-hidden 
                            ${item.is_live ? "cursor-pointer" : "cursor-not-allowed opacity-80"}`}
                        >

                            <img
                                src={item.image}
                                className="w-full aspect-[3/4] object-cover"
                            />

                            <div className="absolute top-2 right-2">
                                {item.is_live ? (
                                    <span className="bg-red-500 text-white text-[9px] px-2 py-[2px] rounded-full">
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="bg-gray-600 text-white text-[9px] px-2 py-[2px] rounded-full">
                                        OFFLINE
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/30 backdrop-blur-[6px] px-2 py-[3px] sm:py-[4px] rounded-full text-[9px] sm:text-[10px]">
                                <img src="/eye.png" className="w-3 h-3" />
                                <span className="text-white">{item.views}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 pb-2 sm:pb-3 pt-6 sm:pt-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent">

                                <div className="flex items-center gap-2 bg-[#00000042] px-[7px] py-[7px] rounded-[23px]">
                                    <img
                                        src={item.avatar}
                                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                                    />

                                    <div className="leading-tight">
                                        <p className="text-[11px] sm:text-[12px] text-white font-medium">
                                            {item.name}
                                        </p>

                                        <p className="text-[9px] sm:text-[10px] text-gray-400">
                                            {item.likes}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
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