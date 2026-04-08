import axios from "./axios";

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