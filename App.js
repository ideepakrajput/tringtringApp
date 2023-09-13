import "react-native-gesture-handler";
import { View, Text, Image } from "react-native";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  AntDesign
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import icon from "./assets/icon.png";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Contact from "./screens/Contact";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Logout from "./screens/Logout";
import Prediction from "./screens/Prediction";

const Drawer = createDrawerNavigator();

export default function App() {
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
            backgroundColor: "#f4511e",
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
        <Drawer.Screen
          name="Prediction"
          options={{
            drawerLabel: "Prediction",
            title: "Prediction",
            drawerIcon: () => (
              <SimpleLineIcons name="home" size={20} color="#808080" />
            )
          }}
          component={Prediction}
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
          name="Contact"
          options={{
            drawerLabel: "Contact",
            title: "Contact",
            drawerIcon: () => (
              <MaterialCommunityIcons name="message-alert-outline" size={20} color="#808080" />
            )
          }}
          component={Contact}
        />
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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
