import {
	View,
	Text,
	Image,
	Pressable,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Dimensions
} from "react-native";
import React, { useState, useContext, useEffect, useCallback } from "react";
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
import EStyleSheet from 'react-native-extended-stylesheet';

WebBrowser.maybeCompleteAuthSession();
let entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth > 340 ? 18 : 16 });

const Login = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const { setAuthenticatedUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [isPasswordShown, setIsPasswordShown] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
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
						await AsyncStorage.setItem("@auth", JSON.stringify(res.data.data));
						setState(res.data.data);
						setAuthenticatedUser(true);

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

	const handleLogin = async () => {
		try {
			if (!phoneNumber) {
				Alert.alert("Error", "Please fill the phone number !");
			} else if (!password) {
				Alert.alert("Error", "please fill the password !");
			} else {
				setLoading(false);

				await axios.post(`${BASE_API_URL}api/user/login`, {
					phoneNumber,
					password
				}).then(async (res) => {
					if (res.status == 201) {
						Alert.alert("Error", "User not found, Please sign up first");
						setLoading(true);
					}
					if (res.status == 200) {
						await AsyncStorage.setItem("@auth", JSON.stringify(res.data.data));
						setState(res.data.data);
						setAuthenticatedUser(true);

						navigation.navigate("Prediction");
					}
					if (res.status == 401) {
						Alert.alert("Error", "User not found, Please sign up first")
						setLoading(true);
					}
				});
			}
		} catch (error) {
			setLoading(true);
			Alert.alert("Error", error.response.data.message);
		}
	}

	return (
		<SafeAreaView>
			<View style={styles.container}>
				<View style={{ marginBottom: 16 }}>
					<Text style={[styles.text, { color: COLORS.black }]}>Let's <Text style={[styles.text, { color: COLORS.primary }]}>get you in</Text></Text>
				</View>

				<View>
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
				</View>

				<View>
					<Text style={styles.label}>Password</Text>

					<View style={styles.inputView}>
						<TextInput
							placeholder="Enter your Password"
							placeholderTextColor={COLORS.se}
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

				<View style={[styles.label, { flexDirection: "row" }]}>
					<Checkbox
						style={{ marginRight: 8 }}
						value={isChecked}
						onValueChange={setIsChecked}
						color={isChecked ? COLORS.primary : undefined}
					/>

					<Text style={{ fontSize: 16, fontFamily: "lato-reg", fontWeight: "500", marginBottom: 20 }}>Remember Me</Text>
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
						marginVertical: 24,
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
					<Text style={{ fontSize: 16 }}>Or Login with</Text>
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
						marginVertical: 24,
					}}
				>
					<Text style={{ fontSize: 16, color: COLORS.black }}>
						Don't Have an Account ?{" "}
					</Text>
					<Pressable onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.text3}>Register</Text>
					</Pressable>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					<Text style={{ fontSize: 16, color: COLORS.black }}>
						Forgot Password ?{" "}
					</Text>
					<Pressable onPress={() => navigation.navigate("ForgetPassword")}>
						<Text style={styles.text3}>Create New Pasword</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = EStyleSheet.create({
	container: {
		paddingHorizontal: "1rem",
		paddingTop: "4rem",
	},
	text: {
		fontSize: "2rem",
		fontWeight: 800,
		fontFamily: "lato-reg"
	},
	text2: {
		fontSize: "1rem",
		fontWeight: 800,
		fontFamily: "lato-light",
		color: COLORS.secondary,
	},
	label: {
		fontSize: "1rem",
		fontFamily: "lato-reg",
		fontWeight: 500,
		marginTop: 16,
		marginBottom: 8,
	},
	inputView: {
		width: "100%",
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
		fontSize: "1rem",
		fontWeight: "500"
	},
	text3: {
		fontSize: 16,
		fontWeight: 500,
		fontFamily: "lato-reg",
		color: COLORS.primary,
		fontWeight: "bold",
		marginLeft: 2,
	}
})

export default Login;