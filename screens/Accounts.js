
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import FooterMenu from '../components/Menus/FooterMenu';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
const config = require("../package.json");
const appVersion = config.version;

export default function Accounts({ navigation }) {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24, justifyContent: "space-between" }}>
        <View>
          <View style={styles.box}>
            <View>
              <MaterialIcons onPress={() => navigation.navigate("BasicDetails")} style={styles.iconStyle} name="mode-edit" size={24} color="black" />
            </View>
            <View style={styles.card}>
              <Text onPress={() => navigation.navigate("BasicDetails")} style={styles.text1}>Basic Details</Text>
              <Text onPress={() => navigation.navigate("BasicDetails")} style={styles.text2}>Name, Phone Number</Text>
            </View>
          </View>

          <View style={styles.box}>
            <View>
              <MaterialIcons onPress={() => navigation.navigate("LanguageSettings")} style={styles.iconStyle} name="language" size={24} color="black" />
            </View>
            <View style={styles.card}>
              <Text onPress={() => navigation.navigate("LanguageSettings")} style={styles.text1}>Language Settings</Text>
              <Text onPress={() => navigation.navigate("LanguageSettings")} style={styles.text2}>Choose your Preferred Language</Text>
            </View>
          </View>

          <View style={styles.box}>
            <Ionicons onPress={() => navigation.navigate("Settings")} style={styles.iconStyle} name="settings-outline" size={24} color="black" />
            <Text onPress={() => navigation.navigate("Settings")} style={[styles.card, styles.text1]}>App Settings</Text>
          </View>
        </View>
        <Text style={[styles.text2, { paddingBottom: 24 }]}>App Version v{appVersion}</Text>
      </View>
      <View style={{ flex: 0.1, justifyContent: "flex-end" }}>
        <FooterMenu />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  iconStyle: {
    backgroundColor: COLORS.prize,
    borderRadius: 50,
    padding: 14
  },
  card: {
    alignSelf: "center",
    gap: 4
  },
  text1: {
    fontSize: 16,
    fontFamily: "lato-reg",
    fontWeight: 600,
  },
  text2: {
    fontSize: 12,
    fontFamily: "lato-reg",
    fontWeight: 400,
    color: COLORS.secondary
  },
})