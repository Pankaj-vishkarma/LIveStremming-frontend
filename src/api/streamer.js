import axios from "./axios";

export const getPublicStreamers = async ({ pageParam = null }) => {
    const res = await axios.get("/streamer", {
        params: {
            cursor: pageParam,
            limit: 10,
        },
    });

    return res;
};

// Apply for streamer
export const applyStreamer = async () => {
    const { data } = await axios.post("/streamer/request");
    return data;
};

// Get request status
export const getStreamerStatus = async () => {
    const { data } = await axios.get("/streamer/request/status");
    return data;
};

// Get streamer profile
export const getStreamerMe = async () => {
    const res = await axios.get("/streamer/me");
    return res;
};

export const updateStreamerProfile = async (data) => {
    const res = await axios.put("/streamer/profile", data);
    return res;
};

export const getStreamerProfile = async (username) => {
    const res = await axios.get(`/streamer/${username}`);
    return res;
};