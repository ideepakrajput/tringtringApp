import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const Logout = async ({ navigation }) => {

    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("token");

    Alert.alert("Logout Successfully. See You Soon !")

    navigation.navigate("Home");

    return (
        <>

        </>
    )
}

export default Logout;