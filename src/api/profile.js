import axios from "./axios";

//  GET PROFILE
export const getProfile = async () => {
    try {
        const res = await axios.get("/profile");
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

//  Update profile
export const updateProfile = async (data) => {
    try {
        const res = await axios.put("/profile", data);
        console.log("Profile update response:", res);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};