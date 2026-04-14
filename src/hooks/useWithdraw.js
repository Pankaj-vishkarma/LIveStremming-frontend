import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawApi } from "../api/wallet";

export const useWithdraw = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            return await withdrawApi(data);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },

        onError: (error) => {
            console.error("Withdraw failed:", error?.message);
        },
    });
};