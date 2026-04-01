import { useState } from "react"
import girl1 from "../../assets/girl1.png"
import girl2 from "../../assets/girl2.png"
import girl3 from "../../assets/girl3.png"
import girl4 from "../../assets/girl4.png"
import girl5 from "../../assets/girl5.png"
import boy from "../../assets/boy.png"
import avatar from "../../assets/avatar.png"

const tabs = ["For you", "Trending", "Most View", "Nearby"]

// 🔥 NEW DATA ARRAY (IMPORTANT)
const feedData = [
    {
        image: girl1,
        avatar: "/avatar1.png",
        name: "Aishwarya",
        views: "12",
        likes: "13.25M"
    },
    {
        image: girl2,
        avatar: "/avatar3.png",
        name: "Sofia",
        views: "18",
        likes: "9.8M"
    },
    {
        image: girl3,
        avatar: "/avatar3.png",
        name: "Nisha",
        views: "10",
        likes: "7.2M"
    },
    {
        image: girl4,
        avatar: "/avatar6.png",
        name: "Elena",
        views: "22",
        likes: "15.4M"
    },
    {
        image: boy,
        avatar: "/avatar1.png",
        name: "Ryan",
        views: "30",
        likes: "20.2M"
    },
    {
        image: girl5,
        avatar: "/avatar6.png",
        name: "Priya",
        views: "8",
        likes: "5.1M"
    }
]

export default function Feed() {

    const [activeTab, setActiveTab] = useState("For you")
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedGlobal, setSelectedGlobal] = useState("Global")

    const dropdownOptions = ["Global", "India", "USA", "UK"]

    return (
        <div className="w-full h-screen bg-[#0e0f0b] flex justify-center text-white overflow-hidden">

            {/* MAIN CONTAINER */}
            <div className="w-full max-w-[412px] h-screen overflow-y-auto no-scrollbar px-4 pt-4 pb-28 space-y-5">

                {/* HEADER */}
                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">
                        <img src={avatar} className="w-10 h-10 rounded-full object-cover" />

                        <div className="leading-tight">
                            <p className="text-[10px] text-gray-400">Welcome</p>
                            <h2 className="font-semibold text-sm text-[#e98834]">User-Ninja</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* COINS */}
                        <div className="flex items-center gap-2 bg-[#2a1b12] px-3 py-1.5 rounded-full">
                            <img src="/coin.png" className="w-4 h-4" />
                            <span className="text-xs text-white">00</span>
                            <div className="bg-[#e98834] w-5 h-5 rounded-full flex items-center justify-center text-black text-xs font-bold">
                                +
                            </div>
                        </div>

                        {/* BELL */}
                        <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                            <img src="/bell.png" className="w-4 h-4" />
                        </div>

                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pr-2">

                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition
                            ${activeTab === tab
                                    ? "bg-[#e98834] text-black"
                                    : "bg-[#1a1a1a] text-white"}`}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* DROPDOWN */}
                    <div className="relative">

                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="px-3 py-1.5 rounded-full text-xs bg-[#1a1a1a] flex items-center gap-1 whitespace-nowrap"
                        >
                            {selectedGlobal} ▼
                        </button>

                        {showDropdown && (
                            <div className="absolute top-9 right-0 bg-[#1a1a1a] rounded-lg p-2 space-y-1 z-50 w-28">

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
                <div className="grid grid-cols-2 gap-4">

                    {feedData.map((item, i) => (
                        <div key={i} className="relative rounded-[22px] overflow-hidden">

                            <img src={item.image} className="w-full h-[220px] object-cover" />

                            {/* VIEW */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/30 backdrop-blur-[6px] px-2 py-[4px] rounded-full text-[10px]">
                                <img src="/eye.png" className="w-3 h-3" />
                                <span className="text-white text-[10px]">{item.views}</span>
                            </div>

                            {/* OVERLAY */}
                            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent">

                                <div className="flex items-center gap-2">

                                    <img
                                        src={item.avatar}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />

                                    <div className="leading-tight">
                                        <p className="text-[12px] text-white font-medium">
                                            {item.name}
                                        </p>

                                        <p className="text-[10px] text-gray-400">
                                            {item.likes}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 w-full max-w-[412px] bg-[#0e0f0b] border-t border-[#1a1a1a] flex justify-around py-3">

                <div className="flex flex-col items-center text-[#e98834] text-xs">
                    <img src="/live.png" className="w-[22px] h-[22px]" />
                    <span>Live</span>
                </div>

                <div className="flex flex-col items-center text-gray-400 text-xs">
                    <img src="/discover.png" className="w-[22px] h-[22px]" />
                    <span>Discover</span>
                </div>

                <div className="flex flex-col items-center text-gray-400 text-xs">
                    <img src="/chat.png" className="w-[22px] h-[22px]" />
                    <span>Chat</span>
                </div>

                <div className="flex flex-col items-center text-gray-400 text-xs">
                    <img src="/profile.png" className="w-[22px] h-[22px]" />
                    <span>My Hub</span>
                </div>

            </div>

        </div>
    )
}