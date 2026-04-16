import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    followStreamer,
    unfollowStreamer,
    getFollowStatus,
} from "../api/follow";

const useFollow = (username) => {
    const queryClient = useQueryClient();

    // ==========================
    // GET FOLLOW STATUS
    // ==========================
    const {
        data,
        isLoading: initialLoading,
    } = useQuery({
        queryKey: ["follow-status", username],
        queryFn: () => getFollowStatus(username),
        enabled: !!username,
    });

    const isFollowing = data?.data?.is_following || false;

    // ==========================
    // FOLLOW MUTATION
    // ==========================
    const followMutation = useMutation({
        mutationFn: () => followStreamer(username),

        onMutate: async () => {
            await queryClient.cancelQueries(["follow-status", username]);

            const previousData = queryClient.getQueryData([
                "follow-status",
                username,
            ]);

            // Optimistic update
            queryClient.setQueryData(["follow-status", username], (old) => ({
                ...old,
                data: { is_following: true },
            }));

            return { previousData };
        },

        onError: (err, _, context) => {
            // rollback
            queryClient.setQueryData(
                ["follow-status", username],
                context.previousData
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries(["follow-status", username]);
        },
    });

    // ==========================
    // UNFOLLOW MUTATION
    // ==========================
    const unfollowMutation = useMutation({
        mutationFn: () => unfollowStreamer(username),

        onMutate: async () => {
            await queryClient.cancelQueries(["follow-status", username]);

            const previousData = queryClient.getQueryData([
                "follow-status",
                username,
            ]);

            // Optimistic update
            queryClient.setQueryData(["follow-status", username], (old) => ({
                ...old,
                data: { is_following: false },
            }));

            return { previousData };
        },

        onError: (err, _, context) => {
            queryClient.setQueryData(
                ["follow-status", username],
                context.previousData
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries(["follow-status", username]);
        },
    });

    // ==========================
    // TOGGLE FUNCTION
    // ==========================
    const toggleFollow = () => {
        if (isFollowing) {
            unfollowMutation.mutate();
        } else {
            followMutation.mutate();
        }
    };

    return {
        isFollowing,
        toggleFollow,
        initialLoading,
        loading:
            followMutation.isPending || unfollowMutation.isPending,
    };
};

export default useFollow;