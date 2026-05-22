"use client";

import { ReactNode } from "react";
import { SocketProvider } from "@/context/SocketContext";

interface AudioRoomLayoutProps {
  children: ReactNode;
}

export default function AudioRoomLayout({
  children,
}: AudioRoomLayoutProps) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}
