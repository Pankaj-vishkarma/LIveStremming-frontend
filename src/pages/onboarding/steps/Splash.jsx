import { useEffect } from "react"

export default function Splash({ next }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            next()
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full min-h-screen bg-gray flex justify-center">

            <div className="w-full max-w-[412px] min-h-screen flex items-center justify-center">

                <h1 className="text-[40px] font-bold font-museomoderno text-sandybrown">
                    VoxyLive
                </h1>

            </div>

        </div>
    )
}