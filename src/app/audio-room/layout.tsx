"use client";

import { ReactNode } from "react";
import { SocketProvider } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AudioRoomLayoutProps {
  children: ReactNode;
}

export default function AudioRoomLayout({
  children,
}: AudioRoomLayoutProps) {
  const router = useRouter();
  const { me, loading } = useCurrentUser();
  const isBlocked = me?.is_active === false || me?.status === "inactive";

  useEffect(() => {
    if (!loading && (!me || isBlocked)) {
      router.replace("/employee-login");
    }
  }, [isBlocked, loading, me, router]);

  if (loading || !me || isBlocked) {
    return null;
  }

  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}
