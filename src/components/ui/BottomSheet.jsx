import { useRef, useState } from "react";
import { useEffect } from "react";

export default function BottomSheet({ onClose, onSelect }) {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [error, setError] = useState("");
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    // ==========================
    // GALLERY
    // ==========================
    const handleGalleryClick = () => {
        try {
            setError("");
            fileInputRef.current?.click();
        } catch {
            setError("Unable to open gallery");
        }
    };

    const handleGalleryChange = (e) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB");
                return;
            }

            onSelect && onSelect(file);
        } catch {
            setError("Failed to select image");
        }
    };

    // ==========================
    // CAMERA OPEN (ALL DEVICES)
    // ==========================
    const handleCameraClick = async () => {
        try {
            setError("");

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera not supported");
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });

            setStream(mediaStream);
            setIsCameraOpen(true);

            // ❗ DO NOT attach here

        } catch (err) {
            console.error("Camera Error:", err);

            setError("Camera not supported, opening gallery...");

            setTimeout(() => {
                fileInputRef.current?.click();
            }, 500);
        }
    };

    // ==========================
    // CAPTURE PHOTO
    // ==========================
    const handleCapture = () => {
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas) return;

            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return;

                const file = new File([blob], "selfie.jpg", {
                    type: "image/jpeg",
                });

                onSelect && onSelect(file);

                // stop camera
                stream?.getTracks().forEach((track) => track.stop());

                setIsCameraOpen(false);
            }, "image/jpeg");

        } catch {
            setError("Failed to capture image");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center">

            <div className="w-full max-w-[412px] bg-[#1a1a1a] rounded-t-[20px] px-5 pt-5 pb-6 space-y-5">

                <h3 className="text-[16px] font-semibold text-white">
                    Change Image
                </h3>

                {!isCameraOpen && (
                    <>
                        <div className="flex gap-4">

                            {/* CAMERA */}
                            <button
                                onClick={handleCameraClick}
                                className="flex-1 h-[80px] bg-[#2a2a2a] rounded-xl flex flex-col items-center justify-center gap-2 text-[13px] text-[#B99C74]"
                            >
                                <img src="/camera.png" className="w-5 h-5" />
                                Take Selfie
                            </button>

                            {/* GALLERY */}
                            <button
                                onClick={handleGalleryClick}
                                className="flex-1 h-[80px] bg-[#2a2a2a] rounded-xl flex flex-col items-center justify-center gap-2 text-[13px] text-[#B99C74]"
                            >
                                <img src="/gallery.png" className="w-5 h-5" />
                                Upload From Gallery
                            </button>

                        </div>
                    </>
                )}

                {/* CAMERA VIEW */}
                {isCameraOpen && (
                    <div className="flex flex-col items-center gap-4">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded-lg"
                        />

                        <button
                            onClick={handleCapture}
                            className="bg-[#e98834] px-5 py-2 rounded-full text-black"
                        >
                            Capture
                        </button>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={() => {
                        stream?.getTracks().forEach((t) => t.stop());
                        onClose();
                    }}
                    className="w-full text-center text-[#cfcfcf] text-[14px]"
                >
                    Cancel
                </button>

                {/* HIDDEN INPUT */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleGalleryChange}
                    hidden
                />

                {/* CANVAS (hidden) */}
                <canvas ref={canvasRef} style={{ display: "none" }} />

            </div>
        </div>
    );
}