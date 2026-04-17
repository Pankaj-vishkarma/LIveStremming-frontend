export default function MessageBubble({ message }) {
    return (
        <div
            className={`flex ${message.is_me ? "justify-end" : "justify-start"}`}
        >
            <div className="flex flex-col max-w-[75%]">

                {/* MESSAGE BOX */}
                <div
                    className={`px-3 py-2 rounded-2xl text-[12px] break-words
                    ${message.is_me
                            ? "bg-[#e98834] text-black rounded-br-sm"
                            : "bg-[#1a1a1a] text-white rounded-bl-sm"
                        }`}
                >
                    {message.content}
                </div>

                {/* TIME */}
                <span
                    className={`text-[9px] mt-1 text-gray-400 
                    ${message.is_me ? "text-right" : "text-left"}`}
                >
                    {message.created_at
                        ? new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : ""}
                </span>

            </div>
        </div>
    );
}