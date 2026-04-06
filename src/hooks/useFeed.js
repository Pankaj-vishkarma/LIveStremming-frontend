import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../api/streamers";

export const useFeed = ({ activeTab, selectedGlobal }) => {
    return useInfiniteQuery({
        queryKey: ["feed", activeTab, selectedGlobal],

        queryFn: ({ pageParam = null }) =>
            getFeed({ pageParam, activeTab, selectedGlobal }),

        getNextPageParam: (lastPage) => {
            if (lastPage?.has_more) {
                return lastPage.next_cursor;
            }
            return undefined;
        },

        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        retry: 2,
        refetchOnWindowFocus: false,
    });
};