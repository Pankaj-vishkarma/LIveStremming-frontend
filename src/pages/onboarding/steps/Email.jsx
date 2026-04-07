import { useState } from "react";
import { sendOtpAPI } from "@/api/auth";

export default function Email({ next, prev }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //  Email validation (stronger)
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    };

    //  derived state
    const trimmedEmail = email.trim();
    const isValidEmail = validateEmail(trimmedEmail);

    const handleContinue = async () => {
        if (loading) return;

        if (!trimmedEmail) {
            setError("Email is required");
            alert("Email is required");
            return;
        }

        if (!isValidEmail) {
            setError("Please enter a valid email");
            alert("Please enter a valid email");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await sendOtpAPI({ email: trimmedEmail });

            console.log("SEND OTP RESPONSE:", res);

            if (res?.success === false) {
                throw new Error(res?.message || "Failed to send OTP");
            }

            next({ email: trimmedEmail });

        } catch (err) {
            console.error("Send OTP Error:", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong. Please try again.";

            setError(message);
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
            <div className="w-full max-w-[412px] min-h-screen flex flex-col">

                <section className="flex-1 flex flex-col text-white font-inter">

                    <div className="h-16 flex items-center px-6">
                        <div className="flex items-end gap-[9px]">
                            <img
                                src="/arrow-left.svg"
                                className="w-6 h-6 cursor-pointer"
                                onClick={prev}
                            />
                            <h3 className="text-[22px] font-medium">
                                Get Started
                            </h3>
                        </div>
                    </div>

                    <div className="px-6 pt-6 font-museomoderno">
                        <h1 className="text-[28px] font-medium">
                            Starting with Email
                        </h1>
                    </div>

                    <div className="px-6 pt-1">
                        <p className="text-[14px] text-[#907b9b] font-medium">
                            Enter your Email to continue
                        </p>
                    </div>

                    <div className="px-6 pt-6">
                        <div className="w-full rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center py-[14px] px-[15px] gap-2.5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(""); // clear error on typing
                                }}
                                placeholder="youremail@example.com"
                                className="flex-1 bg-transparent outline-none text-[14px] text-gray-400"
                            />

                            {/* FIX: show tick only if valid email */}
                            {isValidEmail && (
                                <img src="/check.svg" className="w-6 h-6" />
                            )}
                        </div>

                        {/* optional error (no UI change impact) */}
                        {error && (
                            <p className="text-red-500 text-xs mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="px-6 pt-6 pb-6">
                        <button
                            onClick={handleContinue}
                            disabled={loading || !isValidEmail}
                            className="w-full h-[50px] bg-[#e98834] rounded-[9999px] flex items-center justify-center"
                        >
                            <span className="text-[14px] font-semibold text-[#04080b]">
                                {loading ? "Sending..." : "Continue"}
                            </span>
                        </button>
                    </div>

                </section>
            </div>
        </div>
    );
}