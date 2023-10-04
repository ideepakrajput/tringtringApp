import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { BASE_API_URL } from "../constants/baseApiUrl";
import axios from "axios";

const ForgetPassword = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    //OTP
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [verified, setVerified] = useState(false);
    //OTP

    const handleResetPassword = async () => {
        try {
            await axios.post(`${BASE_API_URL}api/user/reset_password`, {
                phoneNumber,
                password,
            });
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert(error.response.data.message);
        }
    };
    //OTP
    const handleSendOtp = async () => {
        // Validate phone number (you can add your validation logic)
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
            Alert.alert("Error, Please add a valid phone number.");
        }
        else if (phoneNumberExists) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);

            const fourDigitOTP = ('000' + randomNumber).slice(-4);
            setSentOtp(fourDigitOTP);
            console.log('====================================');
            console.log(fourDigitOTP);
            console.log(sentOtp);
            console.log('====================================');

            await axios.get(`https://smslogin.co/v3/api.php?username=JKDEVI&apikey=0c3d970adcb15c0f85fc&mobile=${phoneNumber}&senderid=IPEMAA&message=Here+is+your+OTP+${fourDigitOTP}+for+Knowledge+Day+Registration+at+Poultry+India+2023.`);
            setIsOtpSent(true);
        } else {
            Alert.alert("User doesn't exits.");
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
                        Reset Password
                    </Text>
                </View>
                {verified ?
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 22,
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
                        <Button
                            onPress={handleResetPassword}
                            title="Change Your Password"
                            filled
                            style={{
                                marginTop: 18,
                                marginBottom: 4,
                                marginVertical: 20
                            }}
                        />
                    </View>
                    :
                    <View style={{ marginBottom: 12 }}>
                        {/* OTP */}
                        {!isOtpSent ? (
                            // Page to input phone number and send OTP
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginVertical: 22,
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
                                        <Text style={{ color: "green", fontSize: 16, textAlign: "center", marginTop: 10 }}>Mobile Number Verified !</Text>
                                        :
                                        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                                            <Text style={styles.buttonText}>Verify OTP</Text>
                                        </TouchableOpacity>
                                    }
                                </>
                            </View>
                        )}
                    </View>
                }
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 16
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
export default ForgetPassword;
