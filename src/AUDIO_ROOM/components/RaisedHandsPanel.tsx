"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  Hand,
} from "lucide-react";

import {
  API_BASE_URL,
} from "@/lib/api";

import {
  useSocket,
} from "@/context/SocketContext";

interface RaisedHandRequest {
  id: number;
  roomId: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    userid: string;
  };
}

interface RaisedHandsPanelProps {
  roomId: number;
  role: string;
}

const moderatorRoles = [
  "host",
  "moderator",
  "admin",
];

const RaisedHandsPanel = ({
  roomId,
  role,
}: RaisedHandsPanelProps) => {
  const {
    socket,
  } = useSocket();

  const [requests,
    setRequests] =
    useState<RaisedHandRequest[]>([]);

  const normalizedRole =
    role?.toLowerCase();

  const canModerate =
    moderatorRoles.includes(
      normalizedRole
    );

  const fetchPendingRequests =
    async () => {
      if (
        !roomId ||
        !canModerate
      ) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/hand-requests/${roomId}`
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch raised hands"
        );
      }

      setRequests(
        data.data || []
      );
    };

  const handleAction =
    async (
      requestId: number,
      action: "approve" | "reject"
    ) => {
      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/hand-action`,
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
                  requestId,
                  roomId,
                  action,
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
            "Failed to update hand request"
        );
      }

      setRequests(
        data.data?.pendingHandRaises ||
          []
      );
    };

  useEffect(() => {
    fetchPendingRequests().catch(
      (error) => {
        console.error(
          "Raised hands fetch error:",
          error
        );
      }
    );
  }, [roomId, canModerate]);

  useEffect(() => {
    if (
      !socket ||
      !canModerate
    ) {
      return;
    }

    const handleHandRaiseUpdate =
      (payload?: any) => {
        if (
          payload?.roomId &&
          Number(payload.roomId) !==
            Number(roomId)
        ) {
          return;
        }

        setRequests(
          payload?.pendingHandRaises ||
            []
        );
      };

    socket.on(
      "hand_raise_updated",
      handleHandRaiseUpdate
    );

    return () => {
      socket.off(
        "hand_raise_updated",
        handleHandRaiseUpdate
      );
    };
  }, [socket, roomId, canModerate]);

  if (
    !canModerate
  ) {
    return null;
  }

  return (
    <aside
      className="
        absolute
        right-5
        top-20
        z-20
        w-72
        rounded-[8px]
        border
        border-slate-200
        bg-white/95
        p-3
        shadow-lg
        backdrop-blur
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hand
            size={16}
            className="text-amber-600"
          />

          <h3 className="text-[11px] font-semibold text-slate-800">
            Raised Hands ({requests.length})
          </h3>
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="text-[9px] text-slate-500">
          No raised hands.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map(
            (request) => (
              <div
                key={request.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  rounded-[6px]
                  border
                  border-slate-100
                  bg-slate-50
                  px-2
                  py-2
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-medium text-slate-800">
                    {request.user?.name ||
                      `User ${request.userId}`}{" "}
                    <span className="text-amber-600">
                      ✋
                    </span>
                  </p>

                  <p className="truncate text-[8px] text-slate-500">
                    {request.user?.userid}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() =>
                      handleAction(
                        request.id,
                        "approve"
                      )
                    }
                    className="
                      rounded-[5px]
                      bg-green-600
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      text-white
                    "
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        request.id,
                        "reject"
                      )
                    }
                    className="
                      rounded-[5px]
                      bg-slate-200
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      text-slate-700
                    "
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </aside>
  );
};

export default RaisedHandsPanel;
