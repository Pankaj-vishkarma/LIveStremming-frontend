import { useState } from "react";
import { sendOtpAPI } from "@/api/auth";

export default function Email({ next, prev }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    };

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

            {/* MAIN WRAPPER */}
            <div className="w-full max-w-[412px] min-h-screen flex flex-col">

                <section className="flex-1 flex flex-col text-white font-inter">

                    {/* HEADER */}
                    <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6">
                        <div className="flex items-end gap-2 sm:gap-[9px]">
                            <img
                                src="/arrow-left.svg"
                                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                                onClick={prev}
                                alt="back"
                            />
                            <h3 className="text-[18px] sm:text-[22px] font-medium">
                                Get Started
                            </h3>
                        </div>
                    </div>

                    {/* TITLE */}
                    <div className="px-4 sm:px-6 pt-4 sm:pt-6 font-museomoderno">
                        <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-medium">
                            Starting with Email
                        </h1>
                    </div>

                    {/* SUBTEXT */}
                    <div className="px-4 sm:px-6 pt-1">
                        <p className="text-[12px] sm:text-[14px] text-[#FFFFFF] font-medium">
                            Enter your Email to continue
                        </p>
                    </div>

                    {/* INPUT */}
                    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <div className="w-full rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center py-3 sm:py-[14px] px-3 sm:px-[15px] gap-2">

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEmail(value);

                                    const trimmed = value.trim();

                                    if (!trimmed) {
                                        setError("");
                                    } else if (!validateEmail(trimmed)) {
                                        setError("Please enter a valid email");
                                    } else {
                                        setError("");
                                    }
                                }}
                                placeholder="youremail@example.com"
                                className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] text-white font-inter placeholder:text-gray-400"
                            />

                            {isValidEmail && (
                                <img
                                    src="/check.svg"
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    alt="valid"
                                />
                            )}
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <div className="px-4 sm:px-6 pt-6 pb-6 mt-auto">
                        <button
                            onClick={handleContinue}
                            disabled={loading || !isValidEmail}
                            className={`w-full h-[45px] sm:h-[50px] rounded-full flex items-center justify-center transition-all duration-200 ${loading || !isValidEmail
                                    ? "bg-[#e98834]/50 cursor-not-allowed"
                                    : "bg-[#e98834] cursor-pointer"
                                }`}
                        >
                            <span className="text-[13px] sm:text-[14px] font-semibold text-[#04080b]">
                                {loading ? "Sending..." : "Continue"}
                            </span>
                        </button>
                    </div>

                </section>
            </div>
        </div>
    );
}