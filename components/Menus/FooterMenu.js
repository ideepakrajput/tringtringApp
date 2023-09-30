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
          color={route.name === "PrizesData" && "orange"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserHistory")}>
        <FontAwesome5
          name="history"
          style={styles.iconStyle}
          color={route.name === "UserHistory" && "orange"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Prediction")}>
        <FontAwesome5
          name="home"
          style={styles.iconStyle}
          color={route.name === "Prediction" && "orange"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ReferAndEarn")}>
        <FontAwesome5
          name="share-square"
          style={styles.iconStyle}
          color={route.name === "ReferAndEarn" && "orange"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <FontAwesome5
          name="user"
          style={styles.iconStyle}
          color={route.name === "Settings" && "orange"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
});

export default FooterMenu;
