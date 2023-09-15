import { View, Text, Image, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLORS from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import axios from 'axios';

import formatDateToDDMMYYYY from '../constants/dataTime';
import { ordinalDateFormat } from '../constants/dataTime';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const PredictionData = ({ navigation }) => {
    const [yesterdayPredictionNumber, setYesterdayPredictionNumber] = useState('');
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState('');

    useEffect(() => {
        async function fetchData() {
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.get(BASE_API_URL + "api/winning/user/prediction_number", config).then((res) => {
                // const todayDate = formatDateToDDMMYYYY(new Date());
                // const predictionDate = formatDateToDDMMYYYY(res.data[(res.data.length - 1)].transaction_date);

                // if (todayDate === predictionDate) {
                //     setPredictionNumber(res.data[(res.data.length - 1)].prediction_number.toString().split(""));
                //     setisPredicted(true);
                // }

                function getYesterdayDate() {
                    // const today = new Date();
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);

                    const yyyy = yesterday.getFullYear();
                    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
                    const dd = String(yesterday.getDate()).padStart(2, '0');

                    return `${yyyy}-${mm}-${dd}`;
                }

                // Get yesterday's date as a string
                const yesterdayDate = getYesterdayDate();

                // Filter data to get items with a transaction date matching yesterday
                const yesterdayPredictions = res.data.filter(item => {
                    const itemDate = item.transaction_date.split('T')[0]; // Extract the date portion
                    return itemDate === yesterdayDate;
                });

                // Extract prediction numbers from yesterday's data
                const yesterdayPredictionNumbers = yesterdayPredictions.map(item => item.prediction_number);

                setYesterdayPredictionNumber(yesterdayPredictionNumbers[yesterdayPredictionNumbers.length - 1]);

            }).catch((err) => {
                console.log(err);
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

                    let yesterdayWinningNumber = null;

                    // Loop through the data and find yesterday's winning number
                    for (const item of res.data) {
                        if (item.created_date_time.startsWith(yesterdayDateStr)) {
                            yesterdayWinningNumber = item.winning_number;
                            break; // Stop once you find the winning number for yesterday
                        }
                    }
                    setYesterdayWinningNumber(yesterdayWinningNumber);
                })
                .catch(err => {
                    Alert.alert(err);
                });
        }
        fetchData();
    }, []);


    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    return (
        <SafeAreaView style={styles.container}>

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
    container: {
        flex: 1, flexDirection: "column", justifyContent: "space-around", backgroundColor: COLORS.white
    },
})

export default PredictionData;