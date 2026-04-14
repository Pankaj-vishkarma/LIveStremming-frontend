import { useState } from "react";
import { useWithdraw } from "../../hooks/useWithdraw";

export default function WithdrawForm({ onClose }) {
    const [amount, setAmount] = useState("");
    const [account, setAccount] = useState("");
    const [ifsc, setIfsc] = useState("");

    const { mutate: withdraw, isPending } = useWithdraw();

    const handleWithdraw = async () => {
        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount <= 0) {
            alert("Enter valid amount");
            return;
        }

        if (!account || account.length < 8) {
            alert("Enter valid account number");
            return;
        }

        if (!ifsc || ifsc.length < 5) {
            alert("Enter valid IFSC code");
            return;
        }

        withdraw(
            {
                amount: numericAmount,
                bank_account_number: account,
                bank_ifsc: ifsc.toUpperCase(),
                bank_account_name: "User Name",
            },
            {
                onSuccess: () => {
                    alert("Withdraw request submitted");
                    onClose();
                },
                onError: (err) => {
                    alert(err?.message || "Withdraw failed");
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[9999]">

            <div className="w-full max-w-[412px] bg-[#1a1a1a] rounded-t-[22px]">

                <div className="flex justify-between items-center px-4 pt-4 pb-2">
                    <h2 className="text-white text-sm font-medium">
                        Withdraw Earnings
                    </h2>

                    <button onClick={onClose} className="text-gray-400 text-xs">
                        Close
                    </button>
                </div>

                <div className="px-4 space-y-3 overflow-y-auto max-h-[50vh] pb-4">

                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400">Amount</p>
                        <input
                            type="number"
                            placeholder="₹ 100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-[#242424] text-white text-sm rounded-[10px] outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400">Account Number</p>
                        <input
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className="w-full px-3 py-2 bg-[#242424] text-white text-sm rounded-[10px] outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400">IFSC Code</p>
                        <input
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                            className="w-full px-3 py-2 bg-[#242424] text-white text-sm rounded-[10px] outline-none uppercase"
                        />
                    </div>

                </div>

                <div className="p-4 border-t border-[#2a2a2a]">

                    <button
                        onClick={handleWithdraw}
                        disabled={isPending}
                        className={`w-full py-2 rounded-[12px] text-sm font-medium transition
                        ${isPending
                                ? "bg-gray-600 text-black"
                                : "bg-green-500 text-black"
                            }`}
                    >
                        {isPending ? "Processing..." : "Withdraw"}
                    </button>

                </div>

            </div>
        </div>
    );
}