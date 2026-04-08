import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export const useApproveStreamer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            api.patch(`/admin/streamer/${id}/approve`),

        onSuccess: () => {
            queryClient.invalidateQueries(["admin-requests"]);
        },
    });
};

export const useRejectStreamer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            api.patch(`/admin/streamer/${id}/reject`),

        onSuccess: () => {
            queryClient.invalidateQueries(["admin-requests"]);
        },
    });
};