import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const queryClient = useQueryClient();

    // React Query cache
    const cachedUser = queryClient.getQueryData(["profile"]);

    // Redux state
    const { isAuthChecked } = useSelector((state) => state.auth);

    // wait for auth check
    if (!isAuthChecked) {
        return (
            <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">
                <div className="w-full max-w-[412px] h-screen overflow-y-auto px-3 sm:px-4 pt-4 pb-24 space-y-4">

                    {/* TABS SKELETON */}
                    <div className="flex gap-2 overflow-x-auto">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-6 w-16 bg-[#1a1a1a] rounded-full animate-pulse"
                            />
                        ))}
                    </div>

                    {/* GRID SKELETON */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-[18px] overflow-hidden bg-[#1a1a1a]"
                            >
                                <div className="w-full aspect-[3/4] bg-[#242424]" />

                                <div className="p-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-[#242424]" />
                                        <div className="flex-1 space-y-1">
                                            <div className="h-2 bg-[#242424] rounded w-3/4" />
                                            <div className="h-2 bg-[#242424] rounded w-1/2" />
                                        </div>
                                    </div>

                                    <div className="h-5 bg-[#242424] rounded-full w-16 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }


    if (!cachedUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;