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
import { apiFetch } from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
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
  role: "admin" | "host" | "moderator" | "speaker" | "listener";
  isChatOpen?: boolean;
  isMicEnabled?: boolean;
  isMuted?: boolean;
  setIsChatOpen?: (value: boolean) => void;
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
  const { socket } = useSocket();
  const [showModerationMenu, setShowModerationMenu] = useState(false);
  const [micActive, setMicActive] = useState(isMicEnabled || !isMuted);

  const canSpeak = role !== "listener";
  const isModerator = role === "moderator" || role === "host" || role === "admin";

  const moderationParticipants = participants.filter((participant) => {
    const participantRole = participant.role?.toLowerCase();
    return participant.id !== userId && participantRole !== "listener";
  });

  useEffect(() => {
    setMicActive(isMicEnabled || !isMuted);
  }, [isMicEnabled, isMuted]);

  const handleMicToggle = async () => {
    if (!socket || !userId || !canSpeak) return;

    try {
      const nextMuted = micActive;

      if (!micActive) {
        await livekitService.enableMicrophone();
      } else {
        await livekitService.disableMicrophone();
      }

      setMicActive(!nextMuted);

      socket.emit("audio_mic_toggle", {
        roomId: Number(roomId),
        userId,
        isMuted: nextMuted,
      });
    } catch (error) {
      console.error("Mic toggle failed:", error);
    }
  };

  const handleEndRoom = async () => {
    try {
      const response = await apiFetch("/audio-room//end-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to end room");

      // window.location.href = "/community-forum/room-ends";
    } catch (error) {
      console.error("End Room Error:", error);
    }
          window.location.href = "/audio-room/room-ends";
  };



  // app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/room-end/roomEnd.routes"));

  const handleLeaveRoom = async () => {
    try {
      const response = await apiFetch("/audio-room/leave-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave room");

      window.location.href = "/community-forum/rooms";
    } catch (error) {
      console.error("Leave Room Error:", error);
    }
  };

  const handleRaiseHand = async () => {
    try {
      const response = await apiFetch("/audio-room/raise-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: Number(roomId), userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log("✋ Hand Raised:", data);
    } catch (error) {
      console.error("Raise Hand Error:", error);
    }
  };

  const handleMuteSpeaker = (speakerId: number) => {
    if (!socket) return;
    socket.emit("mute_speaker", { roomId: Number(roomId), userId: speakerId });
    setShowModerationMenu(false);
  };

  const handleUnmuteSpeaker = (speakerId: number) => {
    if (!socket) return;
    socket.emit("unmute_speaker", { roomId: Number(roomId), userId: speakerId });
    setShowModerationMenu(false);
  };

  const handleDowngradeSpeaker = (speakerId: number) => {
    if (!socket) return;
    socket.emit("downgrade_to_listener", { roomId: Number(roomId), userId: speakerId });
    setShowModerationMenu(false);
  };

  const handleRemoveParticipant = (participantId: number) => {
    if (!socket) return;
    socket.emit("remove_participant", { roomId: Number(roomId), userId: participantId });
    setShowModerationMenu(false);
  };

  return (
    <div className="w-full bg-white px-1.5 py-1 sm:px-4 border-t border-black/[0.03]">
      <div className="flex items-center justify-between gap-1.5 sm:gap-4 max-w-5xl mx-auto">
        
        {/* Left Side: Secondary actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 shadow-xs">
            <Smile size={18} />
          </button>

          {role === "listener" && (
            <button onClick={handleRaiseHand} className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition active:scale-95 shadow-xs">
              <Hand size={18} />
            </button>
          )}

          {isModerator && (
            <div className="relative">
              <button onClick={() => setShowModerationMenu(!showModerationMenu)} className={`flex h-9 w-9 items-center justify-center rounded-lg border transition active:scale-95 shadow-xs ${showModerationMenu ? "border-sky-300 bg-sky-100 text-sky-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                <Shield size={18} />
              </button>

              {showModerationMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-slate-200/80 rounded-xl shadow-xl p-2 z-50 w-60 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="text-[8px] font-bold tracking-wider text-slate-400 uppercase px-2 py-1 mb-1">Moderation Panel</div>
                  <div className="space-y-1.5">
                    {moderationParticipants.length === 0 ? (
                      <div className="px-2 py-3 text-[8px] text-slate-400 text-center font-medium">No speakers connected</div>
                    ) : (
                      <div className="space-y-1">
                        {moderationParticipants.map((participant) => (
                          <div key={participant.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                            <div className="mb-1.5">
                              <div className="text-[8px] font-bold text-slate-700 truncate">{participant.name}</div>
                              <div className="text-[8px] uppercase font-bold tracking-wide text-slate-400 mt-0.5">{participant.role}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {participant.isMuted ? (
                                <button type="button" onClick={() => handleUnmuteSpeaker(participant.id)} className="flex items-center justify-center gap-1 rounded bg-white border border-slate-200 py-1 text-[8px] font-semibold text-green-700 hover:bg-green-50">
                                  <Volume2 size={11} /> Unmute
                                </button>
                              ) : (
                                <button type="button" onClick={() => handleMuteSpeaker(participant.id)} className="flex items-center justify-center gap-1 rounded bg-white border border-slate-200 py-1 text-[8px] font-semibold text-red-600 hover:bg-red-50">
                                  <VolumeX size={11} /> Mute
                                </button>
                              )}
                              <button type="button" onClick={() => handleDowngradeSpeaker(participant.id)} className="flex items-center justify-center gap-1 rounded bg-white border border-slate-200 py-1 text-[8px] font-semibold text-amber-700 hover:bg-amber-50">
                                <LogOut size={11} /> Demote
                              </button>
                              <button type="button" onClick={() => handleRemoveParticipant(participant.id)} className="col-span-2 flex items-center justify-center gap-1 rounded bg-red-50 border border-red-100 py-1 text-[8px] font-bold text-red-600 hover:bg-red-100">
                                <Trash2 size={11} /> Evict From Room
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Primary Call Controls */}
        {/* FIXED: Changed flex layout constraints to keep these side-by-side on mobile without squishing */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-center sm:flex-initial">
          {canSpeak && (
            <button 
              onClick={handleMicToggle} 
              className={`flex h-9 sm:h-10 px-2.5 sm:px-4 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs shrink-0 ${
                !micActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#076d47] hover:bg-[#055235] text-white"
              }`}
            >
              {!micActive ? <MicOff size={15} /> : <Mic size={15} />}
              <span className="hidden sm:inline">{!micActive ? "Muted" : "Mute Mic"}</span>
            </button>
          )}

          <button 
            onClick={handleLeaveRoom} 
            className="flex h-9 sm:h-10 px-2.5 sm:px-4 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 font-bold text-xs text-red-600 hover:bg-red-100 transition active:scale-95 shadow-xs shrink-0"
          >
            <PhoneOff size={15} />
            <span className="hidden sm:inline">Leave Space</span>
          </button>
        </div>

        {/* Right Side: Interface adjustments */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setIsChatOpen?.(!isChatOpen)} className={`flex h-9 w-9 items-center justify-center rounded-lg border transition active:scale-95 shadow-xs ${isChatOpen ? "border-[#076d47]/30 bg-[#076d47]/5 text-[#076d47]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            <MessageCircle size={18} />
          </button>

          {role === "host" && (
            <button onClick={handleEndRoom} className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition active:scale-95 shadow-xs" title="End Session">
              <Square size={14} className="fill-red-600" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BottomControls;