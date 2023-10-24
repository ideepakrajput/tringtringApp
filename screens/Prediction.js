import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, Share, KeyboardAvoidingView, ActivityIndicator, Button } from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import COLORS from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { formatTimestampToTimeDate, ordinalDateFormat } from '../constants/dataTime';
import FooterMenu from '../components/Menus/FooterMenu';
import { openYouTubeLink } from '../constants/openYouTubeLink';
import { useRewardedAd, useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { PredictionContext } from '../context/predictionContext';
import { MaterialIcons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6067634275916377/4705877289';
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';

const Prediction = ({ navigation }) => {
    const [predictionNumber, setPredictionNumber] = useState("");
    const [predictionData, setPredictionData] = useState([]);
    const [yesterdayPredictionsData, setYesterdayPredictionsData] = useState([]);
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    const [yesterdayWinningURL, setYesterdayWinningURL] = useState("");
    const [visible, setVisible] = useState(false);
    const [addPrediction, setAddPrediction] = useState(false);
    const [wantEdit, setWantEdit] = useState(false);
    const [id, setId] = useState("");
    const [isloading, setIsLoading] = useState(false);


    const [editPN, setPN] = useState(null);

    const { announced, setAnnounced } = useContext(PredictionContext);
    const editNumber = useRef();
    const { state } = useContext(AuthContext);

    const { predictions, setPredictions } = useContext(PredictionContext);
    const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
    const { addedPredictions, setAddedPredictions } = useContext(PredictionContext);
    const { editedPredictions, setEditedPredictions } = useContext(PredictionContext);
    const { adsViewed, setAdsViewed } = useContext(PredictionContext);

    const { isLoaded: isInterstitialLoaded, load: loadInterstitial, show: showInterstitial } = useInterstitialAd(
        interstitialAdUnitId,
        {
            requestNonPersonalizedAdsOnly: true,
        }
    );

    // Rewarded Ad
    const { isLoaded: isRewardedLoaded, load: loadRewarded, show: showRewarded, isEarnedReward } = useRewardedAd(
        rewardedAdUnitId,
        {
            requestNonPersonalizedAdsOnly: true,
        }
    );

    useEffect(() => {
        // Load interstitial and rewarded ads when the component mounts
        if (!isInterstitialLoaded) {
            loadInterstitial();
        }
        if (!isRewardedLoaded) {
            loadRewarded();
        }
    }, [isInterstitialLoaded, loadInterstitial, isRewardedLoaded, loadRewarded]);

    useEffect(() => {
        const incrementPredictions = async () => {
            const token = state?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            if (isEarnedReward) {
                await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: 1, addedPredictions: 0, editedPredictions: 0, adsViewed: 1 }, config).then((res) => {
                    setPredictions(res.data.predictions);
                    setTempPredictions(res.data.tempPredictions);
                    setAddedPredictions(res.data.addedPredictions);
                    setEditedPredictions(res.data.editedPredictions);
                    setAdsViewed(res.data.adsViewed);
                })
            }
        }
        incrementPredictions();
    }, [isEarnedReward])

    const showAds = async () => {
        if (adsViewed >= 2) {
            Alert.alert("Sorry !", "You can watch only 2 videos per today ! Share with friends to get more predictions.")
        } else {
            showRewarded();
        }
    }

    const showDialog = (p, i) => {
        console.log("Id is ----->", i)
        setPN(p)
        setId(i)
        // setPredictionNumber(p)
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setPN(null)
    };
    const handleDelete = () => {
        // The user has pressed the "Delete" button, so here you can do your own logic.
        // ...Your logic
        setVisible(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            const token = state?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            async function fetchData() {
                // await axios.get(`${BASE_API_URL}api/winning/user/prediction_number`, config).then((res) => {
                //     const data = res.data;
                //     // const currentDate = new Date().toISOString().split('T')[0];
                //     let currentDate = "";
                //     if (announced) {
                //         const tomorrow = new Date();
                //         tomorrow.setDate(tomorrow.getDate() + 1);
                //         currentDate = tomorrow.toISOString().split('T')[0];
                //     } else {
                //         currentDate = new Date().toISOString().split('T')[0];
                //     }
                //     let formattedYesterdayDate = "";
                //     if (announced) {
                //         const today = new Date();
                //         formattedYesterdayDate = today.toISOString().split('T')[0];
                //     } else {
                //         const yesterdayDate = new Date();
                //         yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                //         formattedYesterdayDate = yesterdayDate.toISOString().split('T')[0];
                //     }

                //     let lastUpdatedPredictionNumber = null;

                //     // Iterate through the data to find the prediction_numbers
                //     data.forEach((item) => {
                //         if (item.transaction_date.startsWith(currentDate)) {
                //             if (lastUpdatedPredictionNumber === null || item.updatedAt > lastUpdatedPredictionNumber.updatedAt) {
                //                 lastUpdatedPredictionNumber = item;
                //                 setTodayPredictionNumber(item.prediction_number);
                //             }
                //         } else if (item.transaction_date.startsWith(formattedYesterdayDate)) {
                //             setYesterdayPredictionNumber(item.prediction_number);
                //         }
                //     });

                // }).catch((err) => {
                //     console.log('====================================');
                //     console.log(err.response.data.message);
                //     console.log('====================================');
                // });

                await axios.get(`${BASE_API_URL}api/winning/winning_numbers`)
                    .then(res => {
                        let yesterdayDateStr = "";
                        if (announced) {
                            const currentDate = new Date();

                            // Subtract one day to get yesterday's date
                            const yesterdayDate = new Date(currentDate);

                            // Convert both dates to strings and extract only the date part
                            // const currentDateStr = currentDate.toISOString().slice(0, 10);
                            yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
                        } else {
                            const currentDate = new Date();

                            // Subtract one day to get yesterday's date
                            const yesterdayDate = new Date(currentDate);
                            yesterdayDate.setDate(currentDate.getDate() - 1);

                            // Convert both dates to strings and extract only the date part
                            // const currentDateStr = currentDate.toISOString().slice(0, 10);
                            yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
                        }

                        for (const item of res.data) {
                            if (item.created_date_time.startsWith(yesterdayDateStr)) {
                                setYesterdayWinningNumber(item.winning_number);
                                setYesterdayWinningURL(item.youtube_url);
                                break; // Stop once you find the winning number for yesterday
                            }
                        }
                    })
                    .catch(err => {
                        Alert.alert(err);
                    });
            }
            fetchData();
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
                console.log(result.data)
                const sortedData = await result.data.sort((a, b) => new Date(b.created_date_time) - new Date(a.created_date_time));
                let day = "";
                let yesterday = "";
                if (announced) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    day = tomorrow.toISOString().split('T')[0];
                    yesterday = new Date().toISOString().split('T')[0];
                } else {
                    day = new Date().toISOString().split('T')[0];
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    yesterday = yesterdayDate.toISOString().split('T')[0];
                }
                const todayDocuments = sortedData.filter(item => item.transaction_date.startsWith(day));
                const yesterdayDocuments = sortedData.filter(item => item.transaction_date.startsWith(yesterday));
                // Extract the last three updated prediction_number and created_date_time
                const lastThreePredictions = todayDocuments.map(item => ({
                    prediction_number: item.prediction_number,
                    _id: item._id
                }));
                const yesterdayPredictions = yesterdayDocuments.map(item => ({
                    prediction_number: item.prediction_number,
                    _id: item._id
                }));

                setYesterdayPredictionsData(yesterdayPredictions);
                setPredictionData(lastThreePredictions);
                console.log(predictionData)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    function handleAddPrediction() {
        setWantEdit(false);
        setPredictionNumber("");
        setAddPrediction(true);
        // setisPredicted(false);
    }
    function handleWantEdit() {
        setWantEdit(true);
        setPredictionNumber("");
        setAddPrediction(false);
        // setId(id);
        // setisPredicted(false);
    }

    async function handleEditPrediction() {
        loadInterstitial();
        setIsLoading(true);
        const token = state?.token;
        console.log(editPN);
        console.log(id);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.put(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber, id }, config);
        await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: 0, addedPredictions: 0, editedPredictions: 1, adsViewed: 0 }, config).then((res) => {
            setPredictions(res.data.predictions);
            setTempPredictions(res.data.tempPredictions);
            setAddedPredictions(res.data.addedPredictions);
            setEditedPredictions(res.data.editedPredictions);
            setAdsViewed(res.data.adsViewed);
        }).catch((err) => {
            console.log('====================================');
            console.log(err.response.data.message);
            console.log('====================================');
        });
        setIsLoading(false);
        setVisible(false);

    }

    const submitPrediction = async () => {
        loadInterstitial();
        setIsLoading(true);
        const token = state?.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (predictionNumber && predictionNumber.length == 5) {
                if (addPrediction) {
                    await axios.post(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber, announced }, config);
                    if (tempPredictions > 0) {
                        await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: -1, addedPredictions: 1, editedPredictions: 0, adsViewed: 0 }, config).then((res) => {
                            setPredictions(res.data.predictions);
                            setTempPredictions(res.data.tempPredictions);
                            setAddedPredictions(res.data.addedPredictions);
                            setEditedPredictions(res.data.editedPredictions);
                            setAdsViewed(res.data.adsViewed);
                        }).catch((err) => {
                            console.log('====================================');
                            console.log(err.response.data.message);
                            console.log('====================================');
                        });
                    } else {
                        await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: -1, tempPredictions: 0, addedPredictions: 1, editedPredictions: 0, adsViewed: 0 }, config).then((res) => {
                            setPredictions(res.data.predictions);
                            setTempPredictions(res.data.tempPredictions);
                            setAddedPredictions(res.data.addedPredictions);
                            setEditedPredictions(res.data.editedPredictions);
                            setAdsViewed(res.data.adsViewed);
                        }).catch((err) => {
                            console.log('====================================');
                            console.log(err.response.data.message);
                            console.log('====================================');
                        });
                    }
                    setIsLoading(false);
                } else if (wantEdit) {

                }
                else {
                    await axios.post(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber, announced }, config);
                    // const updatedEditCount = await axios.get(`${BASE_API_URL}api/user/edit_count`, config);
                    // setEditCount(updatedEditCount.data.editCount);
                    await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: -1, addedPredictions: 1, editedPredictions: 0, adsViewed: 0 }, config).then((res) => {
                        setPredictions(res.data.predictions);
                        setTempPredictions(res.data.tempPredictions);
                        setAddedPredictions(res.data.addedPredictions);
                        setEditedPredictions(res.data.editedPredictions);
                        setAdsViewed(res.data.adsViewed);
                    }).catch((err) => {
                        console.log('====================================');
                        console.log(err.response.data.message);
                        console.log('====================================');
                    });
                    setIsLoading(false);
                }
                // toggleAdsModal();
                showInterstitial();
                Alert.alert('Success', `Your prediction number is ${predictionNumber}`, [
                    {
                        text: 'Show Ads',
                        onPress: () => showAds(),
                        style: 'cancel',
                    },
                    {
                        text: 'Share',
                        onPress: () => navigation.navigate("ReferAndEarn"),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation.navigate("Prediction") },
                ]);
                // toggleModal();
                setVisible(false);
                // navigation.navigate("UserHistory");
            }
            else if (!predictionNumber) {
                setIsLoading(false);
                Alert.alert("Please enter your prediction number !")
            }
            else if (predictionNumber.length < 5) {
                setIsLoading(false);
                Alert.alert("Please enter 5 digit number !")
            }

        } catch (error) {
            setIsLoading(false);
            Alert.alert(error.response.data.message);
        }
    }

    // const handleShare = async (name) => {
    //     try {
    //         const result = await Share.share({
    //             title: `Tring Tring`,
    //             message:
    //                 `https://tring-tring.netlify.app/ \nHey ${name}! , I am using Tring Tring to PREDICT and WIN daily !!!\nJoin by my referral get bonus money and more predictions.`,
    //         });
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // shared with activity type of result.activityType
    //                 console.log('====================================');
    //                 console.log("Activity Type", result.activityType);
    //                 console.log("Activity Type", result.activityType);
    //                 console.log('====================================');
    //             } else {
    //                 // shared
    //                 console.log('====================================');
    //                 console.log("Shared");
    //                 console.log('====================================');
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // dismissed
    //             console.log('====================================');
    //             console.log("Dismiseds");
    //             console.log('====================================');
    //         }
    //     } catch (error) {
    //         Alert.alert(error.message);
    //     }
    // };

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    function numberToOrdinal(number) {
        switch (number) {
            case 1:
                return "First";
            case 2:
                return "Second";
            case 3:
                return "Third";
            default:
                return "Invalid Input"; // Handle other cases as needed
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "space-evenly" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 6, justifyContent: "space-between" }}
                enabled="true"
            >
                <View style={{ flex: 5 }}>
                    <>
                        <View style={{ flex: 2, alignItems: "center", marginVertical: 20 }}>
                            <Text
                                style={{ fontSize: 16, textAlign: "center", fontWeight: "900" }}
                            >
                                GUESS AND WIN 1 LAC RUPEES BEFORE 9 PM TODAY
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("PrizesData")}>
                                <Text style={{ color: "#00BF63", textAlign: "center", fontSize: 16, marginBottom: 20 }}>view more prizes</Text>
                            </TouchableOpacity>
                            <Text style={styles.text2}>
                                ENTER YOUR 5 DIGIT PREDICTION NUMBER
                            </Text>
                            {
                                announced ?
                                    <Text style={styles.text2}>
                                        FOR {ordinalDateFormat(tomorrowDate)}, DRAW @ TOMORROW 9 PM IST
                                    </Text>
                                    :
                                    <Text style={styles.text2}>
                                        FOR {ordinalDateFormat(new Date())}, DRAW @ 9 PM IST
                                    </Text>
                            }
                        </View>
                        <View style={{ flex: 2, alignItems: "center" }}>

                            {
                                (predictions + tempPredictions) <= 0 ?
                                    <>
                                        <Text style={styles.text1}><Text style={{ color: "red" }}>You have no more predictions left</Text></Text>
                                        <Text style={styles.text2}>Earn more predictions</Text>
                                        {adsViewed >= 2 ?
                                            <TouchableOpacity
                                                disabled={true}
                                                style={{
                                                    margin: 10,
                                                    backgroundColor: "lightgrey",
                                                    borderRadius: 15,
                                                    paddingHorizontal: 10
                                                }}
                                                onPress={() => showAds()}
                                            >
                                                <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Watch Ads</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => showAds()}
                                            >
                                                <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Watch Ads</Text>
                                            </TouchableOpacity>
                                        }
                                        <Text>OR</Text>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => navigation.navigate("ReferAndEarn")}
                                        >
                                            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Share with friends</Text>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <>
                                        {addedPredictions >= 3 ?
                                            <Text style={styles.text1}><Text style={{ color: "red" }}>You have reached the limit to predict the number for today.</Text></Text>
                                            :
                                            <>
                                                <Text style={styles.text2}>Your {numberToOrdinal(addedPredictions + 1)} Prediction</Text>
                                                <TextInput
                                                    style={styles.textInput}
                                                    maxLength={5}
                                                    autoFocus={true}
                                                    keyboardType='numeric'
                                                    placeholder='-----'
                                                    value={predictionNumber}
                                                    onChangeText={(text) => setPredictionNumber(text)}
                                                >
                                                </TextInput>
                                                <Text style={{ marginTop: -5, fontWeight: "bold", color: "green" }}>terms & conditions apply*</Text>
                                                {
                                                    isloading ? <ActivityIndicator></ActivityIndicator> :
                                                        <TouchableOpacity
                                                            style={styles.button}
                                                            onPress={submitPrediction}
                                                        >
                                                            <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Submit</Text>
                                                        </TouchableOpacity>
                                                }
                                            </>
                                        }
                                    </>
                            }
                            {/* <>
                                <TextInput
                                    style={styles.textInput}
                                    maxLength={5}
                                    autoFocus={true}
                                    keyboardType='numeric'
                                    placeholder='-----'
                                    value={predictionNumber}
                                    onChangeText={(text) => setPredictionNumber(text)}
                                >
                                </TextInput>
                                <Text style={{ marginTop: -5, fontWeight: "bold", color: "green" }}>terms & conditions apply*</Text>
                                {
                                    isloading ? <ActivityIndicator></ActivityIndicator> :
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={submitPrediction}
                                        >
                                            <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Submit</Text>
                                        </TouchableOpacity>
                                }
                            </> */}
                            {/* } */}
                        </View>
                    </>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {predictionData.map((item, index) => (
                            <View key={item._id} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                {index === 0 ?
                                    <Text style={styles.text1}>Your Number(s) : </Text> : <></>
                                }

                                {
                                    editedPredictions >= 3 ?
                                        <>
                                            <Text style={styles.text2}>{item.prediction_number}</Text>
                                            <TouchableOpacity
                                                disabled={true}
                                                style={{
                                                    backgroundColor: "lightgrey",
                                                    borderRadius: 15,
                                                    marginVertical: 5,
                                                    marginLeft: 5,
                                                    paddingHorizontal: 10,
                                                }}
                                                onPress={() => handleWantEdit(item._id)}
                                            >
                                                <MaterialIcons name="edit-off" size={24} color="grey" />
                                            </TouchableOpacity></>
                                        :
                                        <>
                                            <Text style={styles.text2}>{item.prediction_number}</Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "lightgrey",
                                                    borderRadius: 15,
                                                    marginVertical: 5,
                                                    marginLeft: 5,
                                                    paddingHorizontal: 10,
                                                }}
                                                onPress={() => showDialog(item.prediction_number, item._id)}
                                            >
                                                <MaterialIcons name="mode-edit" size={24} color="#00BF63" />
                                            </TouchableOpacity>
                                            <View style={styles.containerD}>
                                                <Dialog.Container visible={visible}>
                                                    <Dialog.Title>Edit</Dialog.Title>
                                                    <Dialog.Description>
                                                        You are edit your number {editPN}
                                                    </Dialog.Description>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        maxLength={5}
                                                        autoFocus={true}
                                                        keyboardType='numeric'
                                                        placeholder='-----'
                                                        value={predictionNumber}
                                                        onChangeText={(text) => setPredictionNumber(text)}
                                                    >
                                                    </TextInput>
                                                    {/* <Dialog.Input textInputRef={editNumber} label="Enter your number" /> */}
                                                    <Dialog.Button label="Cancel" onPress={handleCancel} />
                                                    <Dialog.Button label="Submit" onPress={() => handleEditPrediction()} />
                                                </Dialog.Container>
                                            </View>
                                        </>
                                }
                                <Text> {" | "} </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </KeyboardAvoidingView>
            <View style={{ flex: 1 }}>
                <Text style={styles.text1}>Yesterday</Text>
                <View style={{ flexDirection: "row", backgroundColor: "#00BF63", alignItems: "center", justifyContent: "space-around", borderRadius: 25 }}>
                    <View>
                        <Text style={styles.text2}>Your Number(s)</Text>
                        {yesterdayPredictionsData.length === 0 ?
                            <Text style={styles.winning_number}>{" - "}</Text>
                            :
                            <>
                                {
                                    yesterdayPredictionsData.map((item) => (
                                        <View key={item._id}>
                                            <Text style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>{item.prediction_number}</Text>
                                        </View>
                                    ))
                                }
                            </>
                        }
                    </View>
                    <TouchableOpacity onPress={() => openYouTubeLink(yesterdayWinningURL)}>
                        <Image
                            source={require("../assets/utubelogo.png")}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                        >
                        </Image>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text2}>Winning Number</Text>
                        <Text style={styles.winning_number}>{yesterdayWinningNumber || " - "}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
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
        backgroundColor: "#00BF63",
        borderRadius: 15,
        paddingHorizontal: 10
    },
    editbutton: {
        backgroundColor: "#00BF63",
        borderRadius: 15,
        marginVertical: 5,
        marginLeft: 5,
        paddingHorizontal: 10,
    },
    containerD: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
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
    table: {
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'black',
        justifyContent: "center"
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        alignSelf: "center",
        marginHorizontal: 20
    },
    headerCell: {
        flex: 1,
        justifyContent: 'center',
        fontWeight: 'bold',
        textAlign: "center"
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'green', // Background color of the modal
        padding: 16,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalText: {
        color: 'white', // Text color
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        color: 'red', // Close button text color
        fontSize: 16,
        fontWeight: 'bold',
    },
    shareButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 50,
        marginLeft: 10,
    },
    shareButtonText: {
        color: '#fff',
    },
});

export default Prediction;