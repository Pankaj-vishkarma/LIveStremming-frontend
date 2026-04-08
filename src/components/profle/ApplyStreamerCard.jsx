import React from "react";
import { useApplyStreamer, useStreamerStatus } from "../../hooks/useStreamer";

const ApplyStreamerCard = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useStreamerStatus();

  const {
    mutate,
    isPending,
  } = useApplyStreamer();

  // ==========================
  // DEBUG LOGS
  // ==========================
  console.log("STREAMER STATUS API RESPONSE:", data);
  console.log("STREAMER STATUS ERROR:", error);

  // ==========================
  // LOADING STATE
  // ==========================
  if (isLoading) {
    return (
      <p className="text-center text-sm text-gray-400 mt-4">
        Loading streamer status...
      </p>
    );
  }

  // ==========================
  // ERROR STATE
  // ==========================
  if (isError) {
    return (
      <div className="bg-red-500/20 p-4 rounded-xl mt-4 text-center">
        <p className="text-red-400 text-sm">
          Failed to load streamer status
        </p>
      </div>
    );
  }

  // ==========================
  // CORRECT STATUS EXTRACTION (FINAL FIX)
  // ==========================
  const status =
    data?.request_status ||
    data?.data?.request_status ||
    "not_applied";

  console.log("FINAL STATUS:", status);

  // ==========================
  // NOT APPLIED
  // ==========================
  if (status === "not_applied") {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-xl mt-4 text-center">
        <p className="text-sm text-gray-300 mb-3">
          Become a Streamer 🚀
        </p>

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className={`w-full py-2 rounded-lg text-sm font-medium transition 
            ${isPending
              ? "bg-gray-500 text-black cursor-not-allowed"
              : "bg-[#e98834] text-black hover:opacity-90"
            }`}
        >
          {isPending ? "Applying..." : "Apply for Streamer"}
        </button>
      </div>
    );
  }

  // ==========================
  // PENDING
  // ==========================
  if (status === "pending") {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-xl mt-4 text-center">
        <button
          disabled
          className="w-full py-2 rounded-lg text-sm font-medium bg-yellow-500 text-black cursor-not-allowed"
        >
          ⏳ Request Pending
        </button>
      </div>
    );
  }

  // ==========================
  // REJECTED
  // ==========================
  if (status === "rejected") {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-xl mt-4 text-center">
        <p className="text-red-400 text-sm mb-3 font-medium">
          ❌ Request Rejected
        </p>

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className={`w-full py-2 rounded-lg text-sm font-medium transition
            ${isPending
              ? "bg-gray-500 text-black cursor-not-allowed"
              : "bg-[#e98834] text-black hover:opacity-90"
            }`}
        >
          {isPending ? "Reapplying..." : "Apply Again"}
        </button>
      </div>
    );
  }

  // ==========================
  // APPROVED
  // ==========================
  if (status === "approved") {
    return (
      <div className="bg-[#1a1a1a] p-4 rounded-xl mt-4 text-center">
        <button
          disabled
          className="w-full py-2 rounded-lg text-sm font-medium bg-green-500 text-black cursor-not-allowed"
        >
          You are now a Streamer
        </button>
      </div>
    );
  }

  // ==========================
  // FALLBACK
  // ==========================
  return (
    <div className="bg-gray-500/20 p-4 rounded-xl mt-4 text-center">
      <p className="text-gray-400 text-sm">
        Unknown status
      </p>
    </div>
  );
};

export default ApplyStreamerCard;