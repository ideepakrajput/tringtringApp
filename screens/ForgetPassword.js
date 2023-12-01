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
    const [Cpassword, setCPassword] = useState("");
    //OTP
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [verified, setVerified] = useState(false);
    //OTP

    const handleResetPassword = async () => {
        if (password === Cpassword) {
            try {
                await axios.post(`${BASE_API_URL}api/user/reset_password`, {
                    phoneNumber,
                    password,
                });
                navigation.navigate("Login");
                Alert.alert('Success', 'Password Changed Successfully!');
            } catch (error) {
                Alert.alert(error.response.data.message);
            }
        } else {
            Alert.alert("Mismatch", "Password didn't match !")
        }
    };
    //OTP
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
            Alert.alert("Error, Please add a valid phone number.");
        }
        else if (phoneNumberExists) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);

            const fourDigitOTP = ('000' + randomNumber).slice(-4);
            setSentOtp(fourDigitOTP);
            console.log(fourDigitOTP);

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
            Alert.alert('Success', 'OTP verification successful!');
            setVerified(true);
        } else {
            Alert.alert('Error', 'Incorrect OTP. Please try again.');
        }
    };
    //OTP
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={styles.container}>
                {isOtpSent
                    ?
                    <>
                        {verified
                            ?
                            <View>
                                <View style={{ marginBottom: 32 }}>
                                    <Text style={[styles.text, { color: COLORS.black }]}>Change <Text style={[styles.text, { color: COLORS.primary }]}>Password</Text></Text>
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
                                <Button
                                    title="Change Password"
                                    filled
                                    style={{
                                        marginTop: 18,
                                        marginBottom: 4,
                                    }}
                                    onPress={handleResetPassword}
                                />
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

                                    <Text style={[styles.label, { textAlign: "center" }]}>Didn’t get a code? <Text onPress={handleSendOtp} style={{ color: COLORS.primary }}>Resend</Text></Text>
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
                            <Text style={[styles.text, { color: COLORS.black }]}>Change <Text style={[styles.text, { color: COLORS.primary }]}>Password</Text></Text>
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
                    </View>
                }
            </View>
        </SafeAreaView>
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
});
export default ForgetPassword;
