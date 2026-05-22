"use client";

import React, {useEffect,useState,} from "react";
import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";
import { useParams,} from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { useSocket,} from "@/context/SocketContext";
import { useDashboardData, } from "@/app/(dashboard)/dashboard/useDashboardData";

// const mockParticipants = {
//   hostAndSpeakers: [
//     {
//       id: 1,
//       name: "Rohan Sharma",
//       role: "HOST",
//     },
//     {
//       id: 2,
//       name: "Amit Kumar",
//       role: "SPEAKER",
//     },
//     {
//       id: 3,
//       name: "Neha Verma",
//       role: "SPEAKER",
//     },
//   ],

//   moderators: [
//     {
//       id: 4,
//       name: "Priya Singh",
//       role: "MODERATOR",
//     },
//     {
//       id: 5,
//       name: "Arjun Mehta",
//       role: "MODERATOR",
//     },
//   ],

//   listeners: [
//     {
//       id: 6,
//       name: "Karan",
//       role: "LISTENER",
//     },
//     {
//       id: 7,
//       name: "Riya",
//       role: "LISTENER",
//     },
//     {
//       id: 8,
//       name: "Anjali",
//       role: "LISTENER",
//     },
//     {
//       id: 9,
//       name: "Rahul",
//       role: "LISTENER",
//     },
//   ],
// };

const AudioRoomPage = () => {
  const [isChatOpen, setIsChatOpen] =
    useState(true);

const params = useParams();
const roomId = params.roomId;
const [roomData, setRoomData] = useState<any>(null);
const [loading, setLoading] = useState(true);
const currentUserRole = roomData?.myRole || "listener";
const { socket } = useSocket();
const { me } = useDashboardData( "employee" );

const joinRoom =
  async () => {
    try {
      if (
        !me?.id ||
        !roomId
      ) return;

      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/join`,
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

                userId:
                  me.id,
              }),
          }
        );

      const data =
        await response.json();

      console.log(
        "JOIN ROOM:",
        data
      );
    } catch (
      error
    ) {
      console.error(
        "JOIN ERROR:",
        error
      );
    }
  };


  useEffect(() => {
  const initializeRoom =
    async () => {
      if (
        !me?.id ||
        !roomId
      ) return;

      await joinRoom();

      socket?.emit(
        "join_audio_room",
        Number(roomId)
      );

      await fetchRoomDetails();
    };

  initializeRoom();

  return () => {
    socket?.emit(
      "leave_audio_room",
      Number(roomId)
    );
  };
}, [
  me?.id,
  roomId,
  socket,
]);

useEffect(() => {
  if (
    !socket
  ) return;

  const handleUpdate =
    () => {
      console.log(
        "🔄 participant updated"
      );

      fetchRoomDetails();
    };

  socket.on(
    "participant_updated",
    handleUpdate
  );

  return () => {
    socket.off(
      "participant_updated",
      handleUpdate
    );
  };
}, [socket]);

useEffect(() => {
  if (
    !socket
  ) return;

  const handleParticipantUpdate =
    () => {
      console.log(
        "Realtime update"
      );

      fetchRoomDetails();
    };

  socket.on(
    "participant_updated",
    handleParticipantUpdate
  );

  return () => {
    socket.off(
      "participant_updated",
      handleParticipantUpdate
    );
  };
}, [socket]);

// ✅ INITIAL LOAD - Fetch room details when component mounts
useEffect(() => {
  console.log("📍 Attempting initial fetch. me?.id:", me?.id, "roomId:", roomId);
  
  if (me?.id && roomId) {
    fetchRoomDetails();
  }
}, [me?.id, roomId]);


const fetchRoomDetails =
  async () => {
    if (
  !me?.id ||
  !roomId
) return;

    try {
      // const userId = 1;
      const userId = me?.id;

      if (!userId)
              return;

      const response = await fetch( `${API_BASE_URL}/audio-room/room-details/${roomId}?userId=${userId}`);

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
        "✅ Room Details:",
        data
      );
      console.log(
        "ME:",
        me
      );

      console.log(
        "USER ID:",
        me?.id
      );
      console.log(
        "ROOM DATA:",
        roomData
      );
      setRoomData(
        data.data
      );
    } catch (
      error
    ) {
      console.error(
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (
    !socket ||
    !roomId
  ) return;

socket.emit(
  "join_audio_room",
  Number(roomId)
);

  console.log(
    "Joined audio room:",
    roomId
  );

  return () => {
    socket.emit(
      "leave_audio_room",
      Number(roomId)
    );
  };
}, [
  socket,
  roomId,
]);

useEffect(() => {
  if (!socket)
    return;

  socket.on(
    "participant_updated",
    () => {
      console.log(
        "Participants updated"
      );

      fetchRoomDetails();
    }
  );

  return () => {
    socket.off(
      "participant_updated"
    );
  };
}, [socket]);

// if (loading) {
//   return (
//     <div className="flex h-screen items-center justify-center">
//       Loading room...
//     </div>
//   );
// }

if (loading) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">Loading room...</div>
        <div className="text-sm text-gray-500">me?.id: {me?.id}, roomId: {roomId}</div>
      </div>
    </div>
  );
}

  return (

    
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="h-full flex flex-col min-h-0">
        {/* Header */}

          {/* <div className="bg-red-100 p-2 text-sm">
              Room ID: {String(roomId)}
          </div> */}



        <RoomHeader />

        {/* Content Area - Participants and Chat */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left - Participants */}
          <div className="flex-1 min-w-0 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-5">
              {/* Host + Speakers */}
              <ParticipantSection
                title="Host & Speakers"
                participants={
                        roomData?.participants
                          ?.hostAndSpeakers ||
                        []
                      }
              />

              {/* Moderators */}
              <ParticipantSection
                title="Moderators"
                participants={
                  roomData?.participants
                    ?.moderators ||
                  []
                }
              />

              {/* Listeners */}
              <ParticipantSection
                title="Listeners"
                participants={
                  roomData?.participants
                    ?.listeners ||
                  []
                }
              />
            </div>
          </div>

          {/* Right Chat Panel */}
          {isChatOpen && (
            <div className="w-[360px] shrink-0 border-l border-slate-200/60 bg-white/40 backdrop-blur-md overflow-y-auto">
              <ChatPanel
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
            <BottomControls
            userId={me?.id}
            roomId={Number(roomId)}
              role={currentUserRole}
              isChatOpen={
                isChatOpen
              }
              setIsChatOpen={
                setIsChatOpen
              }
            />
      </div>
    </div>
  );
};

export default AudioRoomPage;