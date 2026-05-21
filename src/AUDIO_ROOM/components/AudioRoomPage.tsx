"use client";

import React, {useEffect,useState,} from "react";
import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";
import { useParams,} from "next/navigation";
import { API_BASE_URL } from "@/lib/api";



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





useEffect(() => {
  fetchRoomDetails();
}, []);

const fetchRoomDetails =
  async () => {
    try {
      const userId = 1;

      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/room-details/${roomId}?userId=${userId}`
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
        "✅ Room Details:",
        data
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


if (loading) {
  return (
    <div className="flex h-screen items-center justify-center">
      Loading room...
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
              roomId={
                roomId as string
              }
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