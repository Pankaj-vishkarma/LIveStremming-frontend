import RequestCard from "./RequestCard";

export default function RequestsList({
    requests,
    onApprove,
    onReject,
    isApprovedSection = false
}) {
    return (
        <div className="space-y-3">

            {requests?.length === 0 ? (
                <p className="text-center text-[11px] text-gray-400">
                    {isApprovedSection
                        ? "No approved users"
                        : "No pending requests"}
                </p>
            ) : (
                requests.map((item) => (
                    <RequestCard
                        key={item._id}
                        item={item}
                        onApprove={onApprove}
                        onReject={onReject}
                        isApprovedSection={isApprovedSection}
                    />
                ))
            )}

        </div>
    );
}