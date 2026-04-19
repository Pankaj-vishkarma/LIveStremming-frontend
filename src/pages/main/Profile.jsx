import { useSelector } from "react-redux";
import UserProfile from "../profile/userProfile";
import StreamerProfile from "../profile/StreamerProfile";
//import AdminProfile from "../profile/AdminProfile";

export default function Profile() {
    const { user, isAuthChecked } = useSelector((state) => state.auth);



    // wait for auth check
    if (!isAuthChecked) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
                <div className="w-full max-w-[412px] px-4 pt-4 text-white">
                    Loading...
                </div>
            </div>
        );
    }

    /* // Admin
     if (user.role === "admin") {
         return <AdminProfile />;
     }*/

    // Streamer
    if (user.role === "streamer") {
        return <StreamerProfile />;
    }

    //  Default user
    return <UserProfile />;
}