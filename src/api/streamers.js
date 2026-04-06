import axiosInstance from "./axios";

export const getFeed = async ({ pageParam, activeTab, selectedGlobal }) => {
    let params = {
        limit: 10,
        cursor: pageParam,
    };

    // TAB FILTER
    if (activeTab === "Trending") params.category = "trending";
    if (activeTab === "Most View") params.category = "popular";
    if (activeTab === "Nearby") params.category = "nearby";

    // COUNTRY FILTER
    if (selectedGlobal !== "Global") {
        params.country = selectedGlobal;
    }

    const res = await axiosInstance.get("/streamer", { params });

    return res.data.data;
};