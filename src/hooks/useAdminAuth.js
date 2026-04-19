import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLoginAPI } from "../api/admin";

export const useAdminLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminLoginAPI,

        onSuccess: async () => {
            // admin profile refetch
            await queryClient.invalidateQueries({ queryKey: ["admin-profile"] });

            // user profile clear (important separation)
            queryClient.removeQueries({ queryKey: ["profile"] });
        },

        onError: (error) => {
            console.error("Admin login error:", error);
        },
    });
};