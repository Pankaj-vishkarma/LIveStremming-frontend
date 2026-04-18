import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Splash from "./steps/Splash";
import Welcome from "./steps/Welcome";
import Email from "./steps/Email";
import Otp from "./steps/Otp";
import Dob from "./steps/Dob";
import Profile from "./steps/Profile";

export default function Onboarding() {

    // STEP STATE (persisted)
    const [step, setStep] = useState(() => {
        return Number(localStorage.getItem("onboarding_step")) || 0;
    });

    // STEP DATA (persisted)
    const [stepData, setStepData] = useState(() => {
        const saved = localStorage.getItem("onboarding_data");
        return saved ? JSON.parse(saved) : {};
    });

    const navigate = useNavigate();

    // SAVE STEP ON CHANGE
    useEffect(() => {
        localStorage.setItem("onboarding_step", step);
    }, [step]);

    // SAVE DATA ON CHANGE
    useEffect(() => {
        try {
            localStorage.setItem("onboarding_data", JSON.stringify(stepData));
        } catch (err) {
            console.error("Storage Error:", err);
        }
    }, [stepData]);

    // NEXT STEP
    const next = (data = {}) => {
        // Only accept plain object
        if (typeof data !== "object" || data === null) {
            data = {};
        }

        // Remove unsafe values
        const safeData = {};

        Object.keys(data).forEach((key) => {
            const value = data[key];

            if (
                typeof value !== "function" &&
                typeof value !== "object" // avoid DOM/window
            ) {
                safeData[key] = value;
            }

            // allow simple objects only
            if (
                typeof value === "object" &&
                value !== null &&
                value.constructor === Object
            ) {
                safeData[key] = value;
            }
        });

        setStepData((prev) => ({
            ...prev,
            ...safeData,
        }));

        setStep((prev) => prev + 1);
    };

    // PREVIOUS STEP (Back button safe)
    const prev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    // FINISH (clear storage + redirect)
    const finish = () => {
        localStorage.removeItem("onboarding_step");
        localStorage.removeItem("onboarding_data");
        navigate("/feed");
    };

    return (
        <div className="min-h-screen bg-black text-white">

            {step === 0 && <Splash next={next} />}

            {step === 1 && <Welcome next={next} />}

            {step === 2 && <Email next={next} prev={prev} />}

            {step === 3 && <Otp next={next} prev={prev} data={stepData} />}

            {step === 4 && <Dob next={next} />}

            {step === 5 && <Profile onFinish={finish} />}

        </div>
    );
}