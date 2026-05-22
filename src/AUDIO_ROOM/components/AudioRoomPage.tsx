"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";

import {
  API_BASE_URL,
} from "@/lib/api";

import {
  useSocket,
} from "@/context/SocketContext";

import {
  useDashboardData,
} from "@/app/(dashboard)/dashboard/useDashboardData";

const AudioRoomPage =
  () => {
    const [isChatOpen,
      setIsChatOpen] =
      useState(true);

    const [roomData,
      setRoomData] =
      useState<any>(null);

    const [loading,
      setLoading] =
      useState(true);

    const params =
      useParams();

    const roomId =
      params.roomId;

    const {
      socket,
    } = useSocket();

    const { me } =
      useDashboardData(
        "employee"
      );

    const currentUserRole =
      roomData?.myRole ||
      "listener";

    // ==========================
    // FETCH ROOM DETAILS
    // ==========================

    const fetchRoomDetails =
      async () => {
        try {
          if (
            !roomId ||
            !me?.id
          ) {
            return;
          }

          const response =
            await fetch(
              `${API_BASE_URL}/audio-room/room-details/${roomId}?userId=${me.id}`
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

          setRoomData(
            data.data
          );

        } catch (
          error
        ) {
          console.error(
            "Room details error:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    // ==========================
    // JOIN ROOM
    // ==========================

    const joinRoom =
      async () => {
        try {
          if (
            !roomId ||
            !me?.id
          ) {
            return;
          }

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
                  JSON.stringify(
                    {
                      roomId:
                        Number(
                          roomId
                        ),

                      userId:
                        me.id,
                    }
                  ),
              }
            );

          const data =
            await response.json();

          console.log(
            "Joined room:",
            data
          );

        } catch (
          error
        ) {
          console.error(
            "Join room error:",
            error
          );
        }
      };

    // ==========================
    // INITIALIZE ROOM
    // ==========================

    useEffect(() => {
      const initializeRoom =
        async () => {

          if (
            !roomId ||
            !me?.id
          ) {
            return;
          }

          await joinRoom();

          socket?.emit(
            "join_audio_room",
            Number(
              roomId
            )
          );

          await fetchRoomDetails();
        };

      initializeRoom();

      return () => {
        socket?.emit(
          "leave_audio_room",
          Number(
            roomId
          )
        );
      };
    }, [
      me?.id,
      roomId,
      socket,
    ]);

    // ==========================
    // REALTIME PARTICIPANTS
    // ==========================

    useEffect(() => {
      if (
        !socket
      ) return;

      const handleParticipantUpdate =
        () => {
          console.log(
            "Realtime participant update"
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

    // ==========================
    // LOADING
    // ==========================

    if (
      loading
    ) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">
              Loading room...
            </div>

            <div className="text-sm text-slate-500">
              roomId:
              {" "}
              {
                String(
                  roomId
                )
              }
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="h-full flex flex-col min-h-0">

          <RoomHeader />

          <div className="flex-1 min-h-0 flex overflow-hidden">

            {/* Participants */}
            <div className="flex-1 min-w-0 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-5">

                <ParticipantSection
                  title="Host & Speakers"
                  participants={
                    roomData
                      ?.participants
                      ?.hostAndSpeakers ||
                    []
                  }
                />

                <ParticipantSection
                  title="Moderators"
                  participants={
                    roomData
                      ?.participants
                      ?.moderators ||
                    []
                  }
                />

                <ParticipantSection
                  title="Listeners"
                  participants={
                    roomData
                      ?.participants
                      ?.listeners ||
                    []
                  }
                />

              </div>
            </div>

            {/* Chat */}
            {isChatOpen && (
              <div className="w-[360px] shrink-0 border-l border-slate-200/60 bg-white/40 backdrop-blur-md overflow-y-auto">
                <ChatPanel
                  isChatOpen={
                    isChatOpen
                  }
                  setIsChatOpen={
                    setIsChatOpen
                  }
                />
              </div>
            )}
          </div>

          <BottomControls
            userId={
              me?.id
            }
            roomId={
              Number(
                roomId
              )
            }
            role={
              currentUserRole
            }
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