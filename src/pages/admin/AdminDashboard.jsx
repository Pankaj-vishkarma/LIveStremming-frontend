import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useLogout } from "../../hooks/useLogout";

import RequestsList from "../../components/admin/RequestsList";
import { useAdminRequests } from "../../hooks/useAdminRequests";
import {
    useApproveStreamer,
    useRejectStreamer,
} from "../../hooks/useAdminActions";

import GiftForm from "../../components/admin/GiftForm";
import GiftList from "../../components/admin/GiftList";

import {
    createGiftApi,
    updateGiftApi,
    deleteGiftApi,
    getGifts,
} from "../../api/gifts";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("pending");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: logout } = useLogout();

    // ================= REQUESTS =================
    const {
        data: requests,
        isLoading: requestsLoading,
        isError: requestsError,
    } = useAdminRequests();

    const finalRequests = requests || [];

    const pendingRequests = finalRequests.filter(
        (r) => r.request_status === "pending"
    );

    const approvedRequests = finalRequests.filter(
        (r) => r.request_status === "approved"
    );

    const approveMutation = useApproveStreamer();
    const rejectMutation = useRejectStreamer();

    const [section, setSection] = useState("requests");

    // ================= GIFTS =================
    const [giftTab, setGiftTab] = useState("list");
    const [gifts, setGifts] = useState([]);
    const [editGift, setEditGift] = useState(null);

    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        try {
            const res = await getGifts();
            console.log("Gifts fetched in profile:", res);
            setGifts(res || []);
        } catch (err) {
            console.error("Gift fetch error:", err);
        }
    };

    const handleCreateGift = async (formData) => {
        await createGiftApi(formData);
        fetchGifts();
        setEditGift(null);
        setGiftTab("list");
    };

    const handleUpdateGift = async (formData) => {
        if (!editGift?._id) return;
        await updateGiftApi(editGift._id, formData);
        setEditGift(null);
        fetchGifts();
        setGiftTab("list");
    };

    const handleDeleteGift = async (id) => {
        await deleteGiftApi(id);
        fetchGifts();
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                localStorage.removeItem("onboarding_step");
                localStorage.removeItem("onboarding_data");

                dispatch({ type: "auth/logout" });

                navigate("/", { replace: true });
            },
        });
    };

    // ================= STATES =================
    if (requestsLoading) {
        return (
            <div className="px-4 pt-4 text-white">Loading...</div>
        );
    }

    if (requestsError) {
        return (
            <div className="px-4 pt-4 text-red-500">
                Failed to load requests
            </div>
        );
    }

    return (
        <>
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

                <div className="w-full max-w-[412px] px-4 pt-4 pb-24 space-y-6">

                    {/*  TOP NAVBAR */}
                    <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-xl">

                        <button
                            onClick={() => setSection("requests")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${section === "requests"
                                    ? "bg-[#e98834] text-black"
                                    : "text-white"
                                }`}
                        >
                            Requests
                        </button>

                        <button
                            onClick={() => setSection("gifts")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${section === "gifts"
                                    ? "bg-[#e98834] text-black"
                                    : "text-white"
                                }`}
                        >
                            Gifts
                        </button>

                        {/* LOGOUT */}
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold text-red-400"
                        >
                            Logout
                        </button>

                    </div>

                    {/* ================= REQUESTS ================= */}
                    {section === "requests" && (

                        <div className="space-y-3">
                            <h3 className="text-sm text-white font-semibold">
                                Streamer Requests
                            </h3>

                            <div className="flex gap-2 mt-2 bg-[#1a1a1a] p-1 rounded-xl">

                                <button
                                    onClick={() => setActiveTab("pending")}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                ${activeTab === "pending"
                                            ? "bg-[#e98834] text-black shadow-md"
                                            : "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                                        }`}
                                >
                                    Pending ({pendingRequests.length})
                                </button>

                                <button
                                    onClick={() => setActiveTab("approved")}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                                ${activeTab === "approved"
                                            ? "bg-[#e98834] text-black"
                                            : "bg-[#1a1a1a] text-white"
                                        }`}
                                >
                                    Approved ({approvedRequests.length})
                                </button>

                            </div>

                            {activeTab === "pending" && (
                                <div className="space-y-2 mt-3">
                                    <RequestsList
                                        requests={pendingRequests}
                                        onApprove={(id) => approveMutation.mutate(id)}
                                        onReject={(id) => rejectMutation.mutate(id)}
                                    />
                                </div>
                            )}

                            {activeTab === "approved" && (
                                <div className="space-y-2 mt-3">
                                    <RequestsList
                                        requests={approvedRequests}
                                        onApprove={() => { }}
                                        onReject={() => { }}
                                        isApprovedSection={true}
                                    />
                                </div>
                            )}
                        </div>

                    )}

                    {/* ================= GIFTS ================= */}
                    {section === "gifts" && (

                        <div className="space-y-3">
                            <h3 className="text-sm text-white font-semibold">
                                Gift Management
                            </h3>

                            <div className="flex gap-2 mt-2 bg-[#1a1a1a] p-1 rounded-xl">

                                <button
                                    onClick={() => {
                                        setGiftTab("list");
                                        setEditGift(null);
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${giftTab === "list"
                                            ? "bg-[#e98834] text-black shadow-md"
                                            : "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                                        }`}
                                >
                                    Gift List ({gifts.length})
                                </button>

                                <button
                                    onClick={() => setGiftTab("form")}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
            ${giftTab === "form"
                                            ? "bg-[#e98834] text-black"
                                            : "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                                        }`}
                                >
                                    {editGift ? "Edit Gift" : "Add Gift"}
                                </button>

                            </div>

                            <div className="space-y-2 mt-3">

                                {giftTab === "list" && (
                                    <>
                                        {gifts.length === 0 ? (
                                            <div className="text-center text-gray-400 text-sm py-4">
                                                No gifts available
                                            </div>
                                        ) : (
                                            <GiftList
                                                gifts={gifts}
                                                onEdit={(gift) => {
                                                    setEditGift(gift);
                                                    setGiftTab("form");
                                                }}
                                                onDelete={(id) => {
                                                    const confirmDelete = window.confirm(
                                                        "Are you sure you want to delete this gift?"
                                                    );
                                                    if (confirmDelete) {
                                                        handleDeleteGift(id);
                                                    }
                                                }}
                                            />
                                        )}
                                    </>
                                )}

                                {giftTab === "form" && (
                                    <div className="bg-[#1a1a1a] p-3 rounded-xl">
                                        <GiftForm
                                            onSubmit={editGift ? handleUpdateGift : handleCreateGift}
                                            editData={editGift}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;