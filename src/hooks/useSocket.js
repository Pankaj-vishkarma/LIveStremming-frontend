import { useEffect, useState } from "react";
import { getSocket } from "../socket";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = getSocket();
        setSocket(s);

        return () => {

            if (s) {
                s.off(); // removes all listeners attached from this component
            }
        };
    }, []);

    return socket;
};