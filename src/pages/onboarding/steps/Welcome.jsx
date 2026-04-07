import hero from "../../../assets/hero.png"

export default function Welcome({ next }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex justify-center bg-black">

            {/* Background Image */}
            <div className="absolute inset-0 flex justify-center">
                <img
                    src={hero}
                    className="w-full max-w-[412px] h-full object-cover"
                    alt="hero"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* MAIN CONTAINER */}
            <div className="
                relative 
                w-full 
                max-w-[412px] 
                min-h-screen 
                flex flex-col 
                justify-end 
                px-4 sm:px-6 
                pb-6 sm:pb-8 
                gap-5 sm:gap-6 
                text-[10px] sm:text-[12px] 
                text-[#815f42] 
                font-inter
            ">

                {/* TEXT */}
                <div className="flex flex-col text-white font-museomoderno leading-tight gap-[10px]">
                    <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-medium">
                        Where world
                    </h2>

                    <h1 className="text-[40px] sm:text-[48px] md:text-[54px] font-medium -mt-2 sm:-mt-3">
                        feels{" "}
                        <span className="text-[#e98834]">
                            Alive
                        </span>
                    </h1>
                </div>

                {/* BUTTON ROW */}
                <div className="flex items-center gap-2 sm:gap-3">

                    <button
                        onClick={next}
                        className="
                            flex-1 
                            h-[45px] sm:h-[50px] 
                            bg-[#e98834] 
                            rounded-full 
                            flex items-center 
                            justify-between 
                            px-4 
                            gap-3 sm:gap-5
                        "
                    >
                        <span className="text-black font-bold text-[14px] sm:text-[16px]">
                            Get Started
                        </span>

                        <img
                            src="/arrow_forward.svg"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt="arrow"
                        />
                    </button>

                    <img
                        src="/Frame-11@2x.png"
                        className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full object-cover"
                        alt="profile"
                    />
                </div>

                {/* TERMS */}
                <div className="flex items-start gap-2 text-[#907b9b] leading-relaxed">

                    <img
                        src="/Ellipse2.png"
                        className="w-[12px] h-[12px] sm:w-[13px] sm:h-[13px] mt-1 rounded-[6.5px]"
                        alt="check"
                    />

                    <div>
                        <span className="font-extralight text-[#815F42]">
                            Proceeding from this screen confirms that you accepts our{" "}
                        </span>

                        <span className="underline font-semibold text-[#815F42]">
                            Privacy Policy
                        </span>

                        <span className="font-light text-[#815F42]">, </span>

                        <span className="underline font-semibold text-[#815F42]">
                            Terms & Conditions
                        </span>

                        <span className="font-light text-[#815F42]"> and </span>

                        <span className="underline font-semibold text-[#815F42]">
                            Term of Use
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}