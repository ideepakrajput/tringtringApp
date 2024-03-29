import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
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
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ip, setIp] = useState("");

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
      } else if (!gender) {
        Alert.alert("Please fill the gender !");
      } else if (!age) {
        Alert.alert("Please fill the age !");
      } else if (!password) {
        Alert.alert("Please create your password !");
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
          gender,
          age,
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
  //OTP
  const handleSendOtp = async () => {
    // Validate phone number (you can add your validation logic)
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number.');
      setIsOtpSent(false);
      return;
    }
    if (phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      setIsOtpSent(false);
      return;
    }
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const fourDigitOTP = ('000' + randomNumber).slice(-4);
    setSentOtp(fourDigitOTP);
    console.log(fourDigitOTP);
    await axios.get(`https://smslogin.co/v3/api.php?username=JKDEVI&apikey=0c3d970adcb15c0f85fc&mobile=${phoneNumber}&senderid=IPEMAA&message=Here+is+your+OTP+${fourDigitOTP}+for+Knowledge+Day+Registration+at+Poultry+India+2023.`);
    setIsOtpSent(true);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22, justifyContent: "space-between" }}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 10,
              color: COLORS.black,
            }}
          >
            Create Account
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}
          >
            Start Predicting and Win Exciting Prizes 🏆
          </Text>
        </View>

        <View style={{ marginBottom: 8, marginTop: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Name
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={COLORS.black}
              style={{
                width: "100%",
              }}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
        </View>

        <View>
          {/* OTP */}
          {!isOtpSent ? (
            // Page to input phone number and send OTP
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                }}
              >
                Mobile Number
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Page with OTP input
            <View>
              <Text style={styles.title}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
              />
              <>
                {verified ?
                  <Text style={{ color: "green", fontSize: 16, textAlign: "center", marginTop: 8 }}>Mobile Number Verified !</Text>
                  :
                  <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  </TouchableOpacity>
                }
              </>
            </View>
          )}

        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Gender
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle} r
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select your gender"
            value={gender}
            onChange={item => {
              setGender(item.value);
            }}
          />
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Age
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your age"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              style={{
                width: "80%",
              }}
              value={age}
              onChangeText={(text) => setAge(text)}
            />
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Password
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
              }}
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
        <View style={{ marginBottom: 8, marginTop: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Referral Code
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter referral code"
              placeholderTextColor={COLORS.black}
              style={{
                width: "100%",
              }}
              value={referralCode}
              onChangeText={(text) => setReferralCode(text)}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />

          <Text>I agree to the terms and conditions</Text>
        </View>

        {verified ?
          <Button
            onPress={handleSignup}
            title="Sign Up"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
          :
          <Text style={{ color: "red", fontSize: 16, textAlign: "center", marginTop: 10 }}>Verify Your Number First !!!</Text>
        }

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >

          <TouchableOpacity
            onPress={() => promptAsync()}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/google.png")}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />

            <Text>Google</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Already have an account
          </Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
