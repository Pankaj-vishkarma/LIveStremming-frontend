import { useEffect, useState } from "react";
import { getGifts } from "../../api/gifts";
import { useSendGift } from "../../hooks/useSendGift";
import { useNavigate } from "react-router-dom";

export default function GiftPanel({ isOpen, onClose, username }) {
    const [gifts, setGifts] = useState([]);
    const [selectedGift, setSelectedGift] = useState(null);
    const { mutate: sendGiftMutation, isPending } = useSendGift();
    const navigate = useNavigate();

    // NEW STATE
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch gifts
    useEffect(() => {
        if (!isOpen) return;

        const fetchGifts = async () => {
            try {
                const res = await getGifts();
                setGifts(res);
            } catch (err) {
                console.error("Gift fetch error:", err);
            }
        };

        fetchGifts();
    }, [isOpen]);

    //  ERROR LISTENER 
    useEffect(() => {
        const handleError = (e) => {
            const { message, code } = e.detail;

            if (code === "INSUFFICIENT_BALANCE") {

                // premium popup
                setErrorMsg(message);

                setTimeout(() => {
                    setErrorMsg("");
                    navigate("/wallet");
                }, 1500);
            }
        };

        window.addEventListener("gift:error", handleError);

        return () => {
            window.removeEventListener("gift:error", handleError);
        };
    }, [navigate]);

    // Send gift
    const handleSend = () => {
        if (!selectedGift) return;

        sendGiftMutation(
            {
                username,
                giftId: selectedGift._id,
                gift: selectedGift,
            },
            {
                onSuccess: () => {
                    window.dispatchEvent(
                        new CustomEvent("gift:local", {
                            detail: selectedGift,
                        })
                    );

                    setSelectedGift(null);
                    onClose();
                },
            }
        );
    };

    return (
        <>
            {/* 🔥 PREMIUM POPUP */}
            {errorMsg && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-[#1a1a1a] border border-red-500 text-white px-4 py-2 rounded-full shadow-lg text-xs flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
                    <span className="text-red-500">●</span>
                    {errorMsg}
                </div>
            )}

            {/* BACKDROP */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            />

            {/* PANEL */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="w-full max-w-[412px] bg-[#0e0f0b] rounded-t-[24px] px-4 pt-3 pb-5 shadow-xl">

                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-1 bg-gray-600 rounded-full" />
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-white text-sm font-semibold">Send Gift</h2>
                        <button onClick={onClose} className="text-gray-400 text-xs">✕</button>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {gifts.map((gift) => (
                            <div
                                key={gift._id}
                                onClick={() => setSelectedGift(gift)}
                                className={`flex flex-col items-center p-2 rounded-[14px] cursor-pointer transition-all
                                ${selectedGift?._id === gift._id
                                        ? "bg-[#e98834] scale-105"
                                        : "bg-[#1a1a1a]"
                                    }`}
                            >
                                <img src={gift.icon} alt={gift.name} className="w-10 h-10 object-contain mb-1" />
                                <p className="text-[10px] text-white">{gift.name}</p>
                                <p className="text-[9px] text-gray-400">{gift.coin_value} coins</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!selectedGift || isPending}
                        className={`w-full py-2 rounded-full text-sm font-medium transition
                        ${selectedGift
                                ? "bg-[#e98834] text-black"
                                : "bg-gray-700 text-gray-400"
                            }`}
                    >
                        {isPending ? "Sending..." : "Send Gift"}
                    </button>
                </div>
            </div>
        </>
    );
}