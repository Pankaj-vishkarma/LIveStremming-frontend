import api from "./axios";

//  JOIN LIVE (viewer + streamer using both)
export const getLiveToken = async (username) => {
    const res = await api.get(`/live/streamers/${username}/join`);
    return res.data.data;
};

// START LIVE (only streamer)
export const startLive = async () => {
    const res = await api.post("/live/streamer/go-live");
    return res.data.data;
};

// END LIVE
export const endLive = async () => {
    const res = await api.post("/live/streamer/end-live");
    return res.data;
};