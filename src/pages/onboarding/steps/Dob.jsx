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

        mutate(
            { date_of_birth: formattedDOB },
            {
                onSuccess: () => next(),
                onError: (err) =>
                    setError(err?.response?.data?.message || "Something went wrong"),
            }
        );
    };

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

            <div className="w-full max-w-[412px] min-h-screen flex flex-col justify-between text-white px-4 sm:px-6 py-4">

                {/* TOP */}
                <div className="flex flex-col justify-between h-full ">

                    <div className="space-y-4">

                        <h1 className="text-[22px] sm:text-[26px] font-medium font-museomoderno">
                            Date of Birth
                        </h1>

                        <div className="flex items-center gap-2 p-2 sm:p-3 rounded-full bg-gradient-to-r from-[#ffbf7c33] to-transparent">
                            <img src="/alert-circle.png" className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-[11px] sm:text-[13px] text-gray-300">
                                Don’t worry your Date of birth will be private
                            </span>
                        </div>

                        <p className="text-[12px] sm:text-[13px] text-gray-300">
                            Add your date of birth.
                        </p>

                        <input
                            value={
                                selectedDay && selectedMonth && selectedYear
                                    ? `${selectedDay} ${selectedMonth} ${selectedYear}`
                                    : ""
                            }
                            placeholder="Enter DOB"
                            readOnly
                            className="w-full h-[44px] px-6 sm:h-[48px] rounded-[10px] bg-[#1a1a1a] text-sm sm:text-base font-inter cursor-pointer placeholder:text-[10px]"
                        />

                        {error && (
                            <p className="text-red-500 text-xs">{error}</p>
                        )}

                    </div>

                    <div className="flex flex-col gap-[14px] mb-[25px]">
                        {/* STEP BUTTONS (FIXED) */}
                        <div className="flex justify-between gap-2 text-[12px] sm:text-[14px] UP w-[56%] font-inter">
                            {["day", "month", "year"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStep(s)}
                                    className={`flex-1 h-[32px] sm:h-[36px] rounded-full capitalize
                                ${step === s
                                            ? "bg-[#361900] text-white"
                                            : "bg-[#1a1a1a] text-white"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* CONTENT */}
                        <div className="LP h-[250px]">

                            {step === "day" && (
                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setSelectedDay(d)}
                                            className={`aspect-square rounded-full text-xs sm:text-sm font-inter
                                        ${selectedDay === d
                                                    ? "bg-[#e98834] text-white"
                                                    : "bg-[#1a1a1a]"
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === "month" && (
                                <div className="grid grid-cols-4 gap-2">
                                    {months.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setSelectedMonth(m)}
                                            className={`h-[36px] sm:h-[40px] text-xs sm:text-sm rounded-full font-inter
                                        ${selectedMonth === m
                                                    ? "bg-[#e98834] text-black"
                                                    : "bg-[#1a1a1a]"
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === "year" && (
                                <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto no-scrollbar">
                                    {years.map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => setSelectedYear(y)}
                                            className={`h-[36px] sm:h-[40px] text-xs sm:text-sm rounded-full font-inter
                                        ${selectedYear === y
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

                </div>

                {/* BUTTON */}
                <button
                    onClick={handleNextStep}
                    disabled={
                        isPending ||
                        (step === "day" && !selectedDay) ||
                        (step === "month" && !selectedMonth) ||
                        (step === "year" && !selectedYear)
                    }
                    className={`w-full h-[44px] sm:h-[48px] rounded-full font-inter text-sm
                    ${(step === "day" && !selectedDay) ||
                            (step === "month" && !selectedMonth) ||
                            (step === "year" && !selectedYear)
                            ? "bg-[#3a2713] text-gray-500"
                            : "bg-[#e98834] text-black"
                        }`}
                >
                    {step === "year" ? (isPending ? "Saving..." : "Submit") : "Next"}
                </button>

            </div>
        </div>
    );
}