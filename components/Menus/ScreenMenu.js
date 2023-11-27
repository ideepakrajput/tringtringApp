import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Text } from "react-native";
import Accounts from "../../screens/Accounts";
import Login from "../../screens/Login";
import Signup from "../../screens/Signup";
import Prediction from "../../screens/Prediction";
import UserHistory from "../../screens/userHistory";
import PrizesData from "../../screens/PrizesData";
import icon from "../../assets/icon.png";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderMenu from "./HeaderMenu";
import { Image } from "react-native";
import ReferAndEarn from "../../screens/ReferAndEarn";
import ForgetPassword from "../../screens/ForgetPassword";
import OtpVerificationPage from "../../screens/OtpVerification";
import Welcome from "../../screens/Welcome";
import InputNumber from "../../screens/InputNumber";
import BasicDetails from "../../screens/BasicDetails";
import LanguageSettings from "../../screens/LanguageSettings";
import Settings from "../../screens/Settings";
import COLORS from "../../constants/colors";

const ScreenMenu = () => {
  //global state
  const { authenticatedUser } = useContext(AuthContext);

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Prediction"
            component={Prediction}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="PrizesData"
            component={PrizesData}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Accounts"
            component={Accounts}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="ReferAndEarn"
            component={ReferAndEarn}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="UserHistory"
            component={UserHistory}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="InputNumber"
            component={InputNumber}
            options={{
              headerTitle: "",
              headerLeft: () => <Image style={{ width: 80, height: 50 }} source={icon} />,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="BasicDetails"
            component={BasicDetails}
            options={{
              headerTitle: () => { return (<Text style={{ fontSize: 24, fontFamily: "lato-reg", fontWeight: "800" }}>Basic <Text style={{ color: COLORS.primary }}>Details</Text></Text>) }
            }}
          />
          <Stack.Screen
            name="LanguageSettings"
            component={LanguageSettings}
            options={{
              headerTitle: () => { return (<Text style={{ fontSize: 24, fontFamily: "lato-reg", fontWeight: "800" }}>Language <Text style={{ color: COLORS.primary }}>Settings</Text></Text>) }
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerTitle: () => { return (<Text style={{ fontSize: 24, fontFamily: "lato-reg", fontWeight: "800", color: COLORS.primary }}>Settings</Text>) }
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
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
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerificationPage"
        component={OtpVerificationPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default ScreenMenu;
