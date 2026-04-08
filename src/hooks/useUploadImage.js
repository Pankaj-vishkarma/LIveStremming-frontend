import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/upload";

export const useUploadImage = () => {
    return useMutation({
        mutationFn: uploadImage,

        // success handler
        onSuccess: (data) => {
            console.log("Image uploaded successfully:", data);
        },

        // error handler
        onError: (error) => {
            console.error("Image upload failed:", error);
        },
        retry: 1,
    });
};