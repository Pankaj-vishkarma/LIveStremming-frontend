import { useQuery } from "@tanstack/react-query";
import { getWalletApi } from "../api/wallet";

export const useWallet = () => {
    return useQuery({
        queryKey: ["wallet"],

        queryFn: async () => {
            const res = await getWalletApi();

            return res || {
                viewer_balance: 0,
                streamer_earnings: 0,
            };
        },

        staleTime: 1000 * 60,
        retry: 1,
    });
};