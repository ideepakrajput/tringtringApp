import React from "react";
import { AuthProvider } from "./context/authContext";
import ScreenMenu from "./components/Menus/ScreenMenu";
import ScheduledNotification from "./components/ScheduledNotification";

const RootNavigation = () => {
  return (
    <AuthProvider>
      <ScheduledNotification />
      <ScreenMenu />
    </AuthProvider>
  );
};

export default RootNavigation;
