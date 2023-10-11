import React from "react";
import { AuthProvider } from "./context/authContext";
import ScreenMenu from "./components/Menus/ScreenMenu";
import ScheduledNotification from "./components/ScheduledNotification";
import { PredictionProvider } from "./context/predictionContext";

const RootNavigation = () => {
  return (
    <AuthProvider>
      <PredictionProvider>
        <ScheduledNotification />
        <ScreenMenu />
      </PredictionProvider>
    </AuthProvider>
  );
};

export default RootNavigation;
