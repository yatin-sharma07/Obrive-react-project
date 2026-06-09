"use client";

import {
  Mic,
  MicOff,
  Crown,
  Shield,
  Volume2,
  LogOut,
  Trash2,
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";

interface Participant {
  id: number;
  name: string;
  role: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

interface ParticipantCardProps {
  participant: Participant;
  roomId: number;
  currentUserId?: number; 
  canModerate?: boolean;
}

const ParticipantCard = ({
  participant,
  roomId,
  currentUserId,
  canModerate = false,
}: ParticipantCardProps) => {
  const { socket } = useSocket();

  const normalizedRole = participant.role?.toLowerCase() || "";
  const isMuted = participant.isMuted ?? true;
  const isSpeaking = Boolean(participant.isSpeaking && !isMuted);

  const canBeMuted =
    canModerate &&
    participant.id !== currentUserId &&
    !isMuted &&
    ["host", "moderator", "speaker"].includes(normalizedRole);

  const handleModeratorMute = () => {
    if (!socket || !canBeMuted) return;
    socket.emit("mute_speaker", { roomId, userId: participant.id });
  };

  const handleModeratorUnmute = () => {
    if (!socket || !canModerate || participant.id === currentUserId || !isMuted) return;
    socket.emit("unmute_speaker", { roomId, userId: participant.id });
  };

  const handleDowngradeToListener = () => {
    if (!socket || !canModerate || participant.id === currentUserId || normalizedRole === "listener") return;
    socket.emit("downgrade_to_listener", { roomId, userId: participant.id });
  };

  const handleRemoveParticipant = () => {
    if (!socket || !canModerate || participant.id === currentUserId) return;
    if (confirm(`Remove ${participant.name} from room?`)) {
      socket.emit("remove_participant", { roomId, userId: participant.id });
    }
  };

  return (
    // FIXED: Dropped cards layout, border containment styles, and rigid width restrictions.
    <div className="group relative flex flex-col items-center w-full select-none">
      
      {/* 1. Profile Avatar Stack Section */}
      <div className="relative">
        <div
          className={`
            flex h-12.5 w-12.5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 transition-all duration-300
            ${isSpeaking 
              ? "ring-2 ring-green-500/40 bg-green-50 scale-105 shadow-sm" 
              : "border border-black/[0.04] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"}
          `}
        >
          {participant.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        {/* Status Indicator Badge Overlay */}
        <div
          className={`
            absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-xs
            ${isMuted ? "bg-red-500 text-white" : "bg-[#076d47] text-white"}
          `}
        >
          {isMuted ? <MicOff size={10} strokeWidth={2.5} /> : <Mic size={10} strokeWidth={2.5} />}
        </div>

        {/* Role Icon Mini Badge Indicator */}
        {normalizedRole === "host" && (
          <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full border border-white shadow-xs">
            <Crown size={9} className="fill-amber-950/20" />
          </div>
        )}
        {normalizedRole === "moderator" && (
          <div className="absolute -top-1 -right-1 bg-sky-500 text-white p-0.5 rounded-full border border-white shadow-xs">
            <Shield size={9} />
          </div>
        )}
      </div>

      {/* 2. Secondary Context Text Elements Stack */}
      <div className="mt-2 text-center w-full px-0.5">
        <h3 className="text-[9px] font-semibold text-slate-800 truncate leading-tight">
          {participant.name}
        </h3>
        <p className="text-[9px] font-medium text-slate-400 capitalize mt-0.5 leading-none">
          {normalizedRole}
        </p>
      </div>

      {/* 3. FIXED: Desktop Hover Micro-Overlay Panel (Eliminates horizontal scaling and messy rows) */}
      {canModerate && participant.id !== currentUserId && (
        <div className="absolute -top-1 bg-slate-900/95 backdrop-blur-xs text-white rounded-xl p-1 gap-1 items-center justify-center shadow-lg border border-white/10 hidden group-hover:flex z-30 transition-all animate-in fade-in zoom-in-95 duration-100">
          {canBeMuted && (
            <button onClick={handleModeratorMute} className="p-1 rounded-md text-red-400 hover:bg-white/10" title="Mute">
              <MicOff size={12} />
            </button>
          )}
          {isMuted && !["listener"].includes(normalizedRole) && (
            <button onClick={handleModeratorUnmute} className="p-1 rounded-md text-green-400 hover:bg-white/10" title="Unmute">
              <Volume2 size={12} />
            </button>
          )}
          {!["listener", "host", "admin"].includes(normalizedRole) && (
            <button onClick={handleDowngradeToListener} className="p-1 rounded-md text-amber-400 hover:bg-white/10" title="Demote to Listener">
              <LogOut size={12} />
            </button>
          )}
          <button onClick={handleRemoveParticipant} className="p-1 rounded-md text-red-500 hover:bg-white/10" title="Evict User">
            <Trash2 size={12} />
          </button>
        </div>
      )}

    </div>
  );
};

export default ParticipantCard;