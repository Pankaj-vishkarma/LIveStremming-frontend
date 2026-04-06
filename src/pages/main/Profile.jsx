import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import avatarFallback from "../../assets/avatar.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";
import { uploadImage } from "../../api/upload";
import axios from "../../api/axios";

const Profile = () => {

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

    const handleEdit = () => {
        setFormData({
            username: user?.username || "",
            about_me: user?.about_me || ""
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            queryClient.invalidateQueries(["profile"]);
            setIsEditing(false);
        } catch (error) {
            console.error("Update profile error:", error);
        }
    };

    //  AVATAR CLICK LOGIC
    const handleAvatarClick = () => {
        if (!isEditing) {
            setShowAvatarModal(true); // popup open
        }
    };

    //  AVATAR UPLOAD (ONLY IN EDIT MODE)
    const handleAvatarChange = async (e) => {
        if (!isEditing) return;

        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);

            const uploadRes = await uploadImage(file);
            const imageUrl = uploadRes.url;

            await updateProfile({
                display_photo: imageUrl,
            });

            queryClient.invalidateQueries(["profile"]);

        } catch (error) {
            console.error("Avatar upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    //  LOGOUT WITH BACKEND
    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.log("Logout API error (ignored)");
        }

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
            <div className="px-4 pt-4 pb-28 space-y-5">

                {/* USER INFO */}
                <div className="flex items-center gap-4">

                    {/* AVATAR */}
                    <div className="relative">

                        <img
                            src={user?.display_photo || avatarFallback}
                            className="w-20 h-20 rounded-full object-cover cursor-pointer"
                            onClick={handleAvatarClick}
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
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-xs">
                                Uploading...
                            </div>
                        )}
                    </div>

                    {/* USER TEXT */}
                    <div>
                        {isEditing ? (
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="bg-[#1a1a1a] text-white text-sm px-2 py-1 rounded"
                            />
                        ) : (
                            <h2 className="text-lg font-semibold text-white">
                                {user?.username || "User"}
                            </h2>
                        )}

                        <p className="text-xs text-gray-400">
                            {user?.email || "No email"}
                        </p>
                    </div>

                </div>

                {/* ABOUT */}
                <div className="bg-[#1a1a1a] rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">About</p>

                    {isEditing ? (
                        <textarea
                            name="about_me"
                            value={formData.about_me}
                            onChange={handleChange}
                            className="w-full bg-[#0e0f0b] text-white text-sm p-2 rounded"
                        />
                    ) : (
                        <p className="text-sm text-white">
                            {user?.about_me || "No bio added"}
                        </p>
                    )}
                </div>

                {/* STATS */}
                <div className="flex justify-between text-center">
                    <div>
                        <p className="text-white text-sm font-semibold">120</p>
                        <p className="text-xs text-gray-400">Followers</p>
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">80</p>
                        <p className="text-xs text-gray-400">Following</p>
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">0</p>
                        <p className="text-xs text-gray-400">Coins</p>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="flex-1 bg-[#e98834] text-black py-2 rounded-lg text-sm font-medium">
                                Save
                            </button>

                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-lg text-sm font-medium">
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

            </div>

            {/* AVATAR POPUP */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

                    <div className="relative">

                        <img
                            src={user?.display_photo || avatarFallback}
                            className="w-64 h-64 object-cover rounded-xl"
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

export default Profile;