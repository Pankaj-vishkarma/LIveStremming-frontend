import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

import {
    useMessages,
    useSendMessage,
    useMarkAsRead,
} from "../../hooks/useMessages";

import MessageBubble from "../../components/messages/MessageBubble";
import ChatInput from "../../components/messages/ChatInput";
import { useSocket } from "../../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
//import { useProfile } from "../../hooks/useProfile";
import { useSelector } from "react-redux";

export default function Chat() {
    const { username } = useParams();

    const queryClient = useQueryClient();
    const socket = useSocket();

    const scrollRef = useRef();



    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    console.log("REDUX USER:", user?.id);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useMessages(username);

    const sendMessage = useSendMessage();
    const markAsRead = useMarkAsRead();

    const bottomRef = useRef();

    const messages =
        data?.pages?.flatMap((page) => page.messages) || [];

    console.log("USERNAME:", username);
    console.log("MESSAGES DATA:", data);
    console.log("MESSAGES ARRAY:", messages);

    // MARK AS READ
    useEffect(() => {
        if (username) markAsRead.mutate(username);
    }, [username]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (el.scrollTop === 0 && hasNextPage) {
                const prevHeight = el.scrollHeight;

                fetchNextPage().then(() => {
                    setTimeout(() => {
                        const newHeight = el.scrollHeight;
                        el.scrollTop = newHeight - prevHeight;
                    }, 0);
                });
            }
        };

        el.addEventListener("scroll", handleScroll);

        return () => el.removeEventListener("scroll", handleScroll);
    }, [hasNextPage]);

    useEffect(() => {
        if (!scrollRef.current) return;

        const el = scrollRef.current;

        // First load → bottom scroll
        if (!hasNextPage) {
            bottomRef.current?.scrollIntoView();
        }
    }, [data]);

    // SOCKET LISTEN
    useEffect(() => {
        if (!socket || !userId) return;

        socket.emit("join:user", userId);
    }, [socket, userId]);

    useEffect(() => {
        if (!socket || !username || !userId) return;

        const handleNewMessage = (msg) => {
            console.log("RECEIVED MESSAGE:", msg);

            queryClient.setQueryData(["messages", username], (old) => {
                if (!old) return old;

                const alreadyExists = old.pages?.some((page) =>
                    page.messages.find((m) => m.id === msg.id)
                );

                if (alreadyExists) return old;

                const newMsg = {
                    id: msg.id,
                    content: msg.content,
                    is_me: msg.sender_id === userId,
                    created_at: msg.created_at,
                    read_at: null,
                };

                return {
                    ...old,
                    pages: [
                        {
                            ...old.pages[0],
                            messages: [...old.pages[0].messages, newMsg],
                        },
                        ...old.pages.slice(1),
                    ],
                };
            });
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };

    }, [socket, username, userId]);

    // AUTO SCROLL
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    return (
        <div className="w-full h-screen bg-[#0e0f0b] flex justify-center">
            <div className="w-full max-w-[412px] h-screen relative bg-[#0e0f0b]">

                {/* MESSAGES */}
                <div
                    ref={scrollRef}
                    className="absolute top-0 left-0 right-0 bottom-[120px] overflow-y-auto no-scrollbar px-3 pt-4 space-y-2"
                >

                    {/* LOADING */}
                    {isLoading && (
                        <p className="text-center text-xs text-gray-400">
                            Loading...
                        </p>
                    )}

                    {/* EMPTY */}
                    {!isLoading && messages.length === 0 && (
                        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-400 text-sm">
                            <p>No messages yet</p>
                            <p className="text-[11px] mt-1">Start the conversation 👋</p>
                        </div>
                    )}

                    {/* MESSAGES LIST */}
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    <div ref={bottomRef} />
                </div>

                {/* INPUT */}
                <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[412px] z-[999]">
                    <ChatInput
                        onSend={(text) => {
                            console.log("SENDING MESSAGE:", text);

                            queryClient.setQueryData(["messages", username], (old) => {
                                if (!old) {
                                    return {
                                        pages: [
                                            {
                                                messages: [
                                                    {
                                                        id: Date.now(),
                                                        content: text,
                                                        is_me: true,
                                                        created_at: new Date(),
                                                        read_at: null,
                                                    },
                                                ],
                                            },
                                        ],
                                        pageParams: [],
                                    };
                                }

                                const newMsg = {
                                    id: Date.now(),
                                    content: text,
                                    is_me: true,
                                    created_at: new Date(),
                                    read_at: null,
                                };

                                const updatedFirstPage = {
                                    ...old.pages[0],
                                    messages: [...old.pages[0].messages, newMsg],
                                };

                                return {
                                    ...old,
                                    pages: [updatedFirstPage, ...old.pages.slice(1)],
                                };
                            });

                            sendMessage.mutate({
                                username,
                                content: text,
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}