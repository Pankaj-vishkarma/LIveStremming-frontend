import { useEffect, useState } from "react";

const ViewerCount = ({ count }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (count !== undefined) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 300);
        }
    }, [count]);

    console.log("👥 ViewerCount UI:", count);

    return (
        <div
            className={`
                flex items-center gap-1 px-2 py-0.5 rounded-full 
                bg-black/50 backdrop-blur text-white text-xs
                transition-transform duration-200
                ${animate ? "scale-110" : "scale-100"}
            `}
        >
            <span>👥</span>
            <span>{count}</span>
        </div>
    );
};

export default ViewerCount;