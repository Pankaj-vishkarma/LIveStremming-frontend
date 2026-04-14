import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import avatarFallback from "../../assets/avatar.png";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "../../api/profile";
import { useLogout } from "../../hooks/useLogout";
import { uploadImage } from "../../api/upload";

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

const AdminProfile = () => {
    const { data: profileData, isLoading, isError } = useProfile();
    const [activeTab, setActiveTab] = useState("pending");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: logout } = useLogout();

    const user = profileData || {};

    // ADMIN REQUESTS
    const {
        data: requests,
        isLoading: requestsLoading,
        isError: requestsError,
        error: requestsErrorData,
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

    // PROFILE STATES (same as user)
    const [isEditing, setIsEditing] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        about_me: "",
    });

    const [uploading, setUploading] = useState(false);
    const [bioError, setBioError] = useState("");

    const [localImage, setLocalImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [section, setSection] = useState("profile");

    const [giftTab, setGiftTab] = useState("list");
    const [gifts, setGifts] = useState([]);
    const [editGift, setEditGift] = useState(null);

    // ================= EDIT =================
    const handleEdit = () => {
        setFormData({
            username: user?.username || "",
            about_me: user?.about_me || "",
        });
        setLocalImage(null);
        setSelectedFile(null);
        setIsEditing(true);
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "about_me") {
            const trimmed = value.trim();

            if (!trimmed) return setBioError("Bio cannot be empty");
            if (trimmed.length < 3) return setBioError("Bio must be at least 3 characters");
            if (trimmed.length > 150) return setBioError("Bio cannot exceed 150 characters");
            if (/^\d+$/.test(trimmed)) return setBioError("Bio cannot contain only numbers");
            if (!/[a-zA-Z]{2,}/.test(trimmed)) return setBioError("Please enter a meaningful bio");
            if (/(.)\1{4,}/.test(trimmed)) return setBioError("Bio cannot contain repeated characters");
            if (/[^a-zA-Z0-9\s.,!?'-]/.test(trimmed)) return setBioError("Bio contains invalid characters");

            setBioError("");
        }
    };

    // ================= SAVE =================
    const handleSave = async () => {
        try {
            const trimmedBio = formData.about_me.trim();

            if (!trimmedBio) return setBioError("Bio cannot be empty");

            let imageUrl = user?.display_photo;

            if (selectedFile) {
                setUploading(true);
                const uploadRes = await uploadImage(selectedFile);
                imageUrl = uploadRes.url;
            }

            // optimistic update
            queryClient.setQueryData(["profile"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        about_me: trimmedBio,
                        display_photo: imageUrl,
                        username: formData.username,
                    },
                };
            });

            await updateProfile({
                ...formData,
                about_me: trimmedBio,
                display_photo: imageUrl,
            });

            queryClient.invalidateQueries(["profile"]);

            setIsEditing(false);
            setLocalImage(null);
            setSelectedFile(null);
            setBioError("");
        } catch (error) {
            console.error(error);
            queryClient.invalidateQueries(["profile"]);
        } finally {
            setUploading(false);
        }
    };

    // ================= IMAGE =================
    const handleAvatarChange = (e) => {
        if (!isEditing) return;

        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setLocalImage(null);
        setSelectedFile(null);
        setBioError("");
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
                dispatch({ type: "auth/logout" });

                navigate("/", { replace: true });
            },
        });
    };

    // ================= STATES =================
    if (isLoading || requestsLoading) {
        return (
            <div className="px-4 pt-4 text-white">Loading...</div>
        );
    }

    if (isError) {
        return (
            <div className="px-4 pt-4 text-red-500">
                Failed to load profile
            </div>
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
                            onClick={() => setSection("profile")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${section === "profile"
                                    ? "bg-[#e98834] text-black"
                                    : "text-gray-400"
                                }`}
                        >
                            Profile
                        </button>

                        <button
                            onClick={() => setSection("requests")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${section === "requests"
                                    ? "bg-[#e98834] text-black"
                                    : "text-gray-400"
                                }`}
                        >
                            Requests
                        </button>

                        <button
                            onClick={() => setSection("gifts")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${section === "gifts"
                                    ? "bg-[#e98834] text-black"
                                    : "text-gray-400"
                                }`}
                        >
                            Gifts
                        </button>

                    </div>

                    {/* HEADER */}
                    {section === "profile" && (
                        <>
                            <div className="flex items-center gap-4 bg-[#1a1a1a] rounded-xl p-3">

                                <div className="relative flex-shrink-0">
                                    <img
                                        src={localImage || user?.display_photo || avatarFallback}
                                        className="w-16 h-16 rounded-full object-cover border border-[#2a2a2a] object-cover cursor-pointer"
                                        onClick={() => !isEditing && setShowAvatarModal(true)}
                                    />

                                    {isEditing && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleAvatarChange}
                                        />
                                    )}

                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-xs text-white">
                                            Uploading...
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">

                                    {isEditing ? (
                                        <input
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a1a1a] text-white text-sm px-2 py-1 rounded"
                                        />
                                    ) : (
                                        <h2 className="text-base font-semibold font-semibold text-white">
                                            {user?.username || "Admin"}
                                        </h2>
                                    )}

                                    <p className="text-[11px] sm:text-xs text-gray-400 break-all">
                                        {user?.email}
                                    </p>
                                </div>

                            </div>

                            {/* ABOUT */}
                            <div className="bg-[#1a1a1a] rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">About</p>

                                {isEditing ? (
                                    <>
                                        <textarea
                                            name="about_me"
                                            value={formData.about_me}
                                            onChange={handleChange}
                                            className="w-full bg-[#0e0f0b] text-white text-sm p-2 rounded resize-none"
                                        />
                                        {bioError && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {bioError}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-white break-words">
                                        {user?.about_me || "No bio added"}
                                    </p>
                                )}
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-semibold">
                                            Save
                                        </button>
                                        <button onClick={handleCancel} className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-semibold">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleEdit} className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-semibold">
                                            Edit Profile
                                        </button>
                                        <button onClick={handleLogout} className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-semibold">
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>

                        </>
                    )}

                    {/* ADMIN REQUESTS (UNCHANGED + INTEGRATED) */}
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
                                            : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a]"
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

                    {/*  GIFT MANAGEMENT */}
                    {section === "gifts" && (

                        <div className="space-y-3">
                            <h3 className="text-sm text-white font-semibold">
                                Gift Management
                            </h3>

                            {/* Tabs */}
                            <div className="flex gap-2 mt-2 bg-[#1a1a1a] p-1 rounded-xl">

                                <button
                                    onClick={() => {
                                        setGiftTab("list");
                                        setEditGift(null);
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${giftTab === "list"
                                            ? "bg-[#e98834] text-black shadow-md"
                                            : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a]"
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

                            {/* CONTENT */}
                            <div className="space-y-2 mt-3">

                                {/* LIST */}
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

                                {/* FORM */}
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

                {/* AVATAR MODAL */}
                {showAvatarModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                        <div className="relative">
                            <img
                                src={localImage || user?.display_photo || avatarFallback}
                                className="w-60 h-60 sm:w-64 sm:h-64 object-cover rounded-xl"
                            />
                            <button
                                onClick={() => setShowAvatarModal(false)}
                                className="absolute -top-3 -right-3 bg-white text-black w-6 h-6 rounded-full text-xs flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default AdminProfile;