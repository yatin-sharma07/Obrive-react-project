"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  ChevronRight,
  Send,
} from "lucide-react";

interface ChatPanelProps {
  isChatOpen: boolean;
  setIsChatOpen: Dispatch<
    SetStateAction<boolean>
  >;
}

const mockMessages = [
  {
    id: 1,
    name: "System",
    message:
      "Rohan joined the room",
    isSystem: true,
  },
  {
    id: 2,
    name: "Priya",
    message:
      "Welcome everyone!",
    isSystem: false,
  },
  {
    id: 3,
    name: "Amit",
    message:
      "Let's start the discussion.",
    isSystem: false,
  },
];

const ChatPanel = ({
  setIsChatOpen,
}: ChatPanelProps) => {
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200/60
          px-5
          py-1
          bg-white/30
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Chat
          </h2>

          <p className="text-[10px] text-slate-500">
            Open discussion
          </p>
        </div>

        {/* Collapse */}
        <button
          onClick={() =>
            setIsChatOpen(false)
          }
          className="
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white/50
            p-2
            transition
            hover:bg-white
          "
        >
          <ChevronRight
            size={18}
            className="text-slate-600"
          />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
        {mockMessages.map(
          (message) => (
            <div
              key={message.id}
              className={`
                rounded-tl-xl
                rounded-tr-xl
                rounded-bl-xl
                px-4
                py-2
                text-[9px]

                ${
                  message.isSystem
                    ? "bg-slate-100 text-slate-500"
                    : "bg-white/60 border border-slate-200/60 text-slate-700"
                }
              `}
            >
              {!message.isSystem && (
                <p className="font-semibold text-slate-800 mb-1">
                  {message.name}
                </p>
              )}

              <p>{message.message}</p>
            </div>
          )
        )}
      </div>

      {/* Input */}
      <div
        className="
          border-t
          border-slate-200/60
          p-3
          bg-white/30
        "
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="
              flex-1
              rounded-[10px]
              border
              border-slate-200
              bg-white/50
              px-2
              py-2
              text-[9px]
              outline-none
              placeholder:text-slate-400
              focus:border-slate-300
            "
          />

          <button
            className="
              flex
              items-center
              justify-center
              rounded-2xl
              bg-slate-900
              px-4
              text-white
              transition
              hover:opacity-90
            "
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;