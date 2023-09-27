import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Settings from "../../screens/Settings";
import Login from "../../screens/Login";
import Signup from "../../screens/Signup";
import Prediction from "../../screens/Prediction";
import UserHistory from "../../screens/userHistory";
import PrizesData from "../../screens/PrizesData";
import icon from "../../assets/icon.png";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderMenu from "./HeaderMenu";
import { Image } from "react-native";

let authenticatedUserByGoogle;

const ScreenMenu = () => {
  //global state
  const { state, setState } = useContext(AuthContext);

  //auth condition true false
  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    authenticatedUserByGoogle = JSON.parse(data)?.verified_email;
  };

  const authenticatedUser = state?.user && state?.token;

  useEffect(() => {
    getLocalUser();
  }, [authenticatedUserByGoogle]);

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Login">
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Prediction"
            component={Prediction}
            options={{
              headerTitleAlign: "center",
              headerTitle: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="PrizesData"
            component={PrizesData}
            options={{
              headerTitleAlign: "center",
              headerTitle: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerTitleAlign: "center",
              headerTitle: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="UserHistory"
            component={UserHistory}
            options={{
              headerTitleAlign: "center",
              headerTitle: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default ScreenMenu;
