"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
// import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";
import RaisedHandsPanel from "./RaisedHandsPanel";
import { apiFetch } from "@/lib/api";
import livekitService from "@/AUDIO_ROOM/livekit/services/livekit.service";
import { useSocket } from "@/context/SocketContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AudioRoomPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId;
  const hasJoinedRoom = useRef(false);

  const { socket, isConnected } = useSocket();
  const { me, loading: userLoading, error: userError } = useCurrentUser();

  const currentUserId = me?.id == null ? undefined : Number(me.id);
  const currentUserIdRef = useRef<number | undefined>(currentUserId);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!userLoading && (userError || !currentUserId)) {
      router.replace("/employee-login");
    }
  }, [currentUserId, router, userError, userLoading]);

  const currentUserRole = roomData?.myRole || "listener";

  const participantGroups = [
    ...(roomData?.participants?.hostAndSpeakers || []),
    ...(roomData?.participants?.moderators || []),
    ...(roomData?.participants?.listeners || []),
  ];

  const roomTitle = roomData?.room?.roomName || roomData?.roomName || "Live Room";
  const roomDescription = roomData?.room?.roomDescription || roomData?.roomDescription || "Room details will appear here.";

  const currentParticipant = participantGroups.find(
    (participant: any) => Number(participant.id) === currentUserId
  );

  const canModerate = ["host", "moderator", "admin"].includes(
    currentUserRole?.toLowerCase()
  );

  const joinSocketRoom = () => {
    if (!socket || !roomId || !currentUserId) return;
    socket.emit("join_audio_room", { roomId: Number(roomId) });
    hasJoinedRoom.current = true;
  };

  // ==========================
  // CONNECT LIVEKIT
  // ==========================

  const requestLiveKitToken = async (roomRole?: string) => {
    const response = await apiFetch("/audio-room/livekit/token", {
      method: "POST",
      body: JSON.stringify({ roomId: Number(roomId) }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create LiveKit token");
    }

    sessionStorage.setItem(
      "audio-room-session",
      JSON.stringify({
        roomId: Number(roomId),
        roomRole: data.data.roomRole || roomRole,
        livekitToken: data.data.token,
      })
    );

    return data.data.token;
  };

  const connectLiveKit = async (livekitToken?: string) => {
    try {
      let token = livekitToken;

      if (!token) {
        const session = sessionStorage.getItem("audio-room-session");
        if (session) {
          token = JSON.parse(session)?.livekitToken;
        }
      }

      if (!token) {
        token = await requestLiveKitToken(currentUserRole);
      }

      if (!token) {
        throw new Error("LiveKit token unavailable");
      }

      await livekitService.connect({
        token: token,
        roomId: String(roomId),
      });
      console.log("✅ LiveKit room connected");
    } catch (error) {
      console.error("❌ LiveKit connection failed:", error);
    }
  };

  // ==========================
  // FETCH ROOM DETAILS
  // ==========================

  const fetchRoomDetails = async () => {
    try {
      if (!roomId || !currentUserId) return;

      const response = await apiFetch(`/audio-room/room-details/${roomId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setRoomData(data.data);
    } catch (error) {
      console.error("Room details error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // JOIN ROOM
  // ==========================

  const joinRoom = async () => {
    try {
      if (!roomId || !currentUserId) return;

      const response = await apiFetch("/audio-room/join", {
        method: "POST",
        body: JSON.stringify({ roomId: Number(roomId) }),
      });

      const data = await response.json();
      console.log("Joined room:", data);
      return data.data;
    } catch (error) {
      console.error("Join room error:", error);
    }
  };

  // ==========================
  // SOCKET LISTENERS
  // ==========================

  useEffect(() => {
    if (!socket) return;

    const updateParticipantMuteState = (targetUserId: number, nextIsMuted: boolean) => {
      setRoomData((previousRoomData: any) => {
        if (!previousRoomData?.participants) return previousRoomData;

        const updateGroup = (participants: any[] = []) =>
          participants.map((participant) =>
            Number(participant.id) === targetUserId
              ? { ...participant, isMuted: nextIsMuted, isSpeaking: !nextIsMuted }
              : participant
          );

        return {
          ...previousRoomData,
          participants: {
            ...previousRoomData.participants,
            hostAndSpeakers: updateGroup(previousRoomData.participants.hostAndSpeakers),
            moderators: updateGroup(previousRoomData.participants.moderators),
            listeners: updateGroup(previousRoomData.participants.listeners),
          },
        };
      });
    };

    socket.on("speaker_muted", async (data) => {
      console.log("Speaker muted:", data.userId);
      updateParticipantMuteState(Number(data.userId), true);

      if (Number(data.userId) === currentUserIdRef.current) {
        await livekitService.disableMicrophone();
      }
    });

    socket.on("speaker_unmuted", async (data) => {
      console.log("Speaker unmuted:", data.userId);
      updateParticipantMuteState(Number(data.userId), false);

      if (Number(data.userId) === currentUserIdRef.current) {
        await livekitService.enableMicrophone();
      }
    });

    socket.on("role_changed", (data) => {
      console.log("Role changed for user:", data.userId);
      fetchRoomDetails();
    });

    socket.on("participant_removed", (data) => {
      console.log("Participant removed:", data.userId);
      fetchRoomDetails();
    });

    return () => {
      socket.off("speaker_muted");
      socket.off("speaker_unmuted");
      socket.off("role_changed");
      socket.off("participant_removed");
    };
  }, [socket]);

  // ==========================
  // INITIALIZE ROOM
  // ==========================

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        if (!roomId || !currentUserId) {
          if (!userLoading) setLoading(false);
          return;
        }

        const joinedRoom = await joinRoom();
        if (!joinedRoom) {
          throw new Error("Failed to join room");
        }

        const livekitToken = joinedRoom.livekitToken || await requestLiveKitToken(joinedRoom?.roomRole);
        await connectLiveKit(livekitToken);

        joinSocketRoom();
        await fetchRoomDetails();
      } catch (error) {
        console.error("Room initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeRoom();

    socket?.on("connect", joinSocketRoom);

    return () => {
      socket?.off("connect", joinSocketRoom);
      livekitService.disconnect();
      sessionStorage.removeItem("audio-room-session");

      if (socket?.connected && hasJoinedRoom.current && roomId && currentUserId) {
        socket.emit("leave_audio_room", { roomId: Number(roomId) });
      }
      hasJoinedRoom.current = false;
    };
  }, [currentUserId, roomId, socket, userLoading]);

  // ==========================
  // REALTIME PARTICIPANTS
  // ==========================

  useEffect(() => {
    if (!socket) return;

    const handleParticipantUpdate = (payload?: any) => {
      if (payload?.roomId && Number(payload.roomId) !== Number(roomId)) return;

      console.log("Realtime participant update");

      if (payload?.participants) {
        const participantGroups = [
          ...(payload.participants.hostAndSpeakers || []),
          ...(payload.participants.moderators || []),
          ...(payload.participants.listeners || []),
        ];

        const currentParticipant = participantGroups.find(
          (participant: any) => Number(participant.id) === currentUserId
        );

        setRoomData((previousRoomData: any) => ({
          ...previousRoomData,
          participants: payload.participants,
          myRole: currentParticipant?.role || previousRoomData?.myRole,
        }));
        return;
      }

      fetchRoomDetails();
    };

    socket.on("participant_updated", handleParticipantUpdate);

    return () => {
      socket.off("participant_updated", handleParticipantUpdate);
    };
  }, [socket, roomId, currentUserId]);

  // ==========================
  // LOADING & ERROR SCREENS
  // ==========================

  if (loading || userLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f6f0e7] px-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/5 border-t-[#076d47]" />
        </div>
        <h3 className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-700">Connecting Space</h3>
      </div>
    );
  }

  if (userError || !currentUserId) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f6f0e7] px-4 text-center">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Unable to Load Room</h3>
        <p className="mt-1 text-[10px] text-slate-500">{userError || "Please sign in again to access this area."}</p>
      </div>
    );
  }

  // ==========================
  // MAIN APPLICATION LAYOUT (NO GLOBAL SCROLL)
  // ==========================

  return (
<div className="relative h-screen w-full overflow-hidden bg-[#f6f0e7] text-slate-900 antialiased selection:bg-[#076d47]/10 flex flex-col">
  
  {/* Fixed Sticky Header */}
  <header className="shrink-0 border-b border-black/[0.04] bg-white/80 backdrop-blur-md z-20">
    <RoomHeader
      title={roomTitle}
      description={roomDescription}
      participantCount={participantGroups.length}
    />
  </header>

  {/* Action / Floating Warning Row System */}
  <div className="shrink-0 z-10">
    <RaisedHandsPanel roomId={Number(roomId)} role={currentUserRole} />
  </div>

  {/* Central Viewport Core (Strict Height Containment) */}
  <main className="flex-1 min-h-0 flex overflow-hidden relative">
    
    {/* Dynamic Inner Scrolling Container for Grid Boards */}
    {/* FIXED: On desktop (md:), we disable the main container scroll and use a flex column that takes exactly 100% height */}
    <div className="flex-1 h-full overflow-y-auto md:overflow-hidden px-4 py-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-5xl h-full flex flex-col gap-4 pb-4 md:pb-0">
        
        {/* Speakers Block */}
        {/* FIXED: Using flex-1 to distribute height beautifully on desktop, custom-scrollbar removed if handled inside ParticipantSection */}
        <div className="flex-1 min-h-[120px] rounded-xl border border-black/[0.04] bg-white/60 p-4 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <ParticipantSection
              title="Host & Speakers"
              participants={roomData?.participants?.hostAndSpeakers || []}
              roomId={Number(roomId)}
              currentUserId={currentUserId}
              canModerate={canModerate}
            />
          </div>
        </div>

        {/* Moderators Block */}
        {/* FIXED: flex-1 takes equal share, content scrolls gracefully inside if it overflows */}
        <div className="flex-1 min-h-[120px] rounded-xl border border-black/[0.04] bg-white/60 p-4 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <ParticipantSection
              title="Moderators"
              participants={roomData?.participants?.moderators || []}
              roomId={Number(roomId)}
              currentUserId={currentUserId}
              canModerate={canModerate}
            />
          </div>
        </div>

        {/* Listeners Block */}
        {/* FIXED: flex-[1.5] gives the listeners block slightly more weight on desktop screens */}
        <div className="flex-[1.5] min-h-[120px] rounded-xl border border-black/[0.04] bg-white/60 p-4 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <ParticipantSection
              title="Listeners"
              participants={roomData?.participants?.listeners || []}
              roomId={Number(roomId)}
              currentUserId={currentUserId}
              canModerate={canModerate}
            />
          </div>
        </div>

      </div>
    </div>

    {/* Desktop Side Dock Chat Integration Layer */}
    {/* {isChatOpen && (
      <div className="hidden lg:block w-[340px] h-full shrink-0 border-l border-black/[0.04] bg-white/50 backdrop-blur-md overflow-y-auto z-10">
        <ChatPanel isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </div>
    )} */}
  </main>

  {/* Pinned Control Utility Deck */}
  <footer className="shrink-0 border-t border-black/[0.04] bg-white/90 backdrop-blur-md px-2 py-1 sm:px-6 z-20">
    <div className="mx-auto max-w-5xl">
      <BottomControls
        userId={currentUserId}
        roomId={Number(roomId)}
        role={currentUserRole}
        participants={participantGroups}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isMuted={currentParticipant?.isMuted ?? true}
      />
    </div>
  </footer>

</div>
  );
};

export default AudioRoomPage;