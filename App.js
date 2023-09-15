import "react-native-gesture-handler";
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from "react-native";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import icon from "./assets/icon.png";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Logout from "./screens/Logout";
import Prediction from "./screens/Prediction";
import UserHistory from "./screens/userHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

export default function App() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const gettoken = async () => {
      setUserData(await AsyncStorage.getItem("userData"));
    }
    gettoken();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={
          (props) => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#f4f4f4",
                    borderBottomWidth: 1
                  }}
                >
                  <Image
                    source={icon}
                    style={{
                      height: 130,
                      width: 130,
                    }}
                  />

                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            )
          }
        }
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 250
          },
          headerStyle: {
            backgroundColor: "#F8DE22",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          },
          drawerLabelStyle: {
            color: "#111"
          }
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => (
              <SimpleLineIcons name="home" size={20} color="#808080" />
            )
          }}
          component={Home}
        />


        {
          userData === null ?
            <>
              <Drawer.Screen
                name="Login"
                options={{
                  drawerLabel: "Login",
                  title: "Login",
                  drawerIcon: () => (
                    <SimpleLineIcons name="login" size={20} color="#808080" />
                  )
                }}
                component={Login}
              />
              <Drawer.Screen
                name="Signup"
                options={{
                  drawerLabel: "Signup",
                  title: "Signup",
                  drawerIcon: () => (
                    <AntDesign name="adduser" size={20} color="#808080" />
                  )
                }}
                component={Signup}
              />
            </>
            :
            <>
              <Drawer.Screen
                name="Prediction"
                options={{
                  drawerLabel: "Prediction",
                  title: "Prediction",
                  drawerIcon: () => (
                    <Ionicons name="add-outline" size={22} color="#808080" />
                  )
                }}
                component={Prediction}
              />
              <Drawer.Screen
                name="History"
                options={{
                  drawerLabel: "History",
                  title: "History",
                  drawerIcon: () => (
                    <MaterialCommunityIcons name="history" size={22} color="#808080" />
                  )
                }}
                component={UserHistory}
              />
              <Drawer.Screen
                name="Settings"
                options={{
                  drawerLabel: "Settings",
                  title: "Settings",
                  drawerIcon: () => (
                    <SimpleLineIcons name="settings" size={20} color="#808080" />
                  )
                }}
                component={Settings}
              />
              <Drawer.Screen
                name="Logout"
                options={{
                  drawerLabel: "Logout",
                  title: "Logout",
                  drawerIcon: () => (
                    <SimpleLineIcons name="logout" size={20} color="#808080" />
                  )
                }}
                component={Logout}
              />
            </>
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
