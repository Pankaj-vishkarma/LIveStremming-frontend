import { useConversations } from "../../hooks/useMessages";
import ConversationList from "../../components/messages/ConversationList";

export default function Messages() {
    const { data, isLoading } = useConversations();

    const conversations = data || [];

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
            <div className="w-full max-w-[412px] h-screen overflow-y-auto no-scrollbar px-3 sm:px-4 pt-4 pb-24 sm:pb-28 space-y-4">

                {/* HEADER */}
                <div className="text-white text-sm font-medium px-1">
                    Messages
                </div>

                {/* LOADING */}
                {isLoading && (
                    <p className="text-center text-xs text-gray-400">
                        Loading...
                    </p>
                )}

                {/* EMPTY STATE */}
                {!isLoading && conversations.length === 0 && (
                    <div className="flex justify-center items-center h-[60vh] text-gray-400 text-sm">
                        No conversations yet.
                    </div>
                )}

                {/* CHAT LIST */}
                {!isLoading && conversations.length > 0 && (
                    <ConversationList conversations={conversations} />
                )}

            </div>
        </div>
    );
}