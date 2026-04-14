import axios from "./axios";

// ==========================
// GET WALLET
// ==========================
export const getWalletApi = async () => {
  const res = await axios.get("/wallet");
  return res.data;
};

// ==========================
// TOP-UP
// ==========================
export const topUpApi = async (amount) => {
  const res = await axios.post("/wallet/topup", { amount });
  return res.data;
};

// ==========================
// SEND GIFT
// ==========================
export const sendGiftApi = async ({ username, giftId }) => {
  const res = await axios.post(`/wallet/${username}/gift`, {
    gift_id: giftId,
  });
  return res.data;
};

// ==========================
// GET TRANSACTIONS
// ==========================
export const getTransactionsApi = async ({ cursor, limit = 10 }) => {
  const params = {};

  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;

  const res = await axios.get("/wallet/transactions", { params });
  return res.data;
};

// ==========================
// WITHDRAW
// ==========================
export const withdrawApi = async (data) => {
  const res = await axios.post("/wallet/withdraw", data);
  return res.data;
};