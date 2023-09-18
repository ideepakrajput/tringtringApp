import "react-native-gesture-handler";
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RootNavigation from "./navigation";

export default function App() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const gettoken = async () => {
      setUserData(await AsyncStorage.getItem("userData"));
    }
    gettoken();
  }, [])

  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
