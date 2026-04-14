import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendGift } from "../api/gifts";

export const useSendGift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ username, giftId }) => {
            return await sendGift(username, giftId);
        },

        // Optimistic update FIX
        onMutate: async ({ gift }) => {
            await queryClient.cancelQueries({ queryKey: ["wallet"] });

            const previousWallet = queryClient.getQueryData(["wallet"]);

            queryClient.setQueryData(["wallet"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    viewer_balance:
                        old.viewer_balance - gift.coin_value,
                };
            });

            return { previousWallet };
        },

        // rollback
        onError: (err, _, context) => {
            if (context?.previousWallet) {
                queryClient.setQueryData(["wallet"], context.previousWallet);
            }
        },

        // refetch
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
};