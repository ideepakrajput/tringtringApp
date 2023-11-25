import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import SelectPicker from '../components/SelectPicker';
import NotificationSwitch from '../components/NotificationSwitch';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URL } from "../constants/baseApiUrl";
import FooterMenu from '../components/Menus/FooterMenu';
import ProfileDetailsCard from '../components/ProfileDetails';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
const config = require("../package.json");
const appVersion = config.version;

export default function Settings() {
  const { state, setState } = useContext(AuthContext);

  const options = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Malyalam", "Bengali"];
  const [selectedOption, setSelectedOption] = useState(null);

  //logout
  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    await AsyncStorage.removeItem("@user");
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const token = state?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  async function handleSettings() {
    await axios.post(`${BASE_API_URL}api/user/settings`, {
      language: selectedOption,
    }, config).then(() => {
      alert("Your settings has been updated");
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View
        style={{
          flex: 3,
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <ProfileDetailsCard />
        <View>
          <SelectPicker options={options} onSelect={handleSelect} />
          <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}>Notifications</Text>
          <NotificationSwitch />
          <TouchableOpacity
            style={{ backgroundColor: "#00BF63", padding: 10, borderRadius: 15, marginTop: 20 }}
            onPress={handleSettings}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center" }}>Save Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={{ flexDirection: "row", columnGap: 10 }} onPress={handleLogout}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "red", alignSelf: "center" }}>Logout</Text>
            <FontAwesome5
              name="sign-out-alt"
              color={"red"}
              style={{
                alignSelf: "center",
                fontSize: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24, justifyContent: "space-between" }}>
        <View>
          <View style={styles.box}>
            <View>
              <MaterialIcons style={styles.iconStyle} name="mode-edit" size={24} color="black" />
            </View>
            <View style={styles.card}>
              <Text style={styles.text1}>Basic Details</Text>
              <Text style={styles.text2}>Name, Phone Number</Text>
            </View>
          </View>

          <View style={styles.box}>
            <View>
              <MaterialIcons style={styles.iconStyle} name="language" size={24} color="black" />
            </View>
            <View style={styles.card}>
              <Text style={styles.text1}>Language Settings</Text>
              <Text style={styles.text2}>Choose your Preferred Language</Text>
            </View>
          </View>

          <View style={styles.box}>
            <Ionicons style={styles.iconStyle} name="settings-outline" size={24} color="black" />
            <Text style={[styles.card, styles.text1]}>App Settings</Text>
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
    backgroundColor: COLORS.history,
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