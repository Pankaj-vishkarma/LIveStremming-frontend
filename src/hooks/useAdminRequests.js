import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useAdminRequests = () => {
    return useQuery({
        queryKey: ["admin-requests"],
        queryFn: async () => {
            const res = await api.get("/admin/streamer/requests");
            return res.data.data || [];
        },
    });
};