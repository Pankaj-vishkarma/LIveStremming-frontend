import { useMutation, useQueryClient } from "@tanstack/react-query";
import { topUpApi } from "../api/wallet";

export const useTopup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (amount) => {
            const res = await topUpApi(amount);
            return res;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },

        // optional error handling
        onError: (error) => {
            console.error("Topup failed:", error?.message);
        },
    });
};