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
        onError: (err, variables, context) => {
            if (context?.previousWallet) {
                queryClient.setQueryData(["wallet"], context.previousWallet);
            }

            console.log("FINAL ERROR FRONTEND:", err); // 👈 debug

            if (err?.code === "INSUFFICIENT_BALANCE") {
                window.dispatchEvent(
                    new CustomEvent("gift:error", {
                        detail: {
                            message: err.message,
                            code: err.code,
                        },
                    })
                );
            }
        },

        // refetch
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
};