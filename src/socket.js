import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export const getSocket = () => {
    if (!socket) {
        console.log(" Creating GLOBAL socket...");

        socket = io(SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true,
            reconnection: true, // auto reconnect
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("Global socket connected:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log(" Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error(" Socket connection error:", err.message);
        });
    }

    return socket;
};