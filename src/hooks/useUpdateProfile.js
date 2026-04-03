import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/profile";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,

        // ✅ success ke baad cache refresh
        onSuccess: (data) => {
            // profile refetch
            queryClient.invalidateQueries(["profile"]);

            // optional: directly set data
            queryClient.setQueryData(["profile"], data);
        },

        // ✅ centralized error handling
        onError: (error) => {
            console.error("Profile Update Error:", error);
        },
    });
};