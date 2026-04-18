import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

export default function Success() {
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                const params = new URLSearchParams(window.location.search);

                const transaction_id = params.get("transaction_id");
                const amount = params.get("amount");

                if (transaction_id && amount) {
                    await axiosInstance.post("/wallet/confirm-topup", {
                        transaction_id,
                        amount: Number(amount),
                    });
                }
            } catch (err) {
                console.error("Confirm payment failed:", err);
            }
        };

        confirmPayment();

        const timer = setTimeout(() => {
            navigate("/wallet");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
            <div className="w-full max-w-[380px] bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#2a2a2a]">

                <div className="text-green-500 text-3xl mb-3">
                    ✅
                </div>

                <h2 className="text-white text-lg font-semibold mb-2">
                    Payment Successful
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                    Coins will be added to your wallet shortly.
                </p>

                <button
                    onClick={() => navigate("/wallet")}
                    className="w-full py-2 rounded-xl bg-[#e98834] text-black text-sm font-medium"
                >
                    Go to Wallet
                </button>

            </div>
        </div>
    );
}