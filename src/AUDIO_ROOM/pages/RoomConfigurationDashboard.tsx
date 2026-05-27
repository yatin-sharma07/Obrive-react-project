"use client";

import React, { useEffect, useState } from "react";
import RoomConfigurationLayout from "../layouts/RoomConfiguratoinLayout";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Components
import CreateRoom from "../components/CreateRoom";
import RoomsHistory from "../components/RoomsHistory";
import RoomsScheduled from "../components/RoomsScheduled";
// import Templates from "../components/Templates";
// import ActiveRooms from "../components/ActiveRooms";
// import RoomRecordings from "../components/RoomRecordings";
// import Settings from "../components/Settings";

type ActiveSection =
  | "create-room"
  | "templates"
  | "rooms-scheduled"
  | "rooms-history"
  | "recordings"
  | "settings";

const RoomConfigurationDashboard = () => {
  const router = useRouter();
  const { me, loading } = useCurrentUser();
  const [activeSection, setActiveSection] = useState<ActiveSection>("create-room");

  const isSupervisor = me?.role === "supervisor";

  useEffect(() => {
    if (!loading && !isSupervisor) {
      router.replace("/not-found");
    }
  }, [isSupervisor, loading, router]);

  const renderComponent = () => {

    switch (activeSection) {
      case "create-room":
        return <CreateRoom />;

      case "templates":
        return <div className="p-6">Templates coming soon...</div>;

      case "rooms-history":
        return <RoomsHistory />;

      case "rooms-scheduled":
        return <RoomsScheduled />;

      case "recordings":
        return <div className="p-6">Recordings coming soon...</div>;

      case "settings":
        return <div className="p-6">Settings coming soon...</div>;

      default:
        return <CreateRoom />;
    }
  };

  if (loading || !isSupervisor) {
    return null;
  }

  return (
    <RoomConfigurationLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderComponent()}
    </RoomConfigurationLayout>
  );
};

export default RoomConfigurationDashboard;