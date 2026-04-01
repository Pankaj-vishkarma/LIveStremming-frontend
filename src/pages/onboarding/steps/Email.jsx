import { useState } from "react"

export default function Email({ next, prev }) {
    const [email, setEmail] = useState("")


    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            {/* 🔥 MAIN CONTAINER */}
            <div className="w-full max-w-[412px] min-h-screen flex flex-col">

                {/* CONTENT */}
                <section className="flex-1 flex flex-col text-white font-inter">

                    {/* HEADER */}
                    <div className="h-16 flex items-center px-6">
                        <div className="flex items-end gap-[9px]">
                            <img
                                src="/arrow-left.svg" className="w-6 h-6 cursor-pointer"
                                onClick={prev}
                            />
                            <h3 className="text-[22px] font-medium">
                                Get Started
                            </h3>
                        </div>
                    </div>

                    {/* TITLE */}
                    <div className="px-6 pt-6 font-museomoderno">
                        <h1 className="text-[28px] font-medium">
                            Starting with Email
                        </h1>
                    </div>

                    {/* SUBTEXT */}
                    <div className="px-6 pt-1">
                        <p className="text-[14px] text-[#907b9b] font-medium">
                            Enter your Emial to continue
                        </p>
                    </div>

                    {/* INPUT */}
                    <div className="px-6 pt-6">
                        <div className="w-full rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center py-[14px] px-[15px] gap-2.5">

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="aishwary@example.com"
                                inputMode="email"
                                autoFocus
                                className="flex-1 bg-transparent outline-none text-[14px] text-gray-400 font-inter"
                            />

                            <img src="/check.svg" className="w-6 h-6" />
                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="px-6 pt-6 pb-6">
                        <button
                            onClick={next}
                            className="w-full h-[50px] bg-[#e98834] rounded-[9999px] flex items-center justify-center"
                        >
                            <span className="text-[14px] font-semibold text-[#04080b]">
                                Continue
                            </span>
                        </button>
                    </div>

                </section>


            </div>
        </div>
    )
}