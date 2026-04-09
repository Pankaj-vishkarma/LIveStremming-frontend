import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicStreamers } from "../api/streamer";

export const useFeed = ({ activeTab, selectedGlobal }) => {
    return useInfiniteQuery({
        queryKey: ["feed", activeTab, selectedGlobal],

        queryFn: async ({ pageParam = null }) => {
            const res = await getPublicStreamers({ pageParam });

            return res.data?.data || res.data;
        },

        getNextPageParam: (lastPage) => {
            return lastPage?.next_cursor || null;
        },
    });
};