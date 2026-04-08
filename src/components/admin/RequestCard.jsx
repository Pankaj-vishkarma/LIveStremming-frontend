export default function RequestCard({ item, onApprove, onReject }) {
    return (
        <div className="bg-[#1a1a1a] rounded-[18px] p-3 flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-2">
                <img
                    src={item?.avatar || "/avatar1.png"}
                    className="w-8 h-8 rounded-full object-cover"
                />

                <div>
                    <p className="text-[12px] text-white">
                        {item.channel_name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                        {item.status}
                    </p>
                </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex gap-2">

                <button
                    onClick={() => onApprove(item._id)}
                    className="px-3 py-1 rounded-full text-[10px] bg-green-500 text-black"
                >
                    Accept
                </button>

                <button
                    onClick={() => onReject(item._id)}
                    className="px-3 py-1 rounded-full text-[10px] bg-red-500 text-white"
                >
                    Reject
                </button>

            </div>

        </div>
    );
}