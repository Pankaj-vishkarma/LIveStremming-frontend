import axiosInstance from "./axios";

export const adminLoginAPI = async (data) => {
    const res = await axiosInstance.post("/admin/login", data);
    console.log(res);
    return res;
};


export const getAdminProfile = async () => {
    return await axiosInstance.get("/admin/me");
};