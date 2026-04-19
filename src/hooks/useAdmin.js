import { useQuery } from "@tanstack/react-query";
import { getAdminProfile } from "../api/admin";

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ["admin-profile"],
        queryFn: getAdminProfile,
        retry: false,
        refetchOnWindowFocus: false,
    });
};