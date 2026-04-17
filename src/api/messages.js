import axiosInstance from "./axios";

// Chat List
export const getConversationsApi = async () => {
    const res = await axiosInstance.get("/messages");
    return res.data;
};

// Get Messages
export const getMessagesApi = async (username, params) => {
    const res = await axiosInstance.get(`/messages/${username}`, {
        params,
    });
    console.log("API RESPONSE FOR MESSAGES:", res.data);
    return res.data;
};

// Send Message
export const sendMessageApi = async (username, data) => {
    const res = await axiosInstance.post(`/messages/${username}`, data);
    console.log("API RESPONSE FOR SEND MESSAGE:", res.data);
    return res.data;
};

// Mark as Read
export const markAsReadApi = async (username) => {
    const res = await axiosInstance.put(`/messages/${username}/read`);
    console.log("API RESPONSE FOR MARK AS READ:", res.data);
    return res.data;
};