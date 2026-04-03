export const getMessages = async () => {
    const res = await axios.get("/messages");
    return res.data;
};