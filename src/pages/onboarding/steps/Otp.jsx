import { useRef, useState, useEffect } from "react";
import { verifyOtpAPI, sendOtpAPI } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";

export default function Otp({ next, prev, data }) {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const queryClient = useQueryClient();

    const inputs = useRef([]);
    const hasSubmitted = useRef(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const email = data?.email ?? "";

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData("text").trim();

        if (!/^\d+$/.test(pastedData)) return;

        const pastedArray = pastedData.slice(0, 4).split("");
        const newOtp = ["", "", "", ""];

        pastedArray.forEach((digit, index) => {
            newOtp[index] = digit;
        });

        setOtp(newOtp);

        const lastIndex = pastedArray.length - 1;
        if (lastIndex >= 0) {
            inputs.current[lastIndex]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const verifyMutation = useMutation({
        mutationFn: verifyOtpAPI,
        onSuccess: async (res) => {
            if (!res?.success) return;

            const isNewUser = res?.data?.isNewUser;

            try {
                if (isNewUser) {
                    queryClient.removeQueries(["profile"]);
                    next(res?.data);
                } else {
                    const user = await getProfile();
                    dispatch(setUser(user));
                    queryClient.setQueryData(["profile"], user);
                    navigate("/feed", { replace: true });
                }
            } catch (error) {
                console.log("PROFILE ERROR:", error);
            }
        },
        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Invalid or expired OTP";

            alert(message);
            setOtp(["", "", "", ""]);
            hasSubmitted.current = false;
            inputs.current[0]?.focus();
        },
    });

    const verifyOtp = () => {
        if (verifyMutation.isPending || hasSubmitted.current) return;

        const otpValue = otp.join("");

        if (otpValue.length !== 4) return;

        if (!email) {
            alert("Email missing. Please restart flow.");
            return;
        }

        hasSubmitted.current = true;

        verifyMutation.mutate({
            email,
            otp: otpValue,
        });
    };

    useEffect(() => {
        const isComplete = otp.every((digit) => digit !== "");

        if (isComplete && !hasSubmitted.current) {
            const timer = setTimeout(() => {
                verifyOtp();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [otp]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const resendMutation = useMutation({
        mutationFn: sendOtpAPI,
        onSuccess: (res) => {
            if (!res?.success) return;

            alert("OTP resent successfully");
            setOtp(["", "", "", ""]);
            hasSubmitted.current = false;
            inputs.current[0]?.focus();
            setTimer(30);
        },
        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                "Failed to resend OTP";

            alert(message);
        },
    });

    const handleResend = () => {
        if (timer > 0 || resendMutation.isPending || !email) return;
        resendMutation.mutate({ email });
    };

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] min-h-screen flex flex-col justify-between">

                <section className="flex-1 flex flex-col text-white font-museomoderno">

                    <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6">
                        <button onClick={prev} className="flex items-end gap-2 sm:gap-[9px]">
                            <img src="/arrow-left.svg" className="w-5 h-5 sm:w-6 sm:h-6" />
                            <h3 className="text-[18px] sm:text-[22px] font-inter font-medium">
                                Get Started
                            </h3>
                        </button>
                    </div>

                    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <h1 className="text-[24px] sm:text-[26px] md:text-[28px] font-medium">
                            Verification
                        </h1>
                    </div>

                    <div className="px-4 sm:px-6 pt-1 font-inter">
                        <p className="text-[13px] sm:text-[14px] font-medium break-words">
                            We sent a verification code to “{email}”.
                        </p>
                    </div>

                    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <div className="rounded-full bg-gradient-to-r from-[#ffbf7c33] to-[#99734a00] flex items-center justify-center p-3 gap-2.5">
                            <img src="/alert-circle.png" className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-[12px] sm:text-[14px] font-museomoderno">
                                Just in case check your Spam Folder.
                            </span>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <div className="flex gap-2 sm:gap-2.5 justify-center">

                            {otp.map((digit, index) => (
                                <div
                                    key={index}
                                    className="flex-1 max-w-[80px] sm:max-w-[83px] h-[65px] sm:h-[80px] bg-[#1a1a1a] border border-[#1a1a1a] rounded-[10px] flex items-center justify-center"
                                >
                                    <input
                                        ref={(el) => (inputs.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        className="w-full text-center bg-transparent outline-none text-[20px] sm:text-[24px] font-semibold text-gray-400"
                                    />
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="px-4 sm:px-6 pt-6 flex items-center justify-center gap-2 font-inter flex-wrap">
                        <button
                            onClick={handleResend}
                            disabled={resendMutation.isPending || timer > 0}
                            className={`px-4 py-2 rounded-full font-semibold text-[13px] sm:text-[14px] 
${timer > 0 || resendMutation.isPending
                                    ? "bg-[#e9883433] text-[#919191] cursor-not-allowed"
                                    : "bg-[#e98834] text-[#04080b] cursor-pointer"
                                }`}
                        >
                            {resendMutation.isPending ? "Sending..." : "Resend Code"}
                        </button>
                        <span className="font-semibold text-[13px] sm:text-[14px]">
                            in 00:{timer.toString().padStart(2, "0")}
                        </span>
                    </div>

                </section>

                <footer className="px-3 sm:px-6 pb-6 text-[12px] sm:text-[14px] font-inter text-white">
                    <p className="leading-relaxed">
                        By logging in you confirm you are above 18 years and accept our{" "}
                        <span className="underline text-[#ffa312]">
                            Privacy Policy
                        </span>{" "}
                        and{" "}
                        <span className="underline text-[#ff9f13]">
                            Term & Condition
                        </span>
                    </p>
                </footer>

            </div>
        </div>
    );
}