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

    // AGE VALIDATION (UNCHANGED)
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
                next();
            },
            onError: (err) => {
                setError(
                    err?.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            },
        });
    };

    // NEW FLOW HANDLER (IMPORTANT)
    const handleNextStep = () => {
        if (step === "day") {
            if (!selectedDay) return setError("Please select day");
            setError("");
            setStep("month");
        } else if (step === "month") {
            if (!selectedMonth) return setError("Please select month");
            setError("");
            setStep("year");
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0e0f0b] flex justify-center">

            <div className="w-full max-w-[412px] min-h-screen flex flex-col justify-between text-white">

                {/* TOP */}
                <div>

                    <div className="px-4 sm:px-6 pt-6 font-museomoderno">
                        <h1 className="text-[24px] sm:text-[28px] font-medium">
                            Date of Birth
                        </h1>
                    </div>

                    <div className="px-4 sm:px-6 pt-4">
                        <div className="flex items-center gap-2 p-3 rounded-full bg-gradient-to-r from-[#ffbf7c33] to-transparent">
                            <img src="/alert-circle.png" className="w-5 h-5" />
                            <span className="text-[12px] sm:text-[14px] text-gray-300">
                                Don’t worry your Date of birth will be private
                            </span>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 pt-4 text-[13px] sm:text-[14px] text-gray-300">
                        Add your date of birth.
                    </div>

                    <div className="px-4 sm:px-6 pt-4">
                        <input
                            value={
                                selectedDay && selectedMonth && selectedYear
                                    ? `${selectedDay} ${selectedMonth} ${selectedYear}`
                                    : ""
                            }
                            placeholder="Enter DOB"
                            readOnly
                            className="w-full h-[45px] sm:h-[50px] bg-[#1a1a1a] rounded-[10px] px-4 outline-none text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="px-4 sm:px-6 pt-2 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* STEP BUTTONS */}
                    <div className="px-4 sm:px-6 pt-6 flex flex-wrap gap-2 text-[13px] sm:text-[14px]">
                        {["day", "month", "year"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStep(s)}
                                className={`px-4 py-2 rounded-full capitalize ${step === s
                                    ? "bg-[#e98834] text-black"
                                    : "bg-transparent text-white"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="px-4 sm:px-6 pt-4">

                        {/* DAY */}
                        {step === "day" && (
                            <div className="grid grid-cols-7 gap-2">
                                {days.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDay(d)}
                                        className={`aspect-square rounded-full flex items-center justify-center text-[12px] sm:text-[14px]
                                        ${selectedDay === d
                                                ? "bg-[#e98834] text-black"
                                                : "bg-[#1a1a1a] text-white"
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* MONTH */}
                        {step === "month" && (
                            <div className="grid grid-cols-4 gap-2 px-1 sm:px-2">
                                {months.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMonth(m)}
                                        className={`h-[38px] sm:h-[42px] text-[11px] sm:text-[13px] rounded-full flex items-center justify-center
                                        ${selectedMonth === m
                                                ? "bg-[#e98834] text-black"
                                                : "bg-[#1a1a1a] text-white"
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* YEAR */}
                        {step === "year" && (
                            <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => setSelectedYear(y)}
                                        className={`h-[38px] sm:h-[40px] text-[12px] sm:text-[13px] rounded-full flex items-center justify-center
                                        ${selectedYear === y
                                                ? "bg-[#e98834] text-black"
                                                : "bg-[#1a1a1a] text-white"
                                            }`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>

                </div>

                {/* BOTTOM BUTTON */}
                <div className="px-4 sm:px-6 pb-6">
                    <button
                        onClick={handleNextStep}
                        disabled={
                            isPending ||
                            (step === "day" && !selectedDay) ||
                            (step === "month" && !selectedMonth) ||
                            (step === "year" && !selectedYear)
                        }
                        className={`w-full h-[45px] sm:h-[50px] rounded-full font-semibold 
                        ${(step === "day" && !selectedDay) ||
                                (step === "month" && !selectedMonth) ||
                                (step === "year" && !selectedYear)
                                ? "bg-[#3a2713] text-gray-500"
                                : "bg-[#e98834] text-black"
                            }`}
                    >
                        {step === "year"
                            ? (isPending ? "Saving..." : "Submit")
                            : "Next"}
                    </button>
                </div>

            </div>
        </div>
    );
}