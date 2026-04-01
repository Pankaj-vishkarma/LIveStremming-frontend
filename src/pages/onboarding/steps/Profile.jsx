import { useState } from "react"
import avatar from "../../../assets/avatar.png"
import BottomSheet from "../../../components/ui/BottomSheet"

export default function Profile({ onFinish }) {
    const [showSheet, setShowSheet] = useState(false)

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] min-h-screen px-6 pt-6 pb-6 flex flex-col text-white">

                {/* TOP CONTENT */}
                <div className="space-y-6">

                    {/* HEADING */}
                    <div>
                        <h2 className="text-[26px] font-bold font-museomoderno">
                            <div>Make your first</div>
                            <div className="mt-[10px]">Impression truly count</div>
                        </h2>

                        <p className="text-[14px] text-[#9B7452] mt-2 font-medium font-space-grotesk leading-[14px]">
                            Your First Impression sets the tone for everything follows
                        </p>
                    </div>

                    {/* AVATAR */}
                    <div className="space-y-3 pt-[32px] pb-[32px]">
                        <p className="text-[14px] font-medium font-inter">
                            <span className="text-[#FFFFFF]">Avatar </span>
                            <span className="text-[#9B7452]">(Profile Pic)</span>
                        </p>

                        <div className="flex items-center gap-4">
                            <img
                                src={avatar}
                                className="w-[58px] h-[58px] rounded-full object-cover"
                            />

                            <button
                                onClick={() => setShowSheet(true)}
                                className="bg-[#e98834] px-5 h-[38px] rounded-full text-black text-[13px] font-medium"
                            >
                                Change Image
                            </button>
                        </div>
                    </div>

                    {/* USERNAME */}
                    <div>
                        <label className="text-[14px] font-medium font-inter">
                            <span className="text-[#FFFFFF]">User Name </span>
                            <span className="text-[#97734E]">(Display Name)</span>
                        </label>

                        <input
                            className="w-full mt-2 h-[48px] px-4 rounded-[10px] outline-none text-[14px]
                            bg-gradient-to-r from-[#1a1a1a] to-[#262626]"
                            defaultValue="User-Ninja"
                        />
                    </div>

                </div>

                {/* PUSH SPACE */}
                <div className="flex-1" />

                {/* INFO BOX */}
                <div className="mb-4 flex items-center gap-2 bg-gradient-to-r from-[#ffbf7c33] to-[#00000000] px-4 py-3 rounded-full text-[13px] text-[#d6d6d6] backdrop-blur-sm">
                    <img src="/alert-circle.png" className="w-5 h-5" />
                    <span>
                        Don’t worry you will be able to change these again
                    </span>
                </div>

                {/* BUTTON */}
                <button
                    onClick={onFinish}
                    className="w-full h-[50px] bg-[#e98834] rounded-full text-black text-[14px] font-semibold"
                >
                    Finish
                </button>

                {/* SHEET */}
                {showSheet && (
                    <BottomSheet onClose={() => setShowSheet(false)} />
                )}

            </div>
        </div>
    )
}