import { OTPVerification } from '@msg91comm/react-native-sendotp'
import Modal from "react-native-modal";
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import axios from 'axios';

const OtpSignIn = async () => {

    // Replace with your MSG91 API key
    const apiKey = '406611Tj5sg0N5D6511529cP1';

    // Recipient's phone number
    const phoneNumber = '917254880990';

    // Generate a random OTP (you can use a library for this)
    const otp = '1234';

    // MSG91 API endpoint for sending OTP
    const sendOtpUrl = 'https://api.msg91.com/api/v5/otp';

    // Prepare the payload for sending OTP
    const sendOtpPayload = {
        authkey: apiKey,
        mobile: phoneNumber,
    };

    // Send OTP
    await axios
        .post(sendOtpUrl, sendOtpPayload)
        .then((response) => {
            console.log('OTP sent successfully:', response.data);
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
        });

    const userEnteredOtp = '1234';

    // MSG91 API endpoint for OTP verification
    const verifyOtpUrl = 'https://api.msg91.com/api/v5/otp/verify';

    // Prepare the payload for OTP verification
    const verifyOtpPayload = {
        authkey: apiKey,
        mobile: phoneNumber,
    };

    // Verify OTP
    await axios
        .get(verifyOtpUrl, verifyOtpPayload)
        .then((response) => {
            const verificationStatus = response.data;
            if (verificationStatus.type === 'success') {
                console.log('OTP verified successfully.');
            } else {
                console.error('OTP verification failed:', verificationStatus.message);
            }
        })
        .catch((error) => {
            console.error('Error verifying OTP:', error);
        });
    return (
        <View style={{ flex: 1 }}>

        </View>
    );
}

export default OtpSignIn;