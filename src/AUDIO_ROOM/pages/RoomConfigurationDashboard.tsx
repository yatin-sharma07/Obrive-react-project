"use client";

import React, { useState } from "react";
import RoomConfigurationLayout from "../layouts/RoomConfiguratoinLayout";

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
  const [activeSection, setActiveSection] = useState<ActiveSection>("create-room");

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