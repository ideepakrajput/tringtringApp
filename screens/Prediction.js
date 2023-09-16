import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import COLORS from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { ordinalDateFormat } from '../constants/dataTime';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const Prediction = () => {
    const [isPredicted, setisPredicted] = useState(false);
    const [predictionNumber, setPredictionNumber] = useState();
    const [yesterdayPredictionNumber, setYesterdayPredictionNumber] = useState();
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    const [todayPredictionNumber, setTodayPredictionNumber] = useState(null);
    const [isBefore830PM, setIsBefore830PM] = useState(false);
    const [wantEdit, setWantEdit] = useState(false);
    const [editCount, setEditCount] = useState(0);

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const token = await AsyncStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.get(`${BASE_API_URL}api/winning/user/prediction_number`, config).then((res) => {
                    const data = res.data;

                    const currentDate = new Date().toISOString().split('T')[0];

                    // Calculate yesterday's date by subtracting one day from the current date
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const formattedYesterdayDate = yesterdayDate.toISOString().split('T')[0];

                    let lastUpdatedPredictionNumber = null;

                    // Iterate through the data to find the prediction_numbers
                    data.forEach((item) => {
                        if (item.transaction_date.startsWith(currentDate)) {
                            setisPredicted(true);
                            if (lastUpdatedPredictionNumber === null || item.updatedAt > lastUpdatedPredictionNumber.updatedAt) {
                                lastUpdatedPredictionNumber = item;
                                setTodayPredictionNumber(item.prediction_number);
                            }
                        } else if (item.transaction_date.startsWith(formattedYesterdayDate)) {
                            setYesterdayPredictionNumber(item.prediction_number);
                        }
                    });

                }).catch((err) => {
                    Alert.alert(err.response.data.message);
                });

                await axios.get(`${BASE_API_URL}api/winning/winning_numbers`)
                    .then(res => {
                        const currentDate = new Date();

                        // Subtract one day to get yesterday's date
                        const yesterdayDate = new Date(currentDate);
                        yesterdayDate.setDate(currentDate.getDate() - 1);

                        // Convert both dates to strings and extract only the date part
                        // const currentDateStr = currentDate.toISOString().slice(0, 10);
                        const yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);

                        for (const item of res.data) {
                            if (item.created_date_time.startsWith(yesterdayDateStr)) {
                                setYesterdayWinningNumber(item.winning_number);
                                break; // Stop once you find the winning number for yesterday
                            }
                        }
                    })
                    .catch(err => {
                        Alert.alert(err);
                    });
            }
            fetchData();


            function checkTime() {
                const currentDate = new Date();
                const currentHour = currentDate.getHours();
                const currentMinute = currentDate.getMinutes();

                // Compare with 20 (8 PM) and 30 (8:30 PM)
                setIsBefore830PM(currentHour < 20 || (currentHour === 20 && currentMinute < 30));
            }

            // Call the checkTime function when the component mounts
            checkTime();

            // Update the time check every minute
            const intervalId = setInterval(checkTime, 60000);

            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const timeUntilMidnight = midnight - now;

            const dailyResetTimer = setInterval(() => {
                setEditCount(0);
            }, timeUntilMidnight); // Reset daily

            // Cleanup the timer when the component unmounts
            return () => {
                clearInterval(dailyResetTimer);
                clearInterval(intervalId);
            }
        }, [])
    )

    function handleWantEdit() {
        setWantEdit(true);
        setisPredicted(false);
    }

    const submitPrediction = async () => {
        const token = await AsyncStorage.getItem("token");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (predictionNumber && predictionNumber.length == 5) {
                await axios.post(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber }, config);
                navigation.push("UserHistory");
                if (wantEdit) {
                    setEditCount(editCount + 1);
                    Alert.alert("Prediction Number Updated Successfully");
                }
                else {
                    Alert.alert("Prediction Number Added Successfully");

                }
            }
            else if (!predictionNumber) {
                Alert.alert("Please enter your prediction number !")
            }
            else if (predictionNumber.length < 5) {
                Alert.alert("Please enter 5 digit number !")
            }

        } catch (error) {
            Alert.alert(error.response.data.message);
        }
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    return (
        <SafeAreaView style={styles.container}>
            {
                isBefore830PM ?
                    <>

                        <View style={{ flex: 1, alignItems: "center" }}>
                            {isPredicted ?
                                <Text
                                    style={styles.text1}
                                >
                                    YOU HAVE ALREADY PREDICTED
                                </Text>
                                :
                                <>
                                    {
                                        wantEdit ?
                                            <Text
                                                style={styles.text1}
                                            >
                                                UPDATE YOUR 5 DIGIT PREDICTION NUMBER
                                            </Text>
                                            :
                                            <Text
                                                style={styles.text1}
                                            >
                                                ENTER YOUR 5 DIGIT PREDICTION NUMBER
                                            </Text>
                                    }
                                </>
                            }

                            <Text
                                style={styles.text2}
                            >
                                FOR {ordinalDateFormat(new Date())}, DRAW @ 9 PM IST
                            </Text>
                        </View>
                        <View style={{ flex: 2, alignItems: "center" }}>

                            {isPredicted ?
                                <>
                                    <Text style={styles.text1}>
                                        Your Prediction Number is {todayPredictionNumber}
                                    </Text>
                                    {
                                        editCount === 3 ?
                                            <>
                                                <Text style={styles.text1}>You have reached your daily edit limit</Text>
                                            </>
                                            :
                                            <>
                                                <Text style={styles.text2}>Want to edit your prediction number </Text>
                                                <Text style={styles.text2}>{3 - editCount} edit Left </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        margin: 10,
                                                        backgroundColor: "green",
                                                        borderRadius: 15,
                                                        padding: 10,
                                                        width: 125
                                                    }}
                                                    onPress={handleWantEdit}
                                                >
                                                    <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Edit</Text>
                                                </TouchableOpacity>
                                            </>
                                    }
                                </>
                                :
                                <>
                                    <TextInput
                                        style={styles.textInput}
                                        maxLength={5}
                                        autoFocus={true}
                                        keyboardType='numeric'
                                        placeholder=' - - - - -'
                                        value={predictionNumber}
                                        onChangeText={(text) => setPredictionNumber(text)}
                                    >
                                    </TextInput>
                                    <Text style={{ marginTop: -5, fontWeight: "bold", color: "green" }}>terms & conditions apply*</Text>
                                    <TouchableOpacity
                                        style={{
                                            margin: 10,
                                            backgroundColor: "green",
                                            borderRadius: 15,
                                            padding: 10,
                                            width: 125
                                        }}
                                        onPress={submitPrediction}
                                    >
                                        <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Submit</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </>
                    :
                    <>
                        <View style={{ flex: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 30, color: "red", textAlign: "center" }}>All entries are closed for today. You can come back and predict for tomorrow after 12 Midnight.</Text>
                        </View>
                    </>
            }
            <View style={{ flex: 2, alignItems: "center" }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        paddingTop: 10
                    }}
                >Yesterday's Winning Number ({ordinalDateFormat(currentDate)})</Text>
                <Text
                    style={{
                        letterSpacing: 15,
                        fontSize: 50
                    }}
                >{yesterdayWinningNumber}</Text>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        backgroundColor: "grey",
                        width: 250,
                        textAlign: "center",
                        padding: 10,
                        borderRadius: 15,
                        margin: 10
                    }}
                >Your Prediction {yesterdayPredictionNumber}</Text>
            </View>

            <View style={{ flex: 2, alignItems: "center" }}>
                <Image
                    source={require("../assets/facebook.png")}
                    style={{
                        height: 50,
                        width: 50,
                        marginTop: 20
                    }}
                    resizeMode="contain"
                >
                </Image>

                <Text
                    style={{
                        fontSize: 20,
                        textAlign: "center",
                        padding: 10,
                    }}
                >WATCH THE DRAW VIDEO</Text>
            </View>
            <View style={{ flex: 2, justifyContent: "flex-end", alignItems: "center", backgroundColor: "#F8DE22", padding: 20 }}>
                <Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        fontWeight: 'bold'
                    }}>
                    GET TO WIN
                </Text>
                <Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        fontWeight: 'bold'
                    }}>
                    AMAZING PRIZES !!!
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        backgroundColor: "red",
                        color: "white",
                        width: 300,
                        textAlign: "center",
                        padding: 10,
                        borderRadius: 15,
                        margin: 10
                    }}
                >
                    VIEW LIST OF PRIZES
                </Text>
            </View>
        </SafeAreaView >
    )
}


const styles = EStyleSheet.create({
    text1: {
        fontSize: "21rem",
        fontWeight: "bold",
        color: COLORS.black,
        padding: "4rem"
    },
    text2: {
        fontSize: "15rem",
        fontWeight: "bold",
        color: COLORS.black,
        padding: "4rem",
        textAlign: "center"
    },
    container: {
        flex: 1, flexDirection: "column", justifyContent: "space-around", backgroundColor: COLORS.white
    },
    textInput: {
        color: "green", fontSize: "36rem", borderWidth: 2, marginVertical: 10, paddingHorizontal: 10, width: "150rem", borderRadius: 15, borderColor: "green",
        textAlign: "center",
    }
})

export default Prediction;