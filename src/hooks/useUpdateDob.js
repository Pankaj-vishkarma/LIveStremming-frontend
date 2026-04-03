import { useMutation } from "@tanstack/react-query";
import { updateDob } from "../api/profile";

export const useUpdateDob = () => {
    return useMutation({
        mutationFn: updateDob,
    });
};