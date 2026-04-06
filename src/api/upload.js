import axios from "./axios";

export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // FIXED
        return {
            url: res.url,
            public_id: res.public_id,
        };

    } catch (error) {
        throw error?.response?.data || error;
    }
};