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
      <TouchableOpacity onPress={() => navigation.navigate("PrizesData")}>
        <MaterialCommunityIcons
          name="cash-multiple"
          style={styles.iconStyle}
          color={route.name === "PrizesData" ? "green" : "white"}
        />
        <Text style={[styles.textStyle, route.name === "PrizesData" ? styles.active : styles.inactive]}>Prizes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserHistory")}>
        <FontAwesome5
          name="history"
          style={styles.iconStyle}
          color={route.name === "UserHistory" ? "green" : "white"}
        />
        <Text style={[styles.textStyle, route.name === "UserHistory" ? styles.active : styles.inactive]}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Prediction")}>
        <FontAwesome5
          name="home"
          style={styles.iconStyle}
          color={route.name === "Prediction" ? "green" : "white"}
        />
        <Text style={[styles.textStyle, route.name === "Prediction" ? styles.active : styles.inactive]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ReferAndEarn")}>
        <FontAwesome5
          name="share-square"
          style={styles.iconStyle}
          color={route.name === "ReferAndEarn" ? "green" : "white"}
        />
        <Text style={[styles.textStyle, route.name === "ReferAndEarn" ? styles.active : styles.inactive]}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <FontAwesome5
          name="user"
          style={styles.iconStyle}
          color={route.name === "Settings" ? "green" : "white"}
        />
        <Text style={[styles.textStyle, route.name === "Settings" ? styles.active : styles.inactive]}>My Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "grey",
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
  textStyle: {
    fontWeight: "bold"
  },
  active: {
    color: "green"
  },
  inactive: {
    color: "white"
  }
});

export default FooterMenu;
