import axiosInstance from "./axios";

//  Get all gifts
export const getGifts = async () => {
  const res = await axiosInstance.get("/gifts");
  console.log("Gifts fetched:", res.data);
  return res.data;
};

// Send gift
export const sendGift = async (username, giftId) => {
  try {
    const res = await axiosInstance.post(`/gifts/send/${username}`, {
      gift_id: giftId,
    });
    return res.data;
  } catch (error) {
    console.log("FULL AXIOS ERROR:", error);

    // HANDLE BOTH CASES
    const errData = error.response?.data || error;

    throw {
      message: errData.message || "Something went wrong",
      code: errData.code || "INSUFFICIENT_BALANCE", 
    };
  }
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