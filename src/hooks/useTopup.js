import { useMutation } from "@tanstack/react-query";
import { topUpApi, createCheckoutSessionApi } from "../api/wallet";

export const useTopup = () => {
    return useMutation({
        mutationFn: async (amount) => {
            // Step 1: create transaction (PENDING)
            const topupRes = await topUpApi(amount);

            console.log("topupRes:", topupRes);

            const transaction_id = topupRes?.transaction_id;

            if (!transaction_id) {
                console.error("Invalid topup response:", topupRes);
                throw new Error("Transaction ID not received");
            }

            // Step 2: create Stripe checkout session
            const sessionRes = await createCheckoutSessionApi({
                amount,
                transaction_id,
            });

            console.log("sessionRes:", sessionRes);

            const url = sessionRes?.url || sessionRes?.data?.url;

            if (!url) {
                console.error("Invalid session response:", sessionRes);
                throw new Error("Stripe URL not received");
            }

            // Step 3: redirect to Stripe
            window.location.href = url;

            return sessionRes;
        },

        onError: (error) => {
            console.error("Topup failed:", error?.message);
        },
    });
};