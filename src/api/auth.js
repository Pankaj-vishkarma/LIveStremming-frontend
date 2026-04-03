import axiosInstance from "./axios";

// ✅ SEND OTP
export const sendOtpAPI = async (data) => {
    const res = await axiosInstance.post("/auth/send-otp", data);
    return res;
};

// ✅ VERIFY OTP
export const verifyOtpAPI = async (data) => {
    const res = await axiosInstance.post("/auth/verify-otp", data);
    return res;
};

// ✅ GET ME
export const getMe = async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
};