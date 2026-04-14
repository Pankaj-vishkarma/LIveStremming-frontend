import axiosInstance from "./axios";

//  Get all gifts (NO CHANGE)
export const getGifts = async () => {
  const res = await axiosInstance.get("/gifts");
  console.log("Gifts fetched:", res.data);
  return res.data;
};

// Send gift (NO CHANGE)
export const sendGift = async (username, giftId) => {
  const res = await axiosInstance.post(`/gifts/send/${username}`, {
    gift_id: giftId,
  });
  return res.data;
};

//  Admin - Create Gift
export const createGiftApi = (data) => {
  return axiosInstance.post("/gifts/admin", data);
};

// Admin - Update Gift 
export const updateGiftApi = (id, data) => {
  return axiosInstance.put(`/gifts/admin/${id}`, data);
};

// Admin - Delete Gift 
export const deleteGiftApi = (id) => {
  return axiosInstance.delete(`/gifts/admin/${id}`);
};