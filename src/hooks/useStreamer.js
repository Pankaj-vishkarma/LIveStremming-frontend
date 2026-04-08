import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyStreamer, getStreamerStatus } from "../api/streamer";

// Get Status
export const useStreamerStatus = () => {
    return useQuery({
        queryKey: ["streamer-status"],
        queryFn: getStreamerStatus,
    });
};

// Apply Mutation
export const useApplyStreamer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: applyStreamer,

        onSuccess: () => {
            // refetch status after apply
            queryClient.invalidateQueries(["streamer-status"]);
        },
    });
};