export default function BottomSheet({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center">

            <div className="w-full max-w-[412px] bg-[#1a1a1a] rounded-t-[20px] px-5 pt-5 pb-6 space-y-5">

                <h3 className="text-[16px] font-semibold text-white">
                    Change Image
                </h3>

                <div className="flex gap-4">

                    <button className="flex-1 h-[80px] bg-[#2a2a2a] rounded-xl flex flex-col items-center justify-center gap-2 text-[13px] text-[#B99C74]">
                        <img src="/camera.png" className="w-5 h-5" />
                        Take Selfie
                    </button>

                    <button className="flex-1 h-[80px] bg-[#2a2a2a] rounded-xl flex flex-col items-center justify-center gap-2 text-[13px] text-[#B99C74]">
                        <img src="/gallery.png" className="w-5 h-5" />
                        Upload From Gallery
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="w-full text-center text-[#cfcfcf] text-[14px]"
                >
                    Cancel
                </button>

            </div>
        </div>
    )
}