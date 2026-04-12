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

        console.log("FULL RESPONSE:", res);

        const responseData = res.data || res;

        return {
            url: responseData.url,
            public_id: responseData.public_id,
        };

    } catch (error) {
        throw error?.response?.data || error;
    }
};