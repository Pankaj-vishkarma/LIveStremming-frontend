import { useState } from "react";
import { useTopup } from "../../hooks/useTopup";
import { COIN_PACKAGES } from "../../constants/coinPackages";

export default function TopupForm({ onClose }) {
    const [selectedPackage, setSelectedPackage] = useState(null);

    const { mutate: topup, isPending } = useTopup();

    const handleTopup = () => {
        console.log("Topup clicked:", selectedPackage);

        if (!selectedPackage) {
            alert("Select a package");
            return;
        }

        // FIX: only send price (NOT coins + bonus)
        const amount = selectedPackage.price;

        console.log("Sending amount:", amount);

        topup(
            amount,
            {
                onSuccess: () => {
                    console.log("Redirecting to payment...");
                },
                onError: (err) => {
                    console.error("Topup error:", err);
                    alert(err?.message || "Topup failed");
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[9999]">

            {/* CONTAINER */}
            <div className="w-full max-w-[412px] bg-[#1a1a1a] rounded-t-[22px]">

                {/* HEADER */}
                <div className="flex justify-between items-center px-4 pt-4 pb-2">
                    <h2 className="text-white text-sm font-medium">
                        Add Coins
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 text-xs"
                    >
                        Close
                    </button>
                </div>

                {/* SCROLL AREA */}
                <div className="px-4 space-y-3 overflow-y-auto max-h-[50vh] pb-4">

                    {COIN_PACKAGES.map((pkg) => (
                        <div
                            key={pkg.id}
                            onClick={() => {
                                console.log("Selected package:", pkg);
                                setSelectedPackage(pkg);
                            }}
                            className={`p-3 rounded-[14px] cursor-pointer border transition-all duration-200
                                ${selectedPackage?.id === pkg.id
                                    ? "border-[#e98834] bg-[#242424] scale-[1.02]"
                                    : "border-transparent bg-[#1a1a1a]"
                                }`}
                        >
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-white text-sm font-medium">
                                        ₹ {pkg.price}
                                    </p>

                                    <p className="text-gray-400 text-[10px]">
                                        {pkg.coins + pkg.bonus} coins
                                    </p>
                                </div>

                                {pkg.bonus > 0 && (
                                    <span className="text-[9px] bg-green-500 text-black px-2 py-1 rounded">
                                        +{pkg.bonus}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                </div>

                {/* FOOTER BUTTON */}
                <div className="p-4 border-t border-[#2a2a2a]">

                    <button
                        onClick={handleTopup}
                        disabled={!selectedPackage || isPending}
                        className={`w-full py-2 rounded-[12px] text-sm font-medium transition-all duration-200
                            ${!selectedPackage
                                ? "bg-gray-700 text-gray-400"
                                : isPending
                                    ? "bg-gray-600 text-black"
                                    : "bg-[#e98834] text-black"
                            }`}
                    >
                        {isPending ? "Processing..." : "Add Coins"}
                    </button>

                </div>

            </div>
        </div>
    );
}