import api from "./axios";

// ==========================
// FOLLOW STREAMER
// ==========================
export const followStreamer = async (username) => {
    return await api.post(
        `/follow/streamers/${username}/follow`
    );
};

// ==========================
// UNFOLLOW STREAMER
// ==========================
export const unfollowStreamer = async (username) => {
    return await api.delete(
        `/follow/streamers/${username}/follow`
    );
};

// ==========================
// FOLLOW STATUS
// ==========================
export const getFollowStatus = async (username) => {
    return await api.get(
        `/follow/streamers/${username}/follow-status`
    );
};

// ==========================
// GET FOLLOWING LIST
// ==========================
export const getFollowing = async () => {
    return await api.get(
        `/follow/streamers/following`
    );
};

// ==========================
// GET FOLLOWERS (LOGGED-IN USER)
// ==========================
export const getFollowers = async (params = {}) => {
    return await api.get(
        `/follow/streamers/followers`,
        { params }
    );
};

// ==========================
// GET FOLLOWERS (PUBLIC USER)
// ==========================
export const getUserFollowers = async (userId, params = {}) => {
    return await api.get(
        `/follow/streamers/${userId}/followers`,
        { params }
    );
};

// ==========================
// GET FOLLOWING (PUBLIC USER)
// ==========================
export const getUserFollowing = async (userId, params = {}) => {
    return await api.get(
        `/follow/streamers/${userId}/following`,
        { params }
    );
};