import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import { BASE_API_URL } from "../constants/baseApiUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from "../context/authContext";

WebBrowser.maybeCompleteAuthSession();

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState("");

  //OTP
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const data = [{ label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Others', value: 'others' }]

  const { state, setState } = useContext(AuthContext);
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "641271354850-s3s89c9101j3pv63i4ult965gv7uncsp.apps.googleusercontent.com",
    expoClientId: "641271354850-5jd5i3o6kial8kps5mm412bg4ki82lrl.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      await getUserInfo(response.authentication.accessToken);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      const result = await axios.get(`${BASE_API_URL}api/user/users`);
      const userData = await result.data;

      function doesEmailExists(emailToFind) {
        return userData.some((user) => user.email == emailToFind);
      }
      function findPhoneNumberByEmail(email) {
        const user = userData.find(user => user.email === email);
        return user ? user.phoneNumber : null;
      }

      const phoneNumber = findPhoneNumberByEmail(user.email);
      const emailExists = await doesEmailExists(user.email);
      if (emailExists) {
        await axios.post(`${BASE_API_URL}api/user/login`, {
          phoneNumber,
          password: "true"
        }).then(async (res) => {
          if (res.status == 200) {
            setAuthenticatedUser(true);

            setState(res.data.data);

            await AsyncStorage.setItem("@auth", JSON.stringify(res.data.data));

            navigation.navigate("Prediction");
          }
          if (res.status == 401) {
            Alert.alert(res.data.message)
            setLoading(true);
          }
        });
      } else {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        navigation.navigate("OtpVerificationPage");
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  const handleSignup = async () => {
    try {
      if (!name) {
        Alert.alert("Please fill the name !");
      } else if (!phoneNumber) {
        Alert.alert("Please fill the phone number !");
      } else if (!password) {
        Alert.alert("Please create your password !");
      } else if (password === Cpassword) {
        Alert.alert("Password didnt match !")
      } else if (password.length < 5) {
        Alert.alert("Password should be minimum 5 characters !");
        return;
      } else {
        await axios.get("https://api.ipify.org/?format=json").then((res) => {
          setIp(res.data.ip);
        });

        const resp = await axios.post(`${BASE_API_URL}api/user/register`, {
          name,
          phoneNumber,
          password,
          ip_address: ip,
          referralCode
        });

        await AsyncStorage.setItem("@auth", JSON.stringify(resp.data.data));
        setState(resp.data.data);
        setAuthenticatedUser(true);

        navigation.navigate("Prediction");
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  const handleSendOtp = async () => {
    const result = await axios.get(`${BASE_API_URL}api/user/users`);
    const userData = await result.data;
    function doesPhoneNumberExist(phoneNumberToFind) {
      return userData.some((user) => user.phoneNumber == phoneNumberToFind);
    }
    const phoneNumberExists = await doesPhoneNumberExist(phoneNumber);

    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    else if (phoneNumber.length != 10) {
      Alert.alert('Error', 'Please add a valid phone number.');
    }
    else if (!phoneNumberExists) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);

      const fourDigitOTP = ('000' + randomNumber).slice(-4);
      setSentOtp(fourDigitOTP);
      console.log(fourDigitOTP);
      await axios.get(`https://smslogin.co/v3/api.php?username=JKDEVI&apikey=0c3d970adcb15c0f85fc&mobile=${phoneNumber}&senderid=IPEMAA&message=Here+is+your+OTP+${fourDigitOTP}+for+Knowledge+Day+Registration+at+Poultry+India+2023.`);
      setIsOtpSent(true);
    } else if (phoneNumberExists) {
      Alert.alert("Eror", "Phone Number already registered, Try With Another Phone Number !");
    }
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification logic
    const expectedOtp = sentOtp; // Replace with the actual OTP received or generated
    if (otp === expectedOtp) {
      Alert.alert('Success', 'OTP verified successfully!');
      setVerified(true);
    } else {
      Alert.alert('Error', 'Incorrect OTP. Please try again.');
    }
  };
  //OTP
  return (
    <ScrollView>
      <View style={styles.container}>
        {isOtpSent
          ?
          <>
            {verified
              ?
              <View>
                <View style={{ marginBottom: 32 }}>
                  <Text style={[styles.text, { color: COLORS.black }]}>Sign <Text style={[styles.text, { color: COLORS.primary }]}>Up</Text></Text>
                </View>
                <View>
                  <Text style={styles.label}>Name</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Enter your name"
                      placeholderTextColor={COLORS.secondary}
                      style={styles.inputBox}
                      value={name}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                <View>
                  <Text style={styles.label}>Password</Text>

                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Enter your Password"
                      placeholderTextColor={COLORS.secondary}
                      secureTextEntry={isPasswordShown}
                      style={styles.inputBox}
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                    />

                    <TouchableOpacity
                      onPress={() => setIsPasswordShown(!isPasswordShown)}
                      style={{
                        position: "absolute",
                        right: 12,
                      }}
                    >
                      {isPasswordShown == true ? (
                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                      ) : (
                        <Ionicons name="eye" size={24} color={COLORS.black} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.label}>Confirm Password</Text>

                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Re-Enter your Password"
                      placeholderTextColor={COLORS.secondary}
                      secureTextEntry={isPasswordShown}
                      style={styles.inputBox}
                      value={Cpassword}
                      onChangeText={(text) => setCPassword(text)}
                    />

                    <TouchableOpacity
                      onPress={() => setIsPasswordShown(!isPasswordShown)}
                      style={{
                        position: "absolute",
                        right: 12,
                      }}
                    >
                      {isPasswordShown == true ? (
                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                      ) : (
                        <Ionicons name="eye" size={24} color={COLORS.black} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.label}>Referral Code(if any)</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Enter your Referral code"
                      placeholderTextColor={COLORS.secondary}
                      style={styles.inputBox}
                      value={referralCode}
                      onChangeText={(text) => setReferralCode(text)}
                    />
                  </View>
                </View>
                <View style={[styles.label, { flexDirection: "row" }]}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? COLORS.primary : undefined}
                  />

                  <Text style={{ fontSize: 16, fontFamily: "lato-reg", fontWeight: "500", marginBottom: 20 }}>I agree to the terms and conditions</Text>
                </View>
                {loading ?
                  <Button
                    title="Submit"
                    filled
                    style={{
                      marginTop: 18,
                      marginBottom: 4,
                    }}
                    onPress={handleSignup}
                  />
                  :
                  <ActivityIndicator size="large" ></ActivityIndicator>
                }
              </View>
              :
              <View>
                <View style={{ marginBottom: 32 }}>
                  <Text style={[styles.text, { color: COLORS.black }]}>Verification</Text>
                  <Text style={{ fontFamily: "lato-reg", fontSize: 16 }}>We’ve sent a code to +91 {phoneNumber}</Text>
                </View>
                <View>
                  <TextInput
                    placeholder=" - - - - "
                    placeholderTextColor={COLORS.secondary}
                    keyboardType="numeric"
                    maxLength={4}
                    style={{ textAlign: "center", fontSize: 40, color: COLORS.primary }}
                    value={otp}
                    onChangeText={(text) => setOtp(text)}
                  />

                  <Text style={[styles.label, { textAlign: "center" }]}>Didn’t get a code? <Text nPress={handleSendOtp} style={{ color: COLORS.primary }}>Resend</Text></Text>
                </View>
                <Button
                  title="Continue"
                  filled
                  style={{
                    marginTop: 20,
                    marginBottom: 4,
                  }}
                  onPress={handleVerifyOtp}
                />
              </View>
            }
          </>
          :
          <View>
            <View style={{ marginBottom: 32 }}>
              <Text style={[styles.text, { color: COLORS.black }]}>Sign <Text style={[styles.text, { color: COLORS.primary }]}>Up</Text></Text>
            </View>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputView}>
              <TextInput
                placeholder="+91"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={{
                  fontSize: 22,
                  fontWeight: "500",
                  borderLeftColor: COLORS.secondary,
                }}
              />
              <TextInput
                placeholder="Enter your Mobile No"
                placeholderTextColor={COLORS.secondary}
                keyboardType="numeric"
                style={[styles.inputBox, { width: "89%" }]}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>
            <Button
              title="Send OTP"
              filled
              style={{
                marginTop: 20,
                marginBottom: 4,
              }}
              onPress={handleSendOtp}
            />
            <Text style={[styles.label, { textAlign: "center" }]}>Already Have an Account? <Text onPress={() => navigation.navigate("Login")} style={{ color: COLORS.primary }}>Login</Text></Text>
          </View>
        }
      </View>
    </ScrollView >
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  text: {
    fontSize: 32,
    fontWeight: 800,
    fontFamily: "lato-bold"
  },
  label: {
    fontSize: 16,
    fontFamily: "lato-bold",
    fontWeight: 500,
    marginTop: 16,
    marginBottom: 8,
  },
  inputView: {
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8
  },
  inputBox: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 22,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 22
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 22
  },
});
export default Signup;
