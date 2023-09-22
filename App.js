import "react-native-gesture-handler";
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from "@react-navigation/native";

import RootNavigation from "./navigation";


export default function App() {

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
