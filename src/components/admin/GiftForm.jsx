import { useState, useEffect } from "react";
import { uploadImage } from "../../api/upload";

const GiftForm = ({ onSubmit, editData }) => {
    const [form, setForm] = useState({
        name: "",
        coin_value: "",
        icon: null,
    });

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                coin_value: editData.coin_value,
                icon: null,
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        if (e.target.name === "icon") {
            setForm({ ...form, icon: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let iconUrl = "";

        // 1. Upload image
        if (form.icon) {
            const res = await uploadImage(form.icon);
            iconUrl = res.url;
        }

        // 2. Send JSON
        const data = {
            name: form.name,
            coin_value: Number(form.coin_value),
            icon: iconUrl,
        };

        onSubmit(data);

        setForm({ name: "", coin_value: "", icon: null });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">

            <input
                name="name"
                placeholder="Gift Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#0e0f0b] text-white p-2 rounded text-sm"
            />

            <input
                name="coin_value"
                type="number"
                placeholder="Coin Value"
                value={form.coin_value}
                onChange={handleChange}
                className="w-full bg-[#0e0f0b] text-white p-2 rounded text-sm"
            />

            <input
                type="file"
                name="icon"
                className="text-white text-sm"
                onChange={handleChange}
            />

            <button className="w-full bg-[#e98834] text-black py-2 rounded-lg text-sm font-medium">
                {editData ? "Update Gift" : "Create Gift"}
            </button>
        </form>
    );
};

export default GiftForm;