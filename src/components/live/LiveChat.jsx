import { useState, useRef, useEffect } from "react";

const LiveChat = ({ messages, onSend }) => {
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        console.log("📤 UI Send:", input);

        onSend(input);
        setInput("");
    };

    return (
        <>
            {/* CHAT CONTAINER */}
            <div className="absolute bottom-[85px] left-2 right-2 z-30 h-[130px] overflow-hidden">

                {/* SCROLL AREA */}
                <div className="h-full overflow-y-auto pr-1 custom-scroll pointer-events-auto">
                    <div className="flex flex-col gap-1 text-xs">

                        {messages.map((msg, i) => {
                            const isOwn = msg?.isOwn;

                            return (
                                <div
                                    key={i}
                                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`
                                            px-3 py-1.5 rounded-2xl max-w-[80%] break-words
                                            ${isOwn
                                                ? "bg-[#ff2d55] text-white"
                                                : "bg-black/60 text-white backdrop-blur"}
                                        `}
                                    >
                                        {!isOwn && (
                                            <span className="block font-semibold text-[10px] opacity-80 mb-[2px]">
                                                {msg.username}
                                            </span>
                                        )}
                                        <span className="text-[12px]">{msg.text}</span>
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={chatEndRef} />
                    </div>
                </div>
            </div>

            {/* INPUT BAR */}
            <div className="absolute bottom-[35px] left-2 right-2 z-50 flex items-center gap-2">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="
                        flex-1
                        bg-black/60 backdrop-blur
                        px-4 py-2
                        rounded-full
                        text-white text-sm
                        outline-none
                        placeholder:text-gray-300
                    "
                />

                <button
                    onClick={handleSend}
                    className="
                        px-4 py-2
                        bg-[#ff2d55]
                        rounded-full
                        text-white text-sm
                        active:scale-95
                        min-w-[60px]
                    "
                >
                    Send
                </button>
            </div>
        </>
    );
};

export default LiveChat;