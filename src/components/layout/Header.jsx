import avatarFallback from "../../assets/avatar.png";
import { useProfile } from "../../hooks/useProfile";

const Header = () => {

    const { data } = useProfile();

    const user = data?.data || {};

    return (
        <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">
                <img
                    src={user?.display_photo || avatarFallback}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="leading-tight">
                    <p className="text-[10px] text-gray-400">Welcome</p>
                    <h2 className="font-semibold text-sm text-[#e98834]">
                        {user?.username || "User"}
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-3">

                {/* COINS */}
                <div className="flex items-center gap-2 bg-[#2a1b12] px-3 py-1.5 rounded-full">
                    <img src="/coin.png" className="w-4 h-4" />
                    <span className="text-xs text-white">
                        0
                    </span>
                    <div className="bg-[#e98834] w-5 h-5 rounded-full flex items-center justify-center text-black text-xs font-bold">
                        +
                    </div>
                </div>

                {/* BELL */}
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                    <img src="/bell.png" className="w-4 h-4" />
                </div>

            </div>
        </div>
    );
};

export default Header;