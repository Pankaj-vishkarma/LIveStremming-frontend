import { useState, useEffect, useRef } from "react";
import avatarFallback from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

import { useStreamerMe, useUpdateStreamerProfile } from "../../hooks/useStreamer";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useFollowStats } from "../../hooks/useFollowStats";

import { startLive, endLive } from "../../api/liveApi";
import { useQueryClient } from "@tanstack/react-query";

const StreamerProfile = () => {
    const navigate = useNavigate();
    const fileRef = useRef();
    const queryClient = useQueryClient();

    const { data, isLoading } = useStreamerMe();
    const {
        followersCount,
        followingCount,
        followers,
        following,
        isLoading: followLoading
    } = useFollowStats(data?.user_id);
    const { mutate: updateStreamer, isPending: streamerLoading } = useUpdateStreamerProfile();
    const { mutate: updateUser, isPending: userLoading } = useUpdateProfile();
    const { mutate: logout } = useLogout();

    const [form, setForm] = useState({
        username: "",
        about_me: "",
        display_photo: "",
        channel_name: "",
        channel_description: "",
        categories: "",
    });

    const [previewImage, setPreviewImage] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [liveLoading, setLiveLoading] = useState(false);
    const [section, setSection] = useState("profile");
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [selectedUserImage, setSelectedUserImage] = useState(null);
    const [isLiveLocal, setIsLiveLocal] = useState(null);

    useEffect(() => {
        if (data) {
            setForm({
                username: data.username || "",
                about_me: data.about_me || "",
                display_photo: data.display_photo || "",
                channel_name: data.channel_name || "",
                channel_description: data.channel_description || "",
                categories: data.categories?.join(", ") || "",
            });

            setPreviewImage("");
        }
    }, [data]);


    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    useEffect(() => {
        if (data?.is_live !== undefined) {
            setIsLiveLocal(data.is_live);
        }
    }, [data]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleImageClick = () => {
        if (isEdit) {
            fileRef.current.click();
        } else {
            setShowImageModal(true);
        }
    };

    // IMAGE CHANGE (preview only)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setPreviewImage(preview);
        }
    };

    // SAVE
    const handleSave = () => {
        const userPayload = {};

        if (form.about_me?.trim())
            userPayload.about_me = form.about_me.trim();

        if (!previewImage && form.display_photo) {
            userPayload.display_photo = form.display_photo;
        }

        if (Object.keys(userPayload).length > 0) {
            updateUser(userPayload);
        }

        const streamerPayload = {};

        if (form.channel_name?.trim())
            streamerPayload.channel_name = form.channel_name.trim();

        if (form.channel_description?.trim())
            streamerPayload.channel_description = form.channel_description.trim();

        if (form.categories?.trim()) {
            streamerPayload.categories = form.categories
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean);
        }

        if (Object.keys(streamerPayload).length > 0) {
            updateStreamer(streamerPayload);
        }

        setTimeout(() => {
            setIsEdit(false);
        }, 300);
    };


    const handleCancel = () => {
        if (data) {
            setForm({
                username: data.username || "",
                about_me: data.about_me || "",
                display_photo: data.display_photo || "",
                channel_name: data.channel_name || "",
                channel_description: data.channel_description || "",
                categories: data.categories?.join(", ") || "",
            });
        }

        setPreviewImage("");
        setIsEdit(false);
    };

    // LIVE
    const handleGoLive = async () => {
        try {
            setLiveLoading(true);

            setIsLiveLocal(true);

            await startLive();

            queryClient.invalidateQueries({ queryKey: ["streamer-me"] });

            navigate(`/live/${data.channel_name}`);
        } catch (err) {
            // rollback if fail
            setIsLiveLocal(false);
        } finally {
            setLiveLoading(false);
        }
    };

    const handleEndLive = async () => {
        try {
            setLiveLoading(true);

            setIsLiveLocal(false);

            await endLive();

            queryClient.invalidateQueries({ queryKey: ["streamer-me"] });

        } catch (err) {
            // rollback if fail
            setIsLiveLocal(true);
        } finally {
            setLiveLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {

                // IMPORTANT: onboarding state clear karo
                localStorage.removeItem("onboarding_step");
                localStorage.removeItem("onboarding_data");

                dispatch({ type: "auth/logout" });

                navigate("/", { replace: true });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-black flex justify-center items-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] px-4 pt-4 pb-24 space-y-4">

                {/* TOP NAVBAR */}
                <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-xl">
                    <button
                        onClick={() => setSection("profile")}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${section === "profile"
                            ? "bg-[#e98834] text-black"
                            : "text-gray-400"
                            }`}
                    >
                        Profile
                    </button>

                    <button
                        onClick={() => setSection("live")}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${section === "live"
                            ? "bg-[#e98834] text-black"
                            : "text-gray-400"
                            }`}
                    >
                        Live
                    </button>

                    <button
                        onClick={() => setSection("follow")}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${section === "follow"
                            ? "bg-[#e98834] text-black"
                            : "text-gray-400"
                            }`}
                    >
                        Follow
                    </button>
                </div>

                {/* ================= PROFILE SECTION ================= */}
                {section === "profile" && (
                    <div className="space-y-5">

                        {/* AVATAR + NAME */}
                        <div className="flex flex-col items-center gap-3">

                            <div className="relative">
                                <img
                                    src={
                                        previewImage ||
                                        form.display_photo ||
                                        data?.display_photo ||
                                        avatarFallback
                                    }
                                    onClick={handleImageClick}
                                    className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-[#2a2a2a]"
                                />

                                {isEdit && (
                                    <div className="absolute bottom-0 right-0 bg-[#e98834] text-black text-[10px] px-2 py-[2px] rounded-full">
                                        Edit
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-white text-[15px] font-semibold">
                                    {form.username || data?.username}
                                </p>

                                <p className="text-gray-400 text-[11px]">
                                    @{form.channel_name || data?.channel_name}
                                </p>
                            </div>

                            {isEdit && (
                                <span className="text-xs text-gray-400">
                                    Tap profile image to change
                                </span>
                            )}

                            <input
                                type="file"
                                ref={fileRef}
                                hidden
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* PROFILE FORM */}
                        <div className="bg-[#1a1a1a] p-4 rounded-2xl space-y-3">

                            {/* BIO */}
                            <textarea
                                name="about_me"
                                value={form.about_me ?? data?.about_me ?? ""}
                                onChange={handleChange}
                                disabled={!isEdit}
                                placeholder="Bio"
                                className={`w-full p-2 rounded text-white text-sm ${isEdit
                                    ? "bg-[#111]"
                                    : "bg-[#0f0f0f] text-gray-400 cursor-not-allowed"
                                    }`}
                            />

                            {/* CHANNEL NAME */}
                            <input
                                name="channel_name"
                                value={form.channel_name ?? data?.channel_name ?? ""}
                                onChange={handleChange}
                                disabled={!isEdit}
                                placeholder="Channel name"
                                className={`w-full p-2 rounded text-white text-sm ${isEdit
                                    ? "bg-[#111]"
                                    : "bg-[#0f0f0f] text-gray-400 cursor-not-allowed"
                                    }`}
                            />

                            {/* DESCRIPTION */}
                            <textarea
                                name="channel_description"
                                value={form.channel_description ?? data?.channel_description ?? ""}
                                onChange={handleChange}
                                disabled={!isEdit}
                                placeholder="Channel description"
                                className={`w-full p-2 rounded text-white text-sm ${isEdit
                                    ? "bg-[#111]"
                                    : "bg-[#0f0f0f] text-gray-400 cursor-not-allowed"
                                    }`}
                            />

                            {/* CATEGORIES */}
                            <input
                                name="categories"
                                value={form.categories ?? ""}
                                onChange={handleChange}
                                disabled={!isEdit}
                                placeholder="Categories (comma separated)"
                                className={`w-full p-2 rounded text-white text-sm ${isEdit
                                    ? "bg-[#111]"
                                    : "bg-[#0f0f0f] text-gray-400 cursor-not-allowed"
                                    }`}
                            />

                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="space-y-2">

                            {!isEdit ? (
                                <>
                                    <button
                                        onClick={() => setIsEdit(true)}
                                        className="w-full bg-[#e98834] text-black py-2 rounded-full text-sm font-medium"
                                    >
                                        Edit Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-[#2a2a2a] text-white py-2 rounded-full text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2">

                                    <button
                                        onClick={handleSave}
                                        disabled={userLoading || streamerLoading}
                                        className="flex-1 bg-green-500 py-2 rounded-full text-sm font-medium"
                                    >
                                        {userLoading || streamerLoading ? "Saving..." : "Save"}
                                    </button>

                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-[#2a2a2a] text-white py-2 rounded-full text-sm font-medium"
                                    >
                                        Cancel
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>
                )}

                {/* ================= LIVE SECTION ================= */}
                {section === "live" && (
                    <div className="space-y-4">
                        <h3 className="text-white text-sm font-semibold">
                            Live Controls
                        </h3>

                        {!isLiveLocal ? (
                            <button
                                onClick={handleGoLive}
                                className="w-full bg-red-500 py-2 rounded"
                            >
                                🔴 Go Live
                            </button>
                        ) : (
                            <button
                                onClick={handleEndLive}
                                className="w-full bg-gray-800 py-2 rounded"
                            >
                                End Live
                            </button>
                        )}
                    </div>
                )}

                {/* ================= FOLLOW SECTION ================= */}
                {section === "follow" && (
                    <div className="space-y-5">

                        {/* HEADER */}
                        <h3 className="text-white text-sm font-semibold text-center">
                            Followers & Following
                        </h3>

                        {/* STATS CARD */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-4 flex justify-around items-center">

                            {/* FOLLOWERS */}
                            <div className="flex flex-col items-center">
                                <p className="text-white text-lg font-semibold">
                                    {followLoading ? "..." : followersCount}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Followers
                                </p>
                            </div>

                            {/* DIVIDER */}
                            <div className="w-[1px] h-8 bg-gray-700" />

                            {/* FOLLOWING */}
                            <div className="flex flex-col items-center">
                                <p className="text-white text-lg font-semibold">
                                    {followLoading ? "..." : followingCount}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Following
                                </p>
                            </div>

                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2">

                            <button
                                onClick={() => setShowFollowersModal(true)}
                                className="flex-1 bg-[#e98834] text-black py-2 rounded-full text-sm font-medium"
                            >
                                View Followers
                            </button>

                            <button
                                onClick={() => setShowFollowingModal(true)}
                                className="flex-1 bg-[#2a2a2a] text-white py-2 rounded-full text-sm font-medium"
                            >
                                View Following
                            </button>

                        </div>

                        {/* EMPTY STATE */}
                        <div className="text-center text-gray-500 text-xs mt-4">
                            No followers yet
                        </div>

                    </div>
                )}
            </div>

            {/* IMAGE MODAL */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={previewImage || form.display_photo || avatarFallback}
                            className="max-w-[90vw] max-h-[80vh] rounded-lg"
                        />
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-2 right-2 bg-white text-black px-2 rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {showFollowersModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

                    <div className="w-[90%] max-w-[400px] bg-[#1a1a1a] rounded-2xl p-4">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-white text-sm font-semibold">
                                Followers
                            </p>

                            <button
                                onClick={() => setShowFollowersModal(false)}
                                className="text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* LIST */}
                        <div className="max-h-[300px] overflow-y-auto space-y-3">

                            {followers.length === 0 ? (
                                <p className="text-gray-400 text-xs text-center">
                                    No followers yet
                                </p>
                            ) : (
                                followers.map((user, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() =>
                                            setSelectedUserImage(user.display_photo || avatarFallback)
                                        }
                                    >
                                        <img
                                            src={
                                                user.display_photo
                                                    ? user.display_photo
                                                    : avatarFallback
                                            }
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                        <p className="text-white text-sm">
                                            {user.username}
                                        </p>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>
            )}

            {showFollowingModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

                    <div className="w-[90%] max-w-[400px] bg-[#1a1a1a] rounded-2xl p-4">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-white text-sm font-semibold">
                                Following
                            </p>

                            <button
                                onClick={() => setShowFollowingModal(false)}
                                className="text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* LIST */}
                        <div className="max-h-[300px] overflow-y-auto space-y-3">

                            {following.length === 0 ? (
                                <p className="text-gray-400 text-xs text-center">
                                    Not following anyone
                                </p>
                            ) : (
                                following.map((user, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() =>
                                            setSelectedUserImage(user.display_photo || avatarFallback)
                                        }
                                    >
                                        <img
                                            src={
                                                user.display_photo
                                                    ? user.display_photo
                                                    : avatarFallback
                                            }
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                        <p className="text-white text-sm">
                                            {user.username}
                                        </p>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>
            )}

            {selectedUserImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex justify-center items-center z-[60]"
                    onClick={() => setSelectedUserImage(null)}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedUserImage}
                            className="max-w-[90vw] max-h-[80vh] rounded-lg object-contain"
                        />

                        <button
                            onClick={() => setSelectedUserImage(null)}
                            className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreamerProfile;