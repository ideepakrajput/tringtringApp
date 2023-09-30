import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import COLORS from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { formatTimestampToTimeDate, ordinalDateFormat } from '../constants/dataTime';
import { Table, Row } from 'react-native-table-component';
import FooterMenu from '../components/Menus/FooterMenu';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const Prediction = ({ navigation }) => {
    const { isPredicted, setisPredicted } = useContext(AuthContext);
    const [predictionNumber, setPredictionNumber] = useState("");
    const [predictionData, setPredictionData] = useState([]);
    const [yesterdayPredictionNumber, setYesterdayPredictionNumber] = useState();
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    const [todayPredictionNumber, setTodayPredictionNumber] = useState(null);
    const [isBefore830PM, setIsBefore830PM] = useState(false);
    const [wantEdit, setWantEdit] = useState(false);
    const { editCount, setEditCount } = useContext(AuthContext);

    const { state } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            const token = state?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            async function fetchData() {
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

            // Cleanup the timer when the component unmounts
            return () => {
                clearInterval(intervalId);
            }
        }, [])
    )

    useEffect(() => {
        // Fetch your data asynchronously and update the state
        const token = state?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const fetchData = async () => {
            try {
                // Replace this with your actual data fetching logic
                const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config)
                const sortedData = await result.data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

                // Extract the last three updated prediction_number and created_date_time
                const lastThreePredictions = sortedData.slice(0, 3).map(item => ({
                    prediction_number: item.prediction_number,
                    transaction_date: item.transaction_date,
                }));

                // Table data
                const tableData = lastThreePredictions.map(prediction => [
                    prediction.prediction_number,
                    formatTimestampToTimeDate(prediction.transaction_date),
                ]);

                setPredictionData(tableData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once on mount


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
                navigation.navigate("UserHistory");
                if (wantEdit) {
                    const decrementValue = 1;
                    await axios.post(`${BASE_API_URL}api/user/edit_count`, { decrementValue }, config);
                    Alert.alert("Prediction Number Updated Successfully");
                }
                else {
                    await axios.post(`${BASE_API_URL}api/user/per_day_edit_count`, { incrementValue: 3 }, config);
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
                                                editCount <= 0 ?
                                                    <>
                                                        <Text style={styles.text1}><Text style={{ color: "red" }}>You have reached your daily edit limit</Text></Text>
                                                    </>
                                                    :
                                                    <>
                                                        <Text style={styles.text2}>Want to edit your prediction number </Text>
                                                        <Text style={styles.text2}><Text style={{ color: "#F8DE22" }}>{editCount} more chances </Text> </Text>
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
                                    <Text style={styles.text1}>
                                        Your Prediction Number is <Text style={{ color: "green" }}>{todayPredictionNumber}</Text>
                                    </Text>
                                </View>
                            </>
                    }
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={styles.text1}>My Predictions</Text>
                    <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                        {predictionData
                            .map((rowData, index) => (
                                <Row key={index} data={rowData} />
                            ))}
                    </Table>
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
                            <Text style={styles.winning_number}>{yesterdayPredictionNumber}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <FooterMenu />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView >
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
    },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6 },
})

export default Prediction;