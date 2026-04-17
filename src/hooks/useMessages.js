import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getConversationsApi,
    getMessagesApi,
    sendMessageApi,
    markAsReadApi,
} from "../api/messages";

// 🔹 1. Chat List
export const useConversations = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: getConversationsApi,
    });
};

// 🔹 2. Messages (Chat screen - infinite scroll)
export const useMessages = (username) => {
    return useInfiniteQuery({
        queryKey: ["messages", username],
        queryFn: ({ pageParam = null }) =>
            getMessagesApi(username, { cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.next_cursor,
        enabled: !!username,
    });
};

// 🔹 3. Send Message
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ username, content }) =>
            sendMessageApi(username, { content }),

        onSuccess: (_, variables) => {
            console.log("MESSAGE SENT SUCCESS:", data);
            // refresh messages + chat list
            queryClient.invalidateQueries({
                queryKey: ["messages", variables.username],
            });
            queryClient.invalidateQueries(["conversations"]);
        },
    });
};

// 🔹 4. Mark as Read
export const useMarkAsRead = () => {
    return useMutation({
        mutationFn: (username) => markAsReadApi(username),
    });
};