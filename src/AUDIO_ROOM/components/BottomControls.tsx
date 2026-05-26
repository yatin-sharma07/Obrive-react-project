"use client";

import { useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  Hand,
  Smile,
  PhoneOff,
  Shield,
  MessageCircle,
  Square,
  Volume2,
  VolumeX,
  LogOut,
  Trash2,
} from "lucide-react";

import {
  apiFetch,
} from "@/lib/api";
import {
  useSocket,
} from "@/context/SocketContext";
import livekitService from "@/AUDIO_ROOM/livekit/services/livekit.service";

interface BottomControlsProps {
  roomId: number;
  userId?: number;
  participants?: {
    id: number;
    name: string;
    role: string;
    isMuted?: boolean;
  }[];
  

  role:
    | "admin"
    | "host"
    | "moderator"
    | "speaker"
    | "listener";

  isChatOpen?: boolean;

  isMicEnabled?: boolean;
  isMuted?: boolean;

  setIsChatOpen?: (
    value: boolean
  ) => void;
}



const BottomControls = ({
  roomId,
  role,
  userId,
  participants = [],
  isChatOpen = false,
  isMicEnabled = false,
  isMuted = true,
  setIsChatOpen,
}: BottomControlsProps) => {
  const {
    socket,
  } = useSocket();

  const [showModerationMenu, setShowModerationMenu] = useState(false);
  const [micActive, setMicActive] =
    useState(
      isMicEnabled ||
      !isMuted
    );

  const canSpeak =
    role !== "listener";

  const isModerator =
    role === "moderator" ||
    role === "host" ||
    role === "admin";

  const moderationParticipants =
    participants.filter(
      (participant) => {
        const participantRole =
          participant.role
            ?.toLowerCase();

        return (
          participant.id !==
            userId &&
          participantRole !==
            "listener"
        );
      }
    );

  console.log(
  "Current Role:",
  role
);

  useEffect(() => {
    setMicActive(
      isMicEnabled ||
      !isMuted
    );
  }, [
    isMicEnabled,
    isMuted,
  ]);



const handleMicToggle =
  async () => {

    if (
      !socket ||
      !userId ||
      !canSpeak
    ) {
      return;
    }

    try {
      const nextMuted =
        micActive;

      // ==========================
      // TURN MIC ON
      // ==========================

      if (
        !micActive
      ) {

        await livekitService
          .enableMicrophone();

      }

      // ==========================
      // TURN MIC OFF
      // ==========================

      else {

        await livekitService
          .disableMicrophone();

      }

      setMicActive(
        !nextMuted
      );

      // ==========================
      // SOCKET UPDATE
      // ==========================

        socket.emit(
          "audio_mic_toggle",
          {
            roomId: Number(roomId),
            userId,
            isMuted: nextMuted,
          }
        );

    } catch (
      error
    ) {

      console.error(
        "Mic toggle failed:",
        error
      );
    }
  };


// const handleMicToggle =
//   () => {
//     if (
//       !socket ||
//       !userId ||
//       !canSpeak
//     ) {
//       return;
//     }

//     socket.emit(
//       "audio_mic_toggle",
//       {
//         roomId:
//           Number(roomId),
//         userId,
//         !isMicEnabled:
//           !!isMicEnabled,
//       }
//     );
//   };

  


const handleEndRoom =
  async () => {
    try {
      const response =
        await apiFetch(
          "/audio-room/end-room",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  roomId,
                  userId,
                }
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Failed to end room"
        );
      }

      console.log(
        "✅ Room Ended:",
        data
      );

      window.location.href =
        "/audio-room";
    } catch (
      error
    ) {
      console.error(
        "❌ End Room Error:",
        error
      );
    }
  };

const handleLeaveRoom =
  async () => {
    try {
      // const userId = 1;

      const response =
        await apiFetch(
          "/audio-room/leave-room",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  roomId,
                  userId,
                }
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Failed to leave room"
        );
      }

      console.log(
        "✅ Left Room:",
        data
      );

      window.location.href =
        "/audio-room";
    } catch (
      error
    ) {
      console.error(
        "❌ Leave Room Error:",
        error
      );
    }
  };



  const handleRaiseHand =
  async () => {
    try {
      const response =
        await apiFetch(
          "/audio-room/raise-hand",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                roomId:
                  Number(roomId),

                userId,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      console.log(
        "✋ Hand Raised:",
        data
      );
    } catch (
      error
    ) {
      console.error(
        "Raise Hand Error:",
        error
      );
    }
  };

// ==========================
// MODERATION HANDLERS
// ==========================

const handleMuteSpeaker =
  (speakerId: number) => {
    if (!socket) return;

    socket.emit("mute_speaker", {
      roomId: Number(roomId),
      userId: speakerId,
    });

    console.log(
      `🔇 Muting user ${speakerId}`
    );
    setShowModerationMenu(false);
  };

const handleUnmuteSpeaker =
  (speakerId: number) => {
    if (!socket) return;

    socket.emit("unmute_speaker", {
      roomId: Number(roomId),
      userId: speakerId,
    });

    console.log(
      `🔊 Unmuting user ${speakerId}`
    );
    setShowModerationMenu(false);
  };

const handleDowngradeSpeaker =
  (speakerId: number) => {
    if (!socket) return;

    socket.emit(
      "downgrade_to_listener",
      {
        roomId: Number(roomId),
        userId: speakerId,
      }
    );

    console.log(
      `👤 Downgrading user ${speakerId} to listener`
    );
    setShowModerationMenu(false);
  };

const handleRemoveParticipant =
  (participantId: number) => {
    if (!socket) return;

    socket.emit("remove_participant", {
      roomId: Number(roomId),
      userId: participantId,
    });

    console.log(
      `❌ Removing user ${participantId} from room`
    );
    setShowModerationMenu(false);
  };


  return (
    <div
      className="
        border-t
        border-slate-200/60
        bg-white/40
        backdrop-blur-md
        px-5
        py-2
      "
    >
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* <div className="text-xs text-red-600 font-bold">
              Role: {role}
        </div> */}
        {/* Mic Button */}
        {canSpeak && (
          <button
            onClick={handleMicToggle}
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              transition-all
              shadow-sm

              ${
                !micActive
                  ? "bg-red-100 border border-red-200"
                  : "bg-green-100 border border-green-200"
              }
            `}
          >
            {!micActive ? (
              <MicOff
                size={22}
                className="text-red-600"
              />
            ) : (
              <Mic
                size={22}
                className="text-green-600"
              />
            )}
          </button>
        )}

        {/* Reaction */}
        <button
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white/50
            shadow-sm
            transition
            hover:bg-white
          "
        >
          <Smile
            size={22}
            className="text-slate-700"
          />
        </button>

        {/* Raise Hand */}
        {role === "listener" && (
          <button
            onClick={handleRaiseHand}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-amber-200
              bg-amber-100
              shadow-sm
              transition
              hover:bg-amber-200
            "
          >
            <Hand
              size={22}
              className="text-amber-700"
            />
          </button>
        )}

        {/* Moderator Controls */}
        {isModerator && (
          <div className="relative">
            <button
              onClick={() =>
                setShowModerationMenu(
                  !showModerationMenu
                )
              }
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-sky-200
                bg-sky-100
                shadow-sm
                transition
                hover:bg-sky-200
              "
            >
              <Shield
                size={22}
                className="text-sky-700"
              />
            </button>

            {/* Moderation Dropdown Menu */}
            {showModerationMenu && (
              <div
                className="
                  absolute
                  bottom-16
                  left-0
                  bg-white
                  border
                  border-slate-200
                  rounded-lg
                  shadow-lg
                  p-2
                  z-50
                  w-56
                "
              >
                <div
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-3
                    px-2
                  "
                >
                  Moderation Controls
                </div>

                <div
                  className="
                    space-y-2
                  "
                >
                  {moderationParticipants.length ===
                  0 ? (
                    <div
                      className="
                        px-2
                        py-3
                        text-xs
                        text-slate-500
                      "
                    >
                      No speakers available
                    </div>
                  ) : (
                    moderationParticipants.map(
                      (
                        participant
                      ) => (
                        <div
                          key={
                            participant.id
                          }
                          className="
                            rounded
                            border
                            border-slate-200
                            p-2
                          "
                        >
                          <div className="mb-2">
                            <div className="text-xs font-semibold text-slate-700">
                              {
                                participant.name
                              }
                            </div>
                            <div className="text-[10px] uppercase text-slate-400">
                              {
                                participant.role
                              }
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1">
                            {participant.isMuted ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnmuteSpeaker(
                                    participant.id
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  justify-center
                                  gap-1
                                  rounded
                                  border
                                  border-green-200
                                  bg-green-50
                                  px-2
                                  py-1
                                  text-[10px]
                                  text-green-700
                                  hover:bg-green-100
                                "
                              >
                                <Volume2
                                  size={12}
                                />
                                Unmute
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMuteSpeaker(
                                    participant.id
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  justify-center
                                  gap-1
                                  rounded
                                  border
                                  border-red-200
                                  bg-red-50
                                  px-2
                                  py-1
                                  text-[10px]
                                  text-red-700
                                  hover:bg-red-100
                                "
                              >
                                <VolumeX
                                  size={12}
                                />
                                Mute
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDowngradeSpeaker(
                                  participant.id
                                )
                              }
                              className="
                                flex
                                items-center
                                justify-center
                                gap-1
                                rounded
                                border
                                border-amber-200
                                bg-amber-50
                                px-2
                                py-1
                                text-[10px]
                                text-amber-700
                                hover:bg-amber-100
                              "
                            >
                              <LogOut
                                size={12}
                              />
                              Listen
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveParticipant(
                                  participant.id
                                )
                              }
                              className="
                                col-span-2
                                flex
                                items-center
                                justify-center
                                gap-1
                                rounded
                                border
                                border-red-300
                                bg-red-100
                                px-2
                                py-1
                                text-[10px]
                                text-red-700
                                hover:bg-red-200
                              "
                            >
                              <Trash2
                                size={12}
                              />
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Toggle */}
        <button
          onClick={() => setIsChatOpen?.(!isChatOpen)}
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            shadow-sm
            transition
            hover:bg-blue-300

            ${
              isChatOpen
                ? "border border-blue-200 bg-blue-100"
                : "border border-slate-200 bg-blue-200 hover:bg-white"
            }
          `}
        >
          <MessageCircle
            size={22}
            className={
              isChatOpen
                ? "text-blue-600"
                : "text-slate-700"
            }
          />
        </button>

        {/* End Room */}
{role ===
  "host" && (
  <button
    onClick={
      handleEndRoom
    }
    className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      border
      border-red-300
      bg-red-600
      shadow-sm
      transition
      hover:bg-red-700
    "
  >
    <Square
      size={22}
      className="text-white"
    />
  </button>
)}

        {/* Leave Room */}
        <button
        onClick={ handleLeaveRoom }
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-red-200
            bg-red-100
            shadow-sm
            transition
            hover:bg-red-200
          "
        >
          <PhoneOff
            size={22}
            className="text-red-700"
          />
        </button>
      </div>
    </div>
  );
};

export default BottomControls;
