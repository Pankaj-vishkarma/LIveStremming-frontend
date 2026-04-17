import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (photo) => {
    console.log("PHOTO INPUT:", photo);

    if (!photo) return "/default.png";

    const finalUrl = photo.startsWith("http")
        ? photo
        : `${BASE_URL}/${photo}`;

    console.log("FINAL IMAGE URL:", finalUrl);

    return finalUrl;
};

export default function ConversationList({ conversations = [] }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-2">
            {conversations.map((chat) => (
                <div

                    key={chat.conversation_id}
                    onClick={() => navigate(`/chat/${chat.other_user.username}`)}
                    className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a1a] cursor-pointer active:scale-[0.98] transition"
                >
                    <img
                        src={getImageUrl(chat.other_user.display_photo)}
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                            <p className="text-xs text-white truncate">
                                {chat.other_user.username}
                            </p>

                            <span className="text-[10px] text-gray-400">
                                {chat.last_message_at
                                    ? new Date(chat.last_message_at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </span>
                        </div>

                        <div className="flex justify-between mt-1">
                            <p className="text-[11px] text-gray-400 truncate">
                                {chat.last_message}
                            </p>

                            {chat.unread_count > 0 && (
                                <span className="bg-[#e98834] text-black text-[10px] px-2 py-[2px] rounded-full">
                                    {chat.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}