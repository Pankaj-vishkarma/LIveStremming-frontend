import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { setUser, clearUser } from "./store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./api/profile";

export default function App() {
  const dispatch = useDispatch();

  // auth flag (important)
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    enabled: isAuth, // only run when user logged in
    refetchOnWindowFocus: false, // optional (avoid extra calls)
  });

  useEffect(() => {
    if (!isFetched) return;

    if (data) {
      dispatch(setUser(data));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [data, isError, isFetched, dispatch]);

  return <AppRoutes />;
}