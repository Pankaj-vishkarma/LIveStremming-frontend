import { useNavigate } from "react-router-dom";

export default function Cancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
            <div className="w-full max-w-[380px] bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#2a2a2a]">

                <div className="text-red-500 text-3xl mb-3">
                    ❌
                </div>

                <h2 className="text-white text-lg font-semibold mb-2">
                    Payment Cancelled
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                    Your payment was not completed. Try again anytime.
                </p>

                <button
                    onClick={() => navigate("/wallet")}
                    className="w-full py-2 rounded-xl bg-[#e98834] text-black text-sm font-medium"
                >
                    Back to Wallet
                </button>

            </div>
        </div>
    );
}