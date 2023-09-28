import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EStyleSheet from "react-native-extended-stylesheet";


const HeaderMenu = () => {
  const { state, setState } = useContext(AuthContext);
  const { editCount, setEditCount } = useContext(AuthContext);
  //logout
  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    await AsyncStorage.removeItem("@user");
    alert("logout Successfully");
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, columnGap: 10, borderRadius: 50, backgroundColor: "#00BF63" }}>
      <View>
        <Text style={styles.text2}>{3 - editCount}</Text>
        <Text style={styles.text2}>Predictions</Text>
      </View>
      <AntDesign name="pluscircleo" size={30} color="white" />
    </View>
  );
};
const styles = EStyleSheet.create({
  text2: {
    fontSize: "15rem",
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
});

export default HeaderMenu;
