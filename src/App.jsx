import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { useProfile } from "./hooks/useProfile";
import { setUser } from "./store/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { data } = useProfile();

  useEffect(() => {
    if (data && !user) {
      dispatch(setUser(data));
    }
  }, [data]);

  return <AppRoutes />;
}