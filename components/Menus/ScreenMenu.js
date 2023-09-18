import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList, createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import icon from "../../assets/icon.png";
import Settings from "../../screens/Settings";
import Login from "../../screens/Login";
import Signup from "../../screens/Signup";
import Prediction from "../../screens/Prediction";
import UserHistory from "../../screens/userHistory";

const ScreenMenu = () => {
  //global state
  const [state, setState] = useContext(AuthContext);
  //auth condition true false
  const authenticatedUser = state?.user && state?.token;
  const Drawer = createDrawerNavigator();

  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    alert("logout Successfully");
  };

  return (
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
              {
                authenticatedUser ?
                  <DrawerItem
                    label={() => <Text>Logout</Text>}
                    icon={() => <SimpleLineIcons name="logout" size={20} color="#808080" />}
                    onPress={handleLogout}
                  />
                  :
                  <></>
              }
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

      {authenticatedUser ? (
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
        </>
      ) : (
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
      )}
    </Drawer.Navigator>
  );
};

export default ScreenMenu;
