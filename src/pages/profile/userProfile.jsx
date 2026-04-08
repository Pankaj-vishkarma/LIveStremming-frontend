import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import avatarFallback from "../../assets/avatar.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";
import { uploadImage } from "../../api/upload";
import ApplyStreamerCard from "../../components/profle/ApplyStreamerCard";
import axios from "../../api/axios";

const UserProfile = () => {

    const { data, isLoading, isError } = useProfile();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const user = data?.data || {};

    const [isEditing, setIsEditing] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        about_me: ""
    });

    const [uploading, setUploading] = useState(false);
    const [bioError, setBioError] = useState("");

    // FIXED STATES
    const [localImage, setLocalImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleEdit = () => {
        setFormData({
            username: user?.username || "",
            about_me: user?.about_me || ""
        });
        setLocalImage(null);
        setSelectedFile(null);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
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

    // FIXED SAVE (avatar upload moved here)
    const handleSave = async () => {
        try {
            const trimmedBio = formData.about_me.trim();

            if (!trimmedBio) return setBioError("Bio cannot be empty");

            let imageUrl = user?.display_photo;

            //  upload only on save
            if (selectedFile) {
                setUploading(true);
                const uploadRes = await uploadImage(selectedFile);
                imageUrl = uploadRes.url;
            }

            queryClient.setQueryData(["profile"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        about_me: trimmedBio,
                        display_photo: imageUrl,
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

    //  FIXED IMAGE SELECT (NO API CALL)
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

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
        } catch { }

        queryClient.clear();
        dispatch({ type: "auth/logout" });
        navigate("/", { replace: true });
    };

    if (isLoading) {
        return <div className="px-4 pt-4 text-white">Loading...</div>;
    }

    if (isError) {
        return <div className="px-4 pt-4 text-red-500">Failed to load profile</div>;
    }

    return (
        <>
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

                <div className="w-full max-w-[412px] px-4 sm:px-5 pt-4 pb-24 space-y-5">

                    <div className="flex items-center gap-4">

                        <div className="relative flex-shrink-0">

                            <img
                                src={localImage || user?.display_photo || avatarFallback}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover cursor-pointer"
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
                                <h2 className="text-[16px] sm:text-lg font-semibold text-white">
                                    {user?.username || "User"}
                                </h2>
                            )}

                            <p className="text-[11px] sm:text-xs text-gray-400 break-all">
                                {user?.email || "No email"}
                            </p>
                        </div>

                    </div>

                    <div className="bg-[#1a1a1a] rounded-xl p-3">
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

                    <div className="flex justify-between text-center">
                        <div>
                            <p className="text-sm font-semibold text-white">120</p>
                            <p className="text-xs text-gray-400">Followers</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">80</p>
                            <p className="text-xs text-gray-400">Following</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">0</p>
                            <p className="text-xs text-gray-400">Coins</p>
                        </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-medium">
                                    Save
                                </button>
                                <button onClick={handleCancel} className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-medium">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEdit} className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-medium">
                                    Edit Profile
                                </button>
                                <button onClick={handleLogout} className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-medium">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {!isEditing && <ApplyStreamerCard />}

                </div>
            </div>

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
        </>
    );
};

export default UserProfile;