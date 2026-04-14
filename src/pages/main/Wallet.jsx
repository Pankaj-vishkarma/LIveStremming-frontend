import { useState } from "react";
import TopupForm from "../../components/wallet/TopupForm";
import WithdrawForm from "../../components/wallet/WithdrawForm";

import { useWallet } from "../../hooks/useWallet";
import { useTransactions } from "../../hooks/useTransactions";
import { useSelector } from "react-redux";

export default function Wallet() {
    const [showTopup, setShowTopup] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const user = useSelector((state) => state.auth.user);

    //  React Query - Wallet
    const { data: walletData, isLoading } = useWallet();

    //  React Query - Transactions
    const {
        data: txData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTransactions();

    // wallet values
    const viewer_balance = walletData?.viewer_balance || 0;
    const streamer_earnings = walletData?.streamer_earnings || 0;

    // flatten transactions
    const transactions =
        txData?.pages?.flatMap((page) => page.transactions) || [];

    // Load more
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] h-screen overflow-y-auto no-scrollbar px-3 sm:px-4 pt-4 pb-24 space-y-5">

                {/* HEADER */}
                <h1 className="text-white text-sm font-medium">My Wallet</h1>

                {/* BALANCE CARD */}
                <div className="bg-[#1a1a1a] rounded-[18px] p-4 space-y-3">

                    <div>
                        <p className="text-[10px] text-gray-400">
                            {user?.role === "streamer" ? "My Earnings" : "Coins Balance"}
                        </p>
                        <p className="text-white text-lg font-semibold">
                            ₹ {user?.role === "streamer" ? streamer_earnings : viewer_balance}
                        </p>
                    </div>

                    {user?.role !== "streamer" && (
                        <div>
                            <p className="text-[10px] text-gray-400">
                                Earnings
                            </p>
                            <p className="text-white text-sm">
                                ₹ {streamer_earnings}
                            </p>
                        </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 pt-2">

                        {/* TOPUP */}
                        {user?.role === "user" && (
                            <button
                                onClick={() => setShowTopup(true)}
                                className="flex-1 bg-[#e98834] text-black text-xs py-2 rounded-[10px]"
                            >
                                Add Coins
                            </button>
                        )}

                        {/* WITHDRAW (only if earnings available) */}
                        {user?.role === "streamer" && streamer_earnings > 0 && (
                            <button
                                onClick={() => setShowWithdraw(true)}
                                className="flex-1 bg-green-500 text-black text-xs py-2 rounded-[10px]"
                            >
                                Withdraw
                            </button>
                        )}

                    </div>

                </div>

                {/* TRANSACTIONS */}
                <div className="space-y-3">
                    <h2 className="text-white text-xs font-medium">
                        Transactions
                    </h2>

                    {transactions.length === 0 && !isLoading && (
                        <p className="text-gray-400 text-xs text-center">
                            No transactions yet
                        </p>
                    )}

                    {transactions.map((tx, i) => (
                        <div
                            key={tx._id || i}
                            className="bg-[#1a1a1a] rounded-[16px] px-3 py-3 flex justify-between items-center"
                        >
                            <div>
                                <p className="text-white text-[11px] font-medium">
                                    {tx.type.replace("_", " ").toUpperCase()}
                                </p>
                                <p className="text-gray-400 text-[9px]">
                                    {
                                        tx?.createdAt
                                            ? new Date(tx.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"
                                    }
                                </p>
                            </div>

                            <p
                                className={`text-[11px] font-medium ${tx.type === "gift_sent"
                                    ? "text-red-400"
                                    : "text-green-400"
                                    }`}
                            >
                                {tx.type === "gift_sent" ? "-" : "+"}₹ {tx.amount}
                            </p>
                        </div>
                    ))}

                    {/* LOAD MORE */}
                    {hasNextPage && (
                        <button
                            onClick={handleLoadMore}
                            className="w-full text-center text-xs text-gray-400 py-2"
                        >
                            {isFetchingNextPage ? "Loading..." : "Load More"}
                        </button>
                    )}
                </div>

            </div>

            {/* TOPUP MODAL */}
            {showTopup && (
                <TopupForm onClose={() => setShowTopup(false)} />
            )}

            {/* WITHDRAW MODAL */}
            {showWithdraw && (
                <WithdrawForm onClose={() => setShowWithdraw(false)} />
            )}
        </div>
    );
}