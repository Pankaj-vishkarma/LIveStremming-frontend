const GiftList = ({ gifts, onEdit, onDelete }) => {
    return (
        <div className="space-y-3">
            {gifts.map((gift) => (
                <div
                    key={gift._id}
                    className="flex items-center justify-between bg-[#0e0f0b] p-3 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={gift.icon}
                            className="w-10 h-10 rounded object-cover"
                        />

                        <div>
                            <p className="text-white text-sm">{gift.name}</p>
                            <p className="text-gray-400 text-xs">
                                {gift.coin_value} coins
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(gift)}
                            className="text-xs text-blue-400"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(gift._id)}
                            className="text-xs text-red-400"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GiftList;