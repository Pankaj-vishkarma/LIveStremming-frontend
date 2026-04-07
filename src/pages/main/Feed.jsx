import { useState, useEffect, useRef } from "react"
import girl1 from "../../assets/girl1.png"
import girl2 from "../../assets/girl2.png"
import girl3 from "../../assets/girl3.png"
import girl4 from "../../assets/girl4.png"
import girl5 from "../../assets/girl5.png"
import boy from "../../assets/boy.png"

import { useFeed } from "../../hooks/useFeed"

const tabs = ["For you", "Trending", "Most View", "Nearby"]

const fallbackData = [
    { image: girl1, avatar: "/avatar1.png", name: "Aishwarya", views: "12", likes: "13.25M" },
    { image: girl2, avatar: "/avatar3.png", name: "Sofia", views: "18", likes: "9.8M" },
    { image: girl3, avatar: "/avatar3.png", name: "Nisha", views: "10", likes: "7.2M" },
    { image: girl4, avatar: "/avatar6.png", name: "Elena", views: "22", likes: "15.4M" },
    { image: boy, avatar: "/avatar1.png", name: "Ryan", views: "30", likes: "20.2M" },
    { image: girl5, avatar: "/avatar6.png", name: "Priya", views: "8", likes: "5.1M" }
]

export default function Feed() {

    const [activeTab, setActiveTab] = useState("For you")
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedGlobal, setSelectedGlobal] = useState("Global")

    const dropdownOptions = ["Global", "India", "USA", "UK"]

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useFeed({ activeTab, selectedGlobal })

    const dynamicFeedData = data?.pages?.flatMap((page) =>
        page?.streamers ? page.streamers : []
    )

    const mappedFeed = dynamicFeedData?.map((item) => ({
        image: item?.display_photo || "/default.png",
        avatar: item?.display_photo || "/default.png",
        name: item?.channel_name || "Unknown",
        views: item?.is_live ? "Live" : "0",
        likes: "0"
    })) || []

    const feedList = isLoading
        ? fallbackData
        : mappedFeed?.length
            ? mappedFeed
            : fallbackData

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
                <div className="flex gap-2 overflow-x-auto no-scrollbar pr-2">

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

                    {/* DROPDOWN */}
                    <div className="relative flex-shrink-0">

                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs bg-[#1a1a1a] flex items-center gap-1 whitespace-nowrap"
                        >
                            {selectedGlobal} ▼
                        </button>

                        {showDropdown && (
                            <div className="absolute top-9 right-0 bg-[#1a1a1a] rounded-lg p-2 space-y-1 z-50 w-28 shadow-lg">

                                {dropdownOptions.map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => {
                                            setSelectedGlobal(item)
                                            setShowDropdown(false)
                                        }}
                                        className="px-2 py-1 text-xs hover:bg-[#2a2a2a] rounded cursor-pointer"
                                    >
                                        {item}
                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                    {feedList.map((item, i) => (
                        <div key={item.name + i} className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden">

                            <img
                                src={item.image}
                                className="w-full aspect-[3/4] object-cover"
                            />

                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/30 backdrop-blur-[6px] px-2 py-[3px] sm:py-[4px] rounded-full text-[9px] sm:text-[10px]">
                                <img src="/eye.png" className="w-3 h-3" />
                                <span className="text-white">{item.views}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 pb-2 sm:pb-3 pt-6 sm:pt-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent">

                                <div className="flex items-center gap-2 bg-[#00000042] px-3 py-2 rounded-[23px]">

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