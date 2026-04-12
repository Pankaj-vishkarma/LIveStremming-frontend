import { useEffect, useState } from "react";

export const useLiveChat = (socket, roomId, user) => {
    const [messages, setMessages] = useState([]);
    const [viewerCount, setViewerCount] = useState(0);

    //  JOIN ROOM
    useEffect(() => {
        if (!socket || !roomId) return;

        if (!socket.connected) {
            socket.on("connect", () => {
                console.log(" Joining room after connect:", roomId);

                socket.emit("join_room", { roomId, user });
            });
        } else {
            console.log(" Joining room:", roomId);
            socket.emit("join_room", { roomId, user });
        }

    }, [socket, roomId]);

    //  LISTEN EVENTS 
    useEffect(() => {
        if (!socket) return;

        console.log(" Attaching socket listeners...");

        const handleMessage = (msg) => {
            console.log(" Message received:", msg);
            setMessages((prev) => [...prev, msg]);
        };

        const handleViewer = (count) => {
            console.log("👥 Viewer count:", count);
            setViewerCount(count);
        };

        socket.on("receive_message", handleMessage);
        socket.on("viewer_count", handleViewer);

        // NO CLEANUP
    }, [socket]);

    //  SEND MESSAGE
    const sendMessage = (text) => {
        if (!text.trim()) return;

        console.log("📤 UI CLICKED SEND");

        if (!socket) {
            console.log("❌ Socket is NULL");
            return;
        }

        if (!socket.connected) {
            console.log("❌ Socket NOT connected");
            return;
        }

        if (!roomId) {
            console.log("❌ RoomId missing");
            return;
        }

        const message = {
            userId: user?.id,
            username: user?.username,
            avatar: user?.avatar,
            text,
        };

        console.log("📤 EMITTING EVENT:", {
            roomId,
            message,
        });

        socket.emit("send_message", {
            roomId,
            message,
        });

        console.log("✅ emit called");
    };

    return {
        messages,
        sendMessage,
        viewerCount,
    };
};