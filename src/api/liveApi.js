import api from "./axios";

export const getLiveToken = async (username) => {
    try {
        const res = await api.get(`/streamers/${username}/join`);
        return res?.data;
    } catch (err) {
        console.error("JOIN LIVE API ERROR:", err.response?.data || err);
        return null;
    }
};

export const startLive = async () => {
    try {
        const res = await api.post("/streamer/go-live");
        return res?.data;
    } catch (err) {
        console.error("START LIVE ERROR:", err.response?.data || err);
        return null;
    }
};

// END LIVE
export const endLive = async () => {
    try {
        const res = await api.post("/streamer/end-live");
        return res?.data;
    } catch (err) {
        console.error("END LIVE ERROR:", err.response?.data || err);
        return null;
    }
};