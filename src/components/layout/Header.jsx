import avatarFallback from "../../assets/avatar.png";
import { useProfile } from "../../hooks/useProfile";

const Header = () => {

    const { data } = useProfile();

    const user = data || {};

    return (
        <div className="flex justify-between items-center w-full gap-2">

            {/* LEFT */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                <img
                    src={user?.display_photo || avatarFallback}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />

                <div className="leading-tight min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400">
                        Welcome
                    </p>

                    <h2 className="font-semibold text-[13px] sm:text-sm text-[#e98834] truncate">
                        {user?.username || "User"}
                    </h2>
                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                {/* COINS */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-[#2a1b12] px-2 sm:px-3 py-1 rounded-full">

                    <img src="/coin.png" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                    <span className="text-[10px] sm:text-xs text-white">
                        0
                    </span>

                    <div className="bg-[#e98834] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-black text-[10px] sm:text-xs font-bold">
                        +
                    </div>

                </div>

                {/* BELL */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">

                    <img src="/bell.png" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                </div>

            </div>

        </div>
    );
};

export default Header;