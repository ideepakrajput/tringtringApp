import { useState, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import SelectPicker from '../components/SelectPicker';
import NotificationSwitch from '../components/NotificationSwitch';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URL } from "../constants/baseApiUrl";
import FooterMenu from '../components/Menus/FooterMenu';
import ProfileDetailsCard from '../components/ProfileDetails';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Settings() {
  const { state, setState } = useContext(AuthContext);

  const options = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Malyalam", "Bengali"];
  const [selectedOption, setSelectedOption] = useState(null);

  //logout
  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    await AsyncStorage.removeItem("@user");
    alert("logout Successfully");
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
    <>
      <View
        style={{
          flex: 3,
          alignItems: "center",
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
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
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
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <FooterMenu />
      </View>
    </>
  );
}