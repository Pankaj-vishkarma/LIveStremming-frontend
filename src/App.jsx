import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { setUser, clearUser } from "./store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./api/profile";

export default function App() {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      dispatch(setUser(data));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [data, isLoading, isError, dispatch]);

  return <AppRoutes />;
}