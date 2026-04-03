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

        // ✅ IMPORTANT: return both values
        return {
            url: res.url,
            public_id: res.public_id,
        };

    } catch (error) {
        // ✅ clean error handling
        throw error?.response?.data || error;
    }
};