import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyStreamer, getStreamerStatus, getStreamerMe, updateStreamerProfile, getStreamerProfile } from "../api/streamer";

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
            queryClient.invalidateQueries({ queryKey: ["streamer-status"] });
        },
    });
};

export const useStreamerMe = () => {
    return useQuery({
        queryKey: ["streamer-me"],
        queryFn: async () => {
            const res = await getStreamerMe();
            return res.data;
        },
    });
};





// ==============================
// UPDATE STREAMER PROFILE (SAFE)
// ==============================
export const useUpdateStreamerProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await updateStreamerProfile(data);
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["streamer-me"]);
        },

        onError: (error) => {
            console.error("STREAMER UPDATE ERROR:", error);
        },
    });
};

// ==============================
// GET STREAMER PROFILE (PUBLIC)
// ==============================
export const useStreamerProfile = (username) => {
    return useQuery({
        queryKey: ["streamer-profile", username],
        queryFn: async () => {
            const res = await getStreamerProfile(username);
            return res.data;
        },
        enabled: !!username,
    });
};