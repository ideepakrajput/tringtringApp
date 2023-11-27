import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import NotificationSwitch from '../components/NotificationSwitch';
import { FontAwesome5 } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
    const { state, setState } = useContext(AuthContext);

    //logout
    const handleLogout = async () => {
        setState({ token: "", user: null });
        await AsyncStorage.removeItem("@auth");
        await AsyncStorage.removeItem("@user");
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24, justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>Notifications</Text>
                    <NotificationSwitch />
                </View>
                <View style={{ paddingBottom: 16 }}>
                    <TouchableOpacity style={{ flexDirection: "row", columnGap: 8 }} onPress={handleLogout}>
                        <FontAwesome5
                            name="sign-out-alt"
                            color={"red"}
                            style={{
                                alignSelf: "center",
                                fontSize: 25,
                            }}
                        />
                        <Text style={{ fontSize: 16, color: "red", alignSelf: "center" }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}