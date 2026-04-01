import hero from "../../../assets/hero.png"

export default function Welcome({ next }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 flex justify-center">
                <img
                    src={hero}
                    className="w-full max-w-[412px] h-full object-cover"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* 🔥 MAIN CONTAINER (MATCH WIDTH) */}
            <div className="relative max-w-[412px] w-full mx-auto min-h-screen flex flex-col justify-end px-6 pb-8 gap-6 text-[9px] text-[#815f42] font-inter">

                {/* TEXT */}
                <div className="flex flex-col text-white font-museomoderno">
                    <h2 className="text-[32px] font-medium">
                        Where world
                    </h2>

                    <h1 className="text-[54px] font-medium -mt-[14px]">
                        feels{" "}
                        <span className="text-[#e98834]">
                            Alive
                        </span>
                    </h1>
                </div>

                {/* BUTTON ROW */}
                <div className="flex items-center gap-2.5">

                    <button
                        onClick={next}
                        className="flex-1 h-[50px] bg-[#e98834] rounded-full flex items-center justify-between px-4 gap-5"
                    >
                        <span className="text-black font-bold text-[16px]">
                            Get Started
                        </span>

                        <img
                            src="/arrow_forward.svg"
                            className="w-6 h-6"
                        />
                    </button>

                    <img
                        src="/Frame-11@2x.png"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                </div>

                {/* TERMS */}
                <div className="flex items-start gap-2 text-[#907b9b]">

                    <img
                        src="/Frame-17.svg"
                        className="w-[13px] h-[13px]"
                    />

                    <div>
                        <span className="font-light">
                            Proceeding from this screen confirms that you accepts our{" "}
                        </span>
                        <span className="underline font-semibold">
                            Privacy Policy
                        </span>
                        <span className="font-light">, </span>
                        <span className="underline font-semibold">
                            Terms & Conditions
                        </span>
                        <span className="font-light"> and </span>
                        <span className="underline font-semibold">
                            Term of Use
                        </span>
                    </div>

                </div>

            </div>
        </div>
    )
}