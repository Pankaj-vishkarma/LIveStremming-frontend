import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Splash from "./steps/Splash"
import Welcome from "./steps/Welcome"
import Email from "./steps/Email"
import Otp from "./steps/Otp"
import Dob from "./steps/Dob"
import Profile from "./steps/Profile"

export default function Onboarding() {
    const [step, setStep] = useState(0)
    const navigate = useNavigate()

    const next = () => setStep((prev) => prev + 1)

    const prev = () => setStep((prev) => prev - 1)

    const finish = () => {
        navigate("/feed")
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {step === 0 && <Splash next={next} />}
            {step === 1 && <Welcome next={next} />}
            {step === 2 && <Email next={next} prev={prev} />}
            {step === 3 && <Otp next={next} prev={prev} />}
            {step === 4 && <Dob next={next} />}
            {step === 5 && <Profile onFinish={finish} />}
        </div>
    )
}