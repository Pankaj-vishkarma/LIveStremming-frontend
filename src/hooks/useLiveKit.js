import { useRef, useState } from "react";
import { Room } from "livekit-client";
import { startLive, getLiveToken, endLive } from "../api/liveApi";

export const useLiveKit = () => {
    const roomRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [isStreamer, setIsStreamer] = useState(false);
    const [participants, setParticipants] = useState([]);

    // =========================
    // CONNECT ROOM
    // =========================
    const connectToRoom = async ({ username, isHost }) => {
        try {
            let data;

            if (isHost) {
                data = await startLive();
                setIsStreamer(true);
            } else {
                data = await getLiveToken(username);
                setIsStreamer(false);
            }

            const { token, room_name, livekit_url } = data;

            const room = new Room();
            roomRef.current = room;

            await room.connect(livekit_url, token);

            // =========================
            // STREAMER → publish tracks
            // =========================
            if (isHost) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                for (const track of stream.getTracks()) {
                    await room.localParticipant.publishTrack(track);
                }
            }

            // =========================
            // LISTEN EVENTS
            // =========================
            room.on("trackSubscribed", (track, publication, participant) => {
                setParticipants((prev) => [
                    ...prev,
                    {
                        track,
                        participant,
                    },
                ]);
            });

            room.on("participantDisconnected", (participant) => {
                setParticipants((prev) =>
                    prev.filter((p) => p.participant !== participant)
                );
            });

            setIsConnected(true);

        } catch (error) {
            console.error("LiveKit Error:", error);
        }
    };

    // =========================
    // DISCONNECT
    // =========================
    const disconnectRoom = async () => {
        try {
            if (isStreamer) {
                await endLive(); // backend sync
            }

            roomRef.current?.disconnect();
            setIsConnected(false);
            setParticipants([]);

        } catch (err) {
            console.error(err);
        }
    };

    return {
        connectToRoom,
        disconnectRoom,
        isConnected,
        isStreamer,
        participants,
    };
};