import { useQuery } from "@tanstack/react-query";
import {
    getUserFollowers,
    getUserFollowing,
} from "../api/follow";

export const useFollowStats = (userId) => {

    // ==========================
    // FOLLOWERS QUERY
    // ==========================
    const followersQuery = useQuery({
        queryKey: ["followers", userId],
        queryFn: async () => {
            const res = await getUserFollowers(userId);
            return res.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, // 2 min cache
    });

    // ==========================
    // FOLLOWING QUERY
    // ==========================
    const followingQuery = useQuery({
        queryKey: ["following", userId],
        queryFn: async () => {
            const res = await getUserFollowing(userId);
            return res.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    // ==========================
    // SAFE DATA EXTRACTION
    // ==========================
    const followers = followersQuery.data?.followers || [];
    const following = followingQuery.data || [];

    return {
        // data
        followers,
        following,

        // counts (direct use ke liye)
        followersCount: followers.length,
        followingCount: following.length,

        // loading
        isLoading:
            followersQuery.isLoading || followingQuery.isLoading,

        // error handling
        isError:
            followersQuery.isError || followingQuery.isError,

        error:
            followersQuery.error || followingQuery.error,

        // refetch (future use)
        refetchFollowers: followersQuery.refetch,
        refetchFollowing: followingQuery.refetch,
    };
};