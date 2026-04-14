import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactionsApi } from "../api/wallet";

export const useTransactions = () => {
    return useInfiniteQuery({
        queryKey: ["transactions"],

        queryFn: async ({ pageParam = null }) => {
            const res = await getTransactionsApi({
                cursor: pageParam,
                limit: 10,
            });

            return res || {
                transactions: [],
                next_cursor: null,
                has_more: false,
            };
        },

        getNextPageParam: (lastPage) => {
            return lastPage?.has_more
                ? lastPage.next_cursor
                : undefined;
        },

        staleTime: 1000 * 60,
    });
};