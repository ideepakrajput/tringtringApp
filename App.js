import "react-native-gesture-handler";
import React from 'react';
import "expo-dev-client";

import { NavigationContainer } from "@react-navigation/native";

import RootNavigation from "./navigation";
export default function App() {

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
