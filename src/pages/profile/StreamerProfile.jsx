import { useState, useEffect, useRef } from "react";
import avatarFallback from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

import { useStreamerMe, useUpdateStreamerProfile } from "../../hooks/useStreamer";
import { useUpdateProfile } from "../../hooks/useProfile";

import { startLive, endLive } from "../../api/liveApi";

const StreamerProfile = () => {
    const navigate = useNavigate();
    const fileRef = useRef();

    const { data, isLoading } = useStreamerMe();
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

    // LIVE
    const handleGoLive = async () => {
        try {
            setLiveLoading(true);
            await startLive();
            navigate(`/live/${data.channel_name}`);
            console.log("CHANNEL:", data.channel_name);
        } finally {
            setLiveLoading(false);
        }
    };

    const handleEndLive = async () => {
        setLiveLoading(true);
        await endLive();
        setLiveLoading(false);
    };

    // LOGOUT
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
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

                {/* AVATAR */}
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={previewImage || form.display_photo || avatarFallback}
                        onClick={handleImageClick}
                        className="w-20 h-20 rounded-full object-cover cursor-pointer"
                    />
                    <p className="text-white text-sm">{form.username}</p>

                    {isEdit && (
                        <span className="text-xs text-gray-400">
                            Tap to change
                        </span>
                    )}

                    <input
                        type="file"
                        ref={fileRef}
                        hidden
                        onChange={handleImageChange}
                    />
                </div>

                {/* USER */}
                <textarea
                    name="about_me"
                    value={form.about_me}
                    onChange={handleChange}
                    disabled={!isEdit}
                    placeholder="Bio"
                    className={`w-full p-2 rounded text-white text-sm 
${isEdit ? "bg-[#1a1a1a]" : "bg-[#111] text-gray-400 cursor-not-allowed"}`}
                />

                {/* STREAMER */}
                <input
                    name="channel_name"
                    value={form.channel_name}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`w-full p-2 rounded text-white text-sm 
${isEdit ? "bg-[#1a1a1a]" : "bg-[#111] text-gray-400 cursor-not-allowed"}`}
                />

                <textarea
                    name="channel_description"
                    value={form.channel_description}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`w-full p-2 rounded text-white text-sm 
${isEdit ? "bg-[#1a1a1a]" : "bg-[#111] text-gray-400 cursor-not-allowed"}`}
                />

                <input
                    name="categories"
                    value={form.categories}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`w-full p-2 rounded text-white text-sm 
${isEdit ? "bg-[#1a1a1a]" : "bg-[#111] text-gray-400 cursor-not-allowed"}`}
                />

                {/* BUTTONS */}
                {!isEdit ? (
                    <>
                        <button
                            onClick={() => setIsEdit(true)}
                            className="w-full bg-[#e98834] py-2 rounded"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-700 py-2 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={userLoading || streamerLoading}
                        className="w-full bg-green-500 py-2 rounded"
                    >
                        {userLoading || streamerLoading ? "Saving..." : "Save"}
                    </button>
                )}

                {/* LIVE */}
                {!data?.is_live ? (
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
        </div>
    );
};

export default StreamerProfile;