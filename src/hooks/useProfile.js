import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,

        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,

        // 🔥 REMOVE cookie check (unreliable)
        enabled: true,

        // 🔥 IMPORTANT (fix redirect race condition)
        keepPreviousData: true,
    });
};