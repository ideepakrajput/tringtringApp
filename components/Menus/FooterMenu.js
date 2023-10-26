import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[route.name === "PrizesData" ? { backgroundColor: "#00BF63", padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("PrizesData")}>
        <MaterialCommunityIcons
          name="cash-multiple"
          style={styles.iconStyle}
        />
        <Text style={styles.textStyle}>Prizes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "UserHistory" ? { backgroundColor: "#00BF63", padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("UserHistory")}>
        <FontAwesome5
          name="history"
          style={styles.iconStyle}
        />
        <Text style={styles.textStyle}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "Prediction" ? { backgroundColor: "#00BF63", padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("Prediction")}>
        <FontAwesome5
          name="home"
          style={styles.iconStyle}
        />
        <Text style={styles.textStyle}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "ReferAndEarn" ? { backgroundColor: "#00BF63", padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("ReferAndEarn")}>
        <FontAwesome5
          name="share-square"
          style={styles.iconStyle}
        />
        <Text style={styles.textStyle}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "Settings" ? { backgroundColor: "#00BF63", padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("Settings")}>
        <FontAwesome5
          name="user"
          style={styles.iconStyle}
          color={!route.name === "Settings" ? "#00BF63" : "white"}
        />
        <Text style={[styles.textStyle]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "grey",
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
    color: "white"
  },
  textStyle: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
});

export default FooterMenu;
