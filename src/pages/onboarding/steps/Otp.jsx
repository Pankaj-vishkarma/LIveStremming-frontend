import { useRef, useState, useEffect } from "react"

export default function Otp({ next, prev }) {
    const [otp, setOtp] = useState(["", "", "", ""])
    const inputs = useRef([])

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // move next input
        if (value && index < 3) {
            inputs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus()
        }
    }

    // 🔥 AUTO SUBMIT WHEN OTP COMPLETE
    useEffect(() => {
        const isComplete = otp.every((digit) => digit !== "")

        if (isComplete) {
            setTimeout(() => {
                next()
            }, 300) // slight delay for UX
        }
    }, [otp, next])

    return (
        <div className="w-[412px] mx-auto min-h-screen bg-[#0e0f0b] flex flex-col justify-between">

            {/* TOP SECTION */}
            <section className="flex-1 flex flex-col text-white font-museomoderno">

                {/* HEADER */}
                <div className="h-16 flex items-center px-6">
                    <button onClick={prev} className="flex items-end gap-[9px]">
                        <img src="/arrow-left.svg" className="w-6 h-6" />
                        <h3 className="text-[22px] font-inter font-medium">
                            Get Started
                        </h3>
                    </button>
                </div>

                {/* TITLE */}
                <div className="px-6 pt-6">
                    <h1 className="text-[28px] font-medium">
                        Verification
                    </h1>
                </div>

                {/* TEXT */}
                <div className="px-6 pt-1 font-inter">
                    <p className="text-[14px] font-medium">
                        We sent a verification code to “aishwary@example.com”.
                    </p>
                </div>

                {/* ALERT */}
                <div className="px-6 pt-6">
                    <div className="rounded-full bg-gradient-to-r from-[#ffbf7c33] to-[#99734a00] flex items-center justify-center p-3 gap-2.5">
                        <img src="/alert-circle.png" className="w-6 h-6" />
                        <span className="text-[14px] font-inter">
                            Just in case check your Spam Folder.
                        </span>
                    </div>
                </div>

                {/* OTP BOXES */}
                <div className="px-6 pt-6">
                    <div className="flex gap-2.5 justify-center">

                        {otp.map((digit, index) => (
                            <div
                                key={index}
                                className="w-[83px] h-[80px] bg-[#1a1a1a] border border-[#1a1a1a] rounded-[10px] flex items-center justify-center"
                            >
                                <input
                                    ref={(el) => (inputs.current[index] = el)}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    maxLength={1}
                                    className="w-full text-center bg-transparent outline-none text-[24px] font-semibold text-gray-400"
                                />
                            </div>
                        ))}

                    </div>
                </div>

                {/* RESEND */}
                <div className="px-6 pt-6 flex items-center justify-center gap-2.5 font-inter">
                    <button className="px-4 py-2 bg-[#e9883433] rounded-full text-[#919191] font-semibold text-[14px]">
                        Resend Code
                    </button>
                    <span className="font-semibold text-[14px]">
                        in 00:30
                    </span>
                </div>

            </section>

            {/* FOOTER */}
            <footer className="px-6 pb-6 text-[14px] font-inter text-white">
                <p>
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
    )
}