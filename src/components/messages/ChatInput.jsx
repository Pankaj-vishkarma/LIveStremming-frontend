import { useState } from "react";

export default function ChatInput({ onSend }) {
    const [text, setText] = useState("");

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
    };

    // Enter key support
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-[#1a1a1a] w-full">

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 min-w-0 bg-[#242424] text-white text-xs px-3 py-2 rounded-lg outline-none"
            />

            <button
                onClick={handleSend}
                className="bg-[#e98834] text-black px-3 py-2 rounded-lg text-xs shrink-0 active:scale-95 transition"
            >
                Send
            </button>

        </div>
    );
}