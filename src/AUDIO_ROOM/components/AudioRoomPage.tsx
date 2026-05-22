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
import RaisedHandsPanel from "./RaisedHandsPanel";

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

    const participantGroups =
      [
        ...(roomData?.participants?.hostAndSpeakers || []),
        ...(roomData?.participants?.moderators || []),
        ...(roomData?.participants?.listeners || []),
      ];

    const currentParticipant =
      participantGroups.find(
        (participant: any) =>
          Number(participant.id) ===
          Number(me?.id)
      );

    const canModerate =
      [
        "host",
        "moderator",
        "admin",
      ].includes(
        currentUserRole?.toLowerCase()
      );

    const joinSocketRoom =
      () => {
        if (
          !socket ||
          !roomId ||
          !me?.id
        ) {
          return;
        }

        socket.emit(
          "join_audio_room",
          {
            roomId:
              Number(
                roomId
              ),

            userId:
              me.id,
          }
        );
      };

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





          useEffect(() => {
          if (!socket) return;

          // Listen for real-time moderation updates
          socket.on("speaker_muted", (data) => {
            console.log("Speaker muted:", data.userId);
            fetchRoomDetails();
          });

          socket.on("speaker_unmuted", (data) => {
            console.log("Speaker unmuted:", data.userId);
            fetchRoomDetails();
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
      const initializeRoom =
        async () => {

          if (
            !roomId ||
            !me?.id
          ) {
            return;
          }

          await joinRoom();

          joinSocketRoom();

          await fetchRoomDetails();
        };

      initializeRoom();

      socket?.on(
        "connect",
        joinSocketRoom
      );

      return () => {
        socket?.off(
          "connect",
          joinSocketRoom
        );

        socket?.emit(
          "leave_audio_room",
          {
            roomId:
              Number(
                roomId
              ),

            userId:
              me?.id,
          }
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
        (
          payload?: any
        ) => {
          if (
            payload?.roomId &&
            Number(
              payload.roomId
            ) !==
              Number(
                roomId
              )
          ) {
            return;
          }

          console.log(
            "Realtime participant update"
          );

          if (
            payload?.participants
          ) {
            const participantGroups =
              [
                ...(payload.participants.hostAndSpeakers || []),
                ...(payload.participants.moderators || []),
                ...(payload.participants.listeners || []),
              ];

            const currentParticipant =
              participantGroups.find(
                (participant: any) =>
                  Number(participant.id) ===
                  Number(me?.id)
              );

            setRoomData(
              (previousRoomData: any) => ({
                ...previousRoomData,
                participants:
                  payload.participants,
                myRole:
                  currentParticipant?.role ||
                  previousRoomData?.myRole,
              })
            );

            return;
          }

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
    }, [socket, roomId, me?.id]);

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
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="h-full flex flex-col min-h-0">

          <RoomHeader />

          <RaisedHandsPanel
            roomId={
              Number(
                roomId
              )
            }
            role={
              currentUserRole
            }
          />

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
                  roomId={
                    Number(
                      roomId
                    )
                  }
                  currentUserId={
                    me?.id
                  }
                  canModerate={
                    canModerate
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
                  roomId={
                    Number(
                      roomId
                    )
                  }
                  currentUserId={
                    me?.id
                  }
                  canModerate={
                    canModerate
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
                  roomId={
                    Number(
                      roomId
                    )
                  }
                  currentUserId={
                    me?.id
                  }
                  canModerate={
                    canModerate
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
            isMuted={
              currentParticipant?.isMuted ??
              true
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
