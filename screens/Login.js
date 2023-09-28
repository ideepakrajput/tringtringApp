import {
	View,
	Text,
	Image,
	Pressable,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { BASE_API_URL } from "../constants/baseApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [isPasswordShown, setIsPasswordShown] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");

	const [token, setToken] = useState("");
	const [userInfo, setUserInfo] = useState(null);

	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId: "641271354850-j48bfubrgpibbv8p18hep9iiqolb9fhh.apps.googleusercontent.com",

		expoClientId: "641271354850-cskndlb8h4ir0g5vptm8b9c9jqfrroaj.apps.googleusercontent.com",
	});

	useEffect(() => {
		handleEffect();
	}, [response, token]);

	async function handleEffect() {
		const user = await getLocalUser();
		if (!user) {
			if (response?.type === "success") {
				// setToken(response.authentication.accessToken);
				getUserInfo(response.authentication.accessToken);
				navigation.navigate("InputNo");
			}
		} else {
			setUserInfo(user);
		}
	}

	const getLocalUser = async () => {
		const data = await AsyncStorage.getItem("@user");
		if (!data) return null;
		return JSON.parse(data);
	};

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
			await AsyncStorage.setItem("@user", JSON.stringify(user));
			setUserInfo(user);
		} catch (error) {
			Alert.alert(error.response.data.message);
		}
	};

	const handleLogin = async () => {
		try {
			if (!phoneNumber) {
				Alert.alert("Please fill the phone number !");
			} else if (!password) {
				Alert.alert("please fill the password !");
			}

			setLoading(false);

			const resp = await axios.post(`${BASE_API_URL}api/user/login`, {
				phoneNumber,
				password
			});

			setState(resp.data.data);

			await AsyncStorage.setItem("@auth", JSON.stringify(resp.data.data));

			navigation.navigate("Prediction");

		} catch (error) {
			setLoading(true);
			Alert.alert(error.response.data.message);
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<View style={{ flex: 1, marginHorizontal: 22 }}>
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							fontSize: 22,
							fontWeight: "bold",
							marginTop: 20,
							color: COLORS.black,
						}}
					>
						Hi, Welcome!
					</Text>
				</View>

				<View style={{ marginBottom: 12, marginTop: 22 }}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: 400,
							marginVertical: 8,
						}}
					>
						Mobile Number
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
							placeholder="+91"
							placeholderTextColor={COLORS.black}
							keyboardType="numeric"
							style={{
								width: "12%",
								borderRightWidth: 1,
								borderLeftColor: COLORS.grey,
								height: "100%",
							}}
						/>

						<TextInput
							placeholder="Enter your phone number"
							placeholderTextColor={COLORS.black}
							keyboardType="numeric"
							style={{
								width: "80%",
							}}
							value={phoneNumber}
							onChangeText={(text) => setPhoneNumber(text)}
						/>
					</View>
				</View>

				<View style={{ marginBottom: 12 }}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: 400,
							marginVertical: 8,
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

				<View
					style={{
						flexDirection: "row",
						marginVertical: 6,
					}}
				>
					<Checkbox
						style={{ marginRight: 8 }}
						value={isChecked}
						onValueChange={setIsChecked}
						color={isChecked ? COLORS.primary : undefined}
					/>

					<Text>Remember Me</Text>
				</View>

				{loading ?
					<Button
						title="Login"
						filled
						style={{
							marginTop: 18,
							marginBottom: 4,
						}}
						onPress={handleLogin}
					/>
					:
					<ActivityIndicator size="large" ></ActivityIndicator>
				}

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginVertical: 20,
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
					<Text style={{ fontSize: 14 }}>Or Login with</Text>
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
						disabled={!request}
						onPress={() => {
							promptAsync();
						}}
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
						marginVertical: 22,
					}}
				>
					<Text style={{ fontSize: 16, color: COLORS.black }}>
						Don't have an account ?{" "}
					</Text>
					<Pressable onPress={() => navigation.navigate("Signup")}>
						<Text
							style={{
								fontSize: 16,
								color: COLORS.primary,
								fontWeight: "bold",
								marginLeft: 6,
							}}
						>
							Register
						</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Login;
