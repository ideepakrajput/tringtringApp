import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const OtpVerificationPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');

    const handleSendOtp = async () => {
        // Validate phone number (you can add your validation logic)
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }
        if (phoneNumber.length < 10) {
            Alert.alert("Error, Please add a valid phone number.");
        }
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const sixDigitOTP = ('000000' + randomNumber).slice(-6);
        setSentOtp(sixDigitOTP);
        console.log('====================================');
        console.log(sixDigitOTP);
        console.log(sentOtp);
        console.log('====================================');

        await axios.get(`https://smslogin.co/v3/api.php?username=JKDEVI&apikey=0c3d970adcb15c0f85fc&mobile=${phoneNumber}&senderid=IPEMAA&message=Here+is+your+OTP+${sixDigitOTP}+for+Knowledge+Day+Registration+at+Poultry+India+2023.`);
        setIsOtpSent(true);
    };

    const handleVerifyOtp = () => {
        // Simulate OTP verification logic
        const expectedOtp = sentOtp; // Replace with the actual OTP received or generated
        if (otp === expectedOtp) {
            Alert.alert('Success', 'OTP verified successfully!');
        } else {
            Alert.alert('Error', 'Incorrect OTP. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {!isOtpSent ? (
                // Page to input phone number and send OTP
                <View>
                    <Text style={styles.title}>Enter Phone Number</Text>
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
