import axiosInstance from "./axios";

//  Get all gifts
export const getGifts = async () => {
    const res = await axiosInstance.get("/gifts");
    return res.data;
};

// Send gift
export const sendGift = async (username, giftId) => {
    const res = await axiosInstance.post(`/gifts/send/${username}`, {
        gift_id: giftId,
    });
    return res.data;
};