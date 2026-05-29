"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";
import RaisedHandsPanel from "./RaisedHandsPanel";

import {
  apiFetch,
} from "@/lib/api";

import livekitService from "@/AUDIO_ROOM/livekit/services/livekit.service";
import {
  useSocket,
} from "@/context/SocketContext";

import {
  useCurrentUser,
} from "@/hooks/useCurrentUser";

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
    const router =
      useRouter();

    const roomId =
      params.roomId;

    const hasJoinedRoom =
      useRef(false);

    const {
      socket,
      isConnected,
    } = useSocket();

    const {
      me,
      loading: userLoading,
      error: userError,
    } = useCurrentUser();

    const currentUserId =
      me?.id == null
        ? undefined
        : Number(me.id);

    const currentUserIdRef =
      useRef<
        number | undefined
      >(currentUserId);

    useEffect(() => {
      currentUserIdRef.current =
        currentUserId;
    }, [
      currentUserId,
    ]);

    useEffect(() => {
      if (
        !userLoading &&
        (userError || !currentUserId)
      ) {
        router.replace(
          "/employee-login"
        );
      }
    }, [
      currentUserId,
      router,
      userError,
      userLoading,
    ]);

    const currentUserRole =
      roomData?.myRole ||
      "listener";

    const participantGroups =
      [
        ...(roomData?.participants?.hostAndSpeakers || []),
        ...(roomData?.participants?.moderators || []),
        ...(roomData?.participants?.listeners || []),
      ];

    const roomTitle =
      roomData?.room?.roomName ||
      roomData?.roomName ||
      "Live Room";

    const roomDescription =
      roomData?.room?.roomDescription ||
      roomData?.roomDescription ||
      "Room details will appear here.";

    const currentParticipant =
      participantGroups.find(
        (participant: any) =>
          Number(participant.id) ===
          currentUserId
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
          !currentUserId
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
          }
        );

        hasJoinedRoom.current = true;
      };


// ==========================
// CONNECT LIVEKIT
// ==========================

const requestLiveKitToken =
  async (roomRole?: string) => {
    const response =
      await apiFetch(
        "/audio-room/livekit/token",
        {
          method:
            "POST",

          body:
            JSON.stringify(
              {
                roomId:
                  Number(
                    roomId
                  ),
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
          "Failed to create LiveKit token"
      );
    }

    sessionStorage.setItem(
      "audio-room-session",
      JSON.stringify({
        roomId:
          Number(
            roomId
          ),
        roomRole:
          data.data.roomRole ||
          roomRole,
        livekitToken:
          data.data.token,
      })
    );

    return data.data.token;
  };

const connectLiveKit =
  async (livekitToken?: string) => {
    try {
      let token =
        livekitToken;

      if (!token) {
        const session =
          sessionStorage.getItem(
            "audio-room-session"
          );

        if (session) {
          token =
            JSON.parse(
              session
            )?.livekitToken;
        }
      }

      if (!token) {
        token =
          await requestLiveKitToken(
            currentUserRole
          );
      }

      if (!token) {
        throw new Error(
          "LiveKit token unavailable"
        );
      }

      await livekitService.connect({
        token:
          token,

        roomId:
          String(
            roomId
          ),
      });
      console.log(
        "✅ LiveKit room connected"
      );
    } catch (
      error
    ) {
      console.error(
        "❌ LiveKit connection failed:",
        error
      );
    }
  };

    // ==========================
    // FETCH ROOM DETAILS
    // ==========================

    const fetchRoomDetails =
      async () => {
        try {
          if (
            !roomId ||
            !currentUserId
          ) {
            return;
          }

          const response =
            await apiFetch(
              `/audio-room/room-details/${roomId}`
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
            !currentUserId
          ) {
            return;
          }

          const response =
            await apiFetch(
              "/audio-room/join",
              {
                method:
                  "POST",

                body:
                  JSON.stringify(
                    {
                      roomId:
                        Number(
                          roomId
                        ),
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

          return data.data;

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

          const updateParticipantMuteState =
            (
              targetUserId: number,
              nextIsMuted: boolean
            ) => {
              setRoomData(
                (previousRoomData: any) => {
                  if (
                    !previousRoomData
                      ?.participants
                  ) {
                    return previousRoomData;
                  }

                  const updateGroup =
                    (participants: any[] = []) =>
                      participants.map(
                        (participant) =>
                          Number(
                            participant.id
                          ) ===
                          targetUserId
                            ? {
                                ...participant,
                                isMuted:
                                  nextIsMuted,
                                isSpeaking:
                                  !nextIsMuted,
                              }
                            : participant
                      );

                  return {
                    ...previousRoomData,
                    participants: {
                      ...previousRoomData.participants,
                      hostAndSpeakers:
                        updateGroup(
                          previousRoomData
                            .participants
                            .hostAndSpeakers
                        ),
                      moderators:
                        updateGroup(
                          previousRoomData
                            .participants
                            .moderators
                        ),
                      listeners:
                        updateGroup(
                          previousRoomData
                            .participants
                            .listeners
                        ),
                    },
                  };
                }
              );
            };

          // Listen for real-time moderation updates
          socket.on("speaker_muted", async (data) => {
            console.log("Speaker muted:", data.userId);

            updateParticipantMuteState(
              Number(data.userId),
              true
            );

            if (
              Number(data.userId) ===
              currentUserIdRef.current
            ) {
              await livekitService
                .disableMicrophone();
            }

          });

          socket.on("speaker_unmuted", async (data) => {
            console.log("Speaker unmuted:", data.userId);

            updateParticipantMuteState(
              Number(data.userId),
              false
            );

            if (
              Number(data.userId) ===
              currentUserIdRef.current
            ) {
              await livekitService
                .enableMicrophone();
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
      
      const initializeRoom =
        async () => {
        try {

//           if (
//   hasInitialized.current
// ) {
//   return;
// }

// hasInitialized.current =
//   true;

          if (
            !roomId ||
            !currentUserId
          ) {
            if (!userLoading) {
              setLoading(false);
            }

            return;
          }

          const joinedRoom =
            await joinRoom();

          if (!joinedRoom) {
            throw new Error(
              "Failed to join room"
            );
          }

          const livekitToken =
            joinedRoom.livekitToken ||
            await requestLiveKitToken(
              joinedRoom?.roomRole
            );

          await connectLiveKit(
            livekitToken
          );

          joinSocketRoom();

          await fetchRoomDetails();

      } catch (error) {
        console.error(
          "Room initialization failed:",
          error
        );
      } finally {
        setLoading(false);
      }
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

        livekitService.disconnect();

          sessionStorage.removeItem(
            "audio-room-session"
          );

        // Only emit leave if socket is connected and we've joined
        if (
          socket?.connected &&
          hasJoinedRoom.current &&
          roomId &&
          currentUserId
        ) {
          socket.emit(
            "leave_audio_room",
            {
              roomId:
                Number(
                  roomId
                ),
            }
          );
        }

        hasJoinedRoom.current = false;
      };
    }, [
      currentUserId,
      roomId,
      socket,
      userLoading,
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
                  currentUserId
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
    }, [socket, roomId, currentUserId]);

    // ==========================
    // LOADING
    // ==========================

    if (
      loading ||
      userLoading
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

    if (
      userError ||
      !currentUserId
    ) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">
              Unable to load room
            </div>

            <div className="text-sm text-slate-500">
              {userError || "Please login again before joining this room."}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="h-full flex flex-col min-h-0">

          <RoomHeader
            title={roomTitle}
            description={roomDescription}
            participantCount={ participantGroups.length }
          />

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
                    currentUserId
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
                    currentUserId
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
                    currentUserId
                  }
                  canModerate={
                    canModerate
                  }
                />

              </div>
            </div>

            {/* Chat */}
            {/* {isChatOpen && (
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
            )} */}
          </div>

          <BottomControls
            userId={
              currentUserId
            }
            roomId={
              Number(
                roomId
              )
            }
            role={
              currentUserRole
            }
            participants={
              participantGroups
            }
            isChatOpen={
              isChatOpen
            }
            setIsChatOpen={
              setIsChatOpen
            }
            isMuted={
              currentParticipant
                ?.isMuted ??
              true
            }
          />
        </div>
      </div>
    );
  };

export default AudioRoomPage;
