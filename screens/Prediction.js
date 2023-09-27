import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useContext, useState } from 'react';
import COLORS from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { formatTimestampToTimeDate, ordinalDateFormat } from '../constants/dataTime';
import FooterMenu from '../components/Menus/FooterMenu';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const Prediction = ({ navigation }) => {
    const { isPredicted, setisPredicted } = useContext(AuthContext);
    const [predictionNumber, setPredictionNumber] = useState();
    // const [predictionData, setData] = useState();
    const [yesterdayPredictionNumber, setYesterdayPredictionNumber] = useState();
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    const [todayPredictionNumber, setTodayPredictionNumber] = useState(null);
    const [isBefore830PM, setIsBefore830PM] = useState(false);
    const [wantEdit, setWantEdit] = useState(false);
    const [editCount, setEditCount] = useState(Number);

    //global state
    const { state } = useContext(AuthContext);

    const predictionData = [
        {
            prediction_number: 22222,
            transaction_date: ""
        },
        {
            prediction_number: 22222,
            transaction_date: ""
        },
    ]

    useFocusEffect(
        React.useCallback(() => {
            const token = state?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            async function getEditCount() {
                await axios.get(`${BASE_API_URL}api/user/edit_count`, config).then((res) => {
                    setEditCount(res.data.editCount);
                })
            }
            getEditCount();

            async function fetchData() {
                await axios.get(`${BASE_API_URL}api/winning/user/prediction_number`, config).then((res) => {
                    const data = res.data;
                    data.sort((a, b) => {
                        return new Date(b.transaction_date) - new Date(a.transaction_date);
                    });
                    // setData(data.slice(0, 2));
                    // console.log('====================================');
                    // console.log(predictionData);
                    // console.log('====================================');

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
        const token = state?.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (predictionNumber && predictionNumber.length == 5) {
                await axios.post(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber }, config);
                navigation.navigate("History");
                if (wantEdit) {
                    await axios.post(`${BASE_API_URL}api/user/edit_count`, {}, config);
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
        <SafeAreaView style={{ flex: 1, justifyContent: "space-evenly" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                enabled="true"
            >
                <View style={{ flex: 3 }}>
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
                                                Your Prediction Number is <Text style={{ color: "green" }}>{todayPredictionNumber}</Text>
                                            </Text>
                                            {
                                                editCount === 3 ?
                                                    <>
                                                        <Text style={styles.text1}><Text style={{ color: "red" }}>You have reached your daily edit limit</Text></Text>
                                                    </>
                                                    :
                                                    <>
                                                        <Text style={styles.text2}>Want to edit your prediction number </Text>
                                                        <Text style={styles.text2}><Text style={{ color: "#F8DE22" }}>{3 - editCount} more chances </Text> </Text>
                                                        <TouchableOpacity
                                                            style={styles.button}
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
                                                style={styles.button}
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
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.text1}>My Predictions</Text>
                    {predictionData.map((index, item) => {
                        <View key={index} style={{ columnGap: 3 }}>
                            <Text style={styles.text1}>{index + 1}</Text>
                            <Text style={styles.text1}>{item.prediction_number}</Text>
                            <Text style={styles.text1}>{yesterdayPredictionNumber}</Text>
                            <Text style={styles.text1}>{formatTimestampToTimeDate(item.transaction_date)}</Text>
                        </View>
                    })}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.text1}>Yesterday Winning Number</Text>
                    <View style={{ flexDirection: "row", backgroundColor: "#00BF63", alignItems: "center", justifyContent: "space-around", borderRadius: 50 }}>
                        <Text style={styles.winning_number}>{yesterdayWinningNumber != null ? { yesterdayWinningNumber } : "N/A"}</Text>
                        <Image
                            source={require("../assets/utubelogo.png")}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                        >
                        </Image>
                        <View>
                            <Text style={styles.text2}>Your Prediction</Text>
                            <Text style={styles.winning_number}>{yesterdayPredictionNumber != null ? { yesterdayPredictionNumber } : "N/A"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <FooterMenu />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


const styles = EStyleSheet.create({
    text1: {
        fontSize: "21rem",
        fontWeight: "bold",
        color: COLORS.black,
        textAlign: "center",
    },
    text2: {
        fontSize: "15rem",
        fontWeight: "bold",
        color: COLORS.black,
        textAlign: "center"
    },
    winning_number: {
        fontSize: "25rem",
        fontWeight: "bold",
        color: COLORS.white,
        padding: "7rem",
        textAlign: "center",
    },
    text3: {
        fontSize: "30rem",
        fontWeight: "bold",
        color: COLORS.black,
        textAlign: "center"
    },
    button: {
        margin: 10,
        backgroundColor: "green",
        borderRadius: 15,
        padding: 10,
        width: 125
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