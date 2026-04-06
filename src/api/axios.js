import axios from "axios";
import { queryClient } from "../main";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // always return clean data
        return response.data;
    },
    (error) => {
        // Handle 401 (auth expired / token deleted)
        if (error.response?.status === 401) {
            const existingUser = queryClient.getQueryData(["profile"]);

            if (existingUser) {
                queryClient.removeQueries({ queryKey: ["profile"] });
            }
        }

        // VERY IMPORTANT: send clean error to React Query
        if (error.response) {
            return Promise.reject(error.response.data);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;