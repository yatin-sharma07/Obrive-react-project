"use client";

import React, { useState } from "react";
import RoomConfigurationLayout from "../layouts/RoomConfiguratoinLayout";

// Components
import CreateRoom from "../components/CreateRoom";
// import Templates from "../components/Templates";
// import ActiveRooms from "../components/ActiveRooms";
// import RoomRecordings from "../components/RoomRecordings";
// import Settings from "../components/Settings";

type ActiveSection =
  | "create-room"
  | "templates"
  | "active-rooms"
  | "recordings"
  | "settings";

const RoomConfigurationDashboard = () => {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("create-room");

  const renderComponent = () => {
    switch (activeSection) {
      case "create-room":
        return <CreateRoom />;

      case "templates":
        // return <Templates />;

      case "active-rooms":
        // return <ActiveRooms />;

      case "recordings":
        // return <RoomRecordings />;

      case "settings":
        // return <Settings />;

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