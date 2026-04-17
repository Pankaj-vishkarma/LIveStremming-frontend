import { useEffect, useState } from "react";
import { getSocket } from "../socket";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = getSocket();
        setSocket(s);

        return () => {
            // no global off()
        };
    }, []);

    return socket;
};