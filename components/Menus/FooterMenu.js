import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import COLORS from "../../constants/colors";

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[route.name === "PrizesData" ? { padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("PrizesData")}>
        <MaterialCommunityIcons
          name="cash-multiple"
          style={[route.name === "PrizesData" ? styles.active : styles.iconStyle]}
        />
        <Text style={[route.name === "PrizesData" ? styles.activeTextStyle : styles.textStyle]}>Prizes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "UserHistory" ? { padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("UserHistory")}>
        <FontAwesome5
          name="history"
          style={[route.name === "UserHistory" ? styles.active : styles.iconStyle]}
        />
        <Text style={[route.name === "UserHistory" ? styles.activeTextStyle : styles.textStyle]}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "Prediction" ? { backgroundColor: COLORS.primary, borderRadius: 50, padding: 15 } : { backgroundColor: COLORS.primary, borderRadius: 50, padding: 15 }]} onPress={() => navigation.navigate("Prediction")}>
        <AntDesign
          name="home"
          style={[styles.iconStyle, { color: "white" }]}
        />
        <Text style={[styles.textStyle, { color: "white" }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "ReferAndEarn" ? { padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("ReferAndEarn")}>
        <FontAwesome5
          name="share-square"
          style={[route.name === "ReferAndEarn" ? styles.active : styles.iconStyle]}
        />
        <Text style={[route.name === "ReferAndEarn" ? styles.activeTextStyle : styles.textStyle]}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[route.name === "Settings" ? { padding: 15 } : { padding: 15 }]} onPress={() => navigation.navigate("Settings")}>
        <FontAwesome5
          name="user"
          style={[route.name === "Settings" ? styles.active : styles.iconStyle]} activeTextStyle
          color={!route.name === "Settings" ? "#00BF63" : "white"}
        />
        <Text style={[route.name === "Settings" ? styles.activeTextStyle : styles.textStyle]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#D1D5DB",
    borderTopWidth: 1,
    paddingTop: 8,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  iconStyle: {
    alignSelf: "center",
    fontSize: 24,
    color: "black"
  },
  active: {
    alignSelf: "center",
    fontSize: 24,
    color: COLORS.primary
  },
  textStyle: {
    fontFamily: "lato-reg",
    color: "black",
    textAlign: "center"
  },
  activeTextStyle: {
    fontFamily: "lato-reg",
    color: COLORS.primary,
    textAlign: "center"
  }
});

export default FooterMenu;
