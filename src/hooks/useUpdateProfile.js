import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/profile";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,

        onSuccess: (data) => {
            queryClient.setQueryData(["profile"], data);
        },

        onError: (error) => {
            console.error("Profile Update Error:", error);
            alert(error?.message || "Something went wrong");
        },
    });
};