import { useState } from "react";
import { useUpdateProfile } from "../../../hooks/useUpdateProfile";

export default function DobStep({ next }) {
    const [step, setStep] = useState("day");
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [error, setError] = useState("");

    const { mutate, isPending } = useUpdateProfile();

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 50 }, (_, i) => 1970 + i);

    const isComplete = selectedDay && selectedMonth && selectedYear;

    // ✅ AGE VALIDATION (18+)
    const is18Plus = () => {
        if (!isComplete) return false;

        const monthIndex = months.indexOf(selectedMonth);
        const dob = new Date(selectedYear, monthIndex, selectedDay);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age >= 18;
    };

    const handleSubmit = () => {
        setError("");

        if (!isComplete) {
            setError("Please select complete date");
            return;
        }

        if (!is18Plus()) {
            setError("You must be at least 18 years old");
            return;
        }

        const monthIndex = months.indexOf(selectedMonth) + 1;

        const formattedDOB = `${selectedYear}-${String(monthIndex).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

        const payload = {
            date_of_birth: formattedDOB,
        };

        mutate(payload, {
            onSuccess: () => {
                next(); // only after success
            },
            onError: (err) => {
                setError(
                    err?.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            },
        });
    };

    return (
        <div className="w-[412px] mx-auto min-h-screen bg-[#0e0f0b] flex flex-col justify-between text-white">

            {/* TOP */}
            <div>

                <div className="px-6 pt-6 font-museomoderno">
                    <h1 className="text-[28px] font-medium">
                        Date of Birth
                    </h1>
                </div>

                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2 p-3 rounded-full bg-gradient-to-r from-[#ffbf7c33] to-transparent">
                        <img src="/alert-circle.png" className="w-5 h-5" />
                        <span className="text-[14px] text-gray-300">
                            Don’t worry your Date of birth will be private
                        </span>
                    </div>
                </div>

                <div className="px-6 pt-4 text-[14px] text-gray-300">
                    Add your date of birth.
                </div>

                <div className="px-6 pt-4">
                    <input
                        value={
                            selectedDay && selectedMonth && selectedYear
                                ? `${selectedDay} ${selectedMonth} ${selectedYear}`
                                : ""
                        }
                        placeholder="Enter DOB"
                        readOnly
                        className="w-full h-[50px] bg-[#1a1a1a] rounded-[10px] px-4 outline-none text-gray-400"
                    />
                </div>

                {/* ❗ ERROR MESSAGE */}
                {error && (
                    <div className="px-6 pt-2 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="px-6 pt-6 flex gap-3 text-[14px]">

                    <button
                        onClick={() => setStep("day")}
                        className={`px-4 py-2 rounded-full ${step === "day"
                            ? "bg-[#e98834] text-black"
                            : "bg-transparent text-white"
                            }`}
                    >
                        Day
                    </button>

                    <button
                        onClick={() => setStep("month")}
                        className={`px-4 py-2 rounded-full ${step === "month"
                            ? "bg-[#e98834] text-black"
                            : "bg-transparent text-white"
                            }`}
                    >
                        Month
                    </button>

                    <button
                        onClick={() => setStep("year")}
                        className={`px-4 py-2 rounded-full ${step === "year"
                            ? "bg-[#e98834] text-black"
                            : "bg-transparent text-white"
                            }`}
                    >
                        Year
                    </button>
                </div>

                <div className="px-6 pt-4">

                    {step === "day" && (
                        <div className="flex flex-wrap gap-2">
                            {days.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDay(d)}
                                    className={`w-[46px] h-[46px] rounded-full ${selectedDay === d
                                        ? "bg-[#e98834] text-black"
                                        : "bg-[#1a1a1a]"
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === "month" && (
                        <div className="flex flex-wrap gap-2">
                            {months.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMonth(m)}
                                    className={`px-4 py-2 rounded-full ${selectedMonth === m
                                        ? "bg-[#e98834]"
                                        : "bg-[#1a1a1a]"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === "year" && (
                        <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                            {years.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setSelectedYear(y)}
                                    className={`px-4 py-2 rounded-full ${selectedYear === y
                                        ? "bg-[#e98834] text-black"
                                        : "bg-[#1a1a1a]"
                                        }`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}

                </div>

            </div>

            {/* BOTTOM */}
            <div className="px-6 pb-6">
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete || isPending}
                    className={`w-full h-[50px] rounded-full font-semibold ${isComplete
                        ? "bg-[#e98834] text-black"
                        : "bg-[#3a2713] text-gray-500"
                        }`}
                >
                    {isPending ? "Saving..." : "Next"}
                </button>
            </div>

        </div>
    );
}