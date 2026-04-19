import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return await axios.post("/auth/logout");
        },

        onSuccess: () => {
            // clear user profile
            queryClient.setQueryData(["profile"], null);


            queryClient.removeQueries({ queryKey: ["admin-profile"] });


            queryClient.removeQueries({ queryKey: ["streamer-status"] });
        },
    });
};