import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BASE_API_URL } from '../constants/baseApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';

const OtpVerificationPage = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [ip, setIp] = useState("");

    const { state, setState } = useContext(AuthContext);
    const { setAuthenticatedUser } = useContext(AuthContext);

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
    useEffect(() => {
        getLocalUser();
    }, []);

    const getLocalUser = async () => {
        const data = await AsyncStorage.getItem("@user");
        if (!data) return null;
        return JSON.parse(data);
    };
    const handleVerifyOtp = () => {
        // Simulate OTP verification logic
        const expectedOtp = sentOtp; // Replace with the actual OTP received or generated
        if (otp === expectedOtp) {
            Alert.alert('Success', 'OTP verified successfully!');
            handleSignup();
        } else {
            Alert.alert('Error', 'Incorrect OTP. Please try again.');
        }
    };
    const handleSignup = async () => {
        try {
            await axios.get("https://api.ipify.org/?format=json").then((res) => {
                setIp(res.data.ip);
            }).catch((err) => {
                console.log(err.response.data.message);
            });

            const user = await getLocalUser();

            await axios.post(`${BASE_API_URL}api/user/register`, {
                name: user.name,
                phoneNumber,
                email: user.email,
                password: "true",
                ip_address: ip
            }).then(async (res) => {
                await AsyncStorage.setItem("@auth", JSON.stringify(res.data.data));
                setState(res.data.data);
                setAuthenticatedUser(true);

                navigation.navigate("Prediction");
            });
        } catch (error) {
            Alert.alert(error.response.data.message);
        }
    };

    return (
        <View style={styles.container}>
            {!isOtpSent ? (
                // Page to input phone number and send OTP
                <View>
                    <Text style={styles.title}>Verify Your Phone Number</Text>
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
                    <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
    },
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
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default OtpVerificationPage;
