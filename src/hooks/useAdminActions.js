import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export const useApproveStreamer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            api.put(`/admin/streamer/requests/${id}/approve`),

        onSuccess: () => {
            queryClient.invalidateQueries(["admin-requests"]);
        },
    });
};

export const useRejectStreamer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            api.patch(`/admin/streamer/requests/${id}/reject`),

        onSuccess: () => {
            queryClient.invalidateQueries(["admin-requests"]);
        },
    });
};