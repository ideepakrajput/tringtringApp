import "react-native-gesture-handler";
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from './RootNavigation';

import RootNavigation from "./navigation";


export default function App() {

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigation />
    </NavigationContainer>
  );
}
