import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "../../hooks/useAdminAuth";

export default function AdminLogin() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const { mutate, isPending } = useAdminLogin();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = () => {
        mutate(form, {
            onSuccess: () => {
                navigate("/admin/dashboard");
            },
            onError: () => {
                alert("Invalid email or password");
            },
        });
    };

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] h-screen flex items-center justify-center px-3 sm:px-4">

                <div className="w-full bg-[#1a1a1a] rounded-[18px] p-5 space-y-4">

                    <h2 className="text-white text-sm text-center font-medium">
                        Admin Login
                    </h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-[#0e0f0b] text-white text-[12px] px-4 py-2.5 rounded-full outline-none placeholder-gray-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-[#0e0f0b] text-white text-[12px] px-4 py-2.5 rounded-full outline-none placeholder-gray-400"
                    />

                    <button
                        onClick={handleLogin}
                        disabled={isPending}
                        className={`w-full py-2.5 rounded-full text-[12px] font-medium
                        ${isPending
                                ? "bg-[#e98834]/60 text-black"
                                : "bg-[#e98834] text-black"
                            }`}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>

                </div>

            </div>
        </div>
    );
}