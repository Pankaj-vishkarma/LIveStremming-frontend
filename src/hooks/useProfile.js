import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/profile";


// ==============================
// GET PROFILE (EXISTING SAFE)
// ==============================
export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,

        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: false,
        keepPreviousData: true,
    });
};


// ==============================
// UPDATE PROFILE (SAFE FIX)
// ==============================
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await updateProfile(data);
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
            queryClient.invalidateQueries(["streamer-me"]);
        },

        onError: (error) => {
            console.error("PROFILE UPDATE ERROR:", error);
        },
    });
};