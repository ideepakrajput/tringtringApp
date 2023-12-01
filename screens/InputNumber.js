import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import COLORS from "../constants/colors";
import axios from "axios";
import { BASE_API_URL } from "../constants/baseApiUrl";
import { useRewardedAd, useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { AuthContext } from '../context/authContext';
import { PredictionContext } from '../context/predictionContext';

const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6067634275916377/4705877289';
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';
function InputNumber({ navigation }) {

    const [predictionNumber, setPredictionNumber] = useState("");
    // const [predictionData, setPredictionData] = useState([]);
    // const [yesterdayPredictionsData, setYesterdayPredictionsData] = useState([]);
    // const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    // const [yesterdayWinningURL, setYesterdayWinningURL] = useState("");
    // const [visible, setVisible] = useState(false);
    // const [id, setId] = useState("");
    const [isloading, setIsLoading] = useState(false);
    // const [editPN, setPN] = useState(null);

    const { announced, setAnnounced } = useContext(PredictionContext);
    const { predictions, setPredictions } = useContext(PredictionContext);
    const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
    const { addedPredictions, setAddedPredictions } = useContext(PredictionContext);
    const { editedPredictions, setEditedPredictions } = useContext(PredictionContext);
    const { adsViewed, setAdsViewed } = useContext(PredictionContext);

    // const [tooltipVisible, setTooltipVisible] = useState(false);

    const { state } = useContext(AuthContext);
    const token = state?.token;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Interstitial Ad
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
        if (!isInterstitialLoaded) {
            loadInterstitial();
        }
        if (!isRewardedLoaded) {
            loadRewarded();
        }
    }, [isInterstitialLoaded, loadInterstitial, isRewardedLoaded, loadRewarded]);

    // useEffect(() => {
    //     async function loadData() {
    //         await axios.get(`${BASE_API_URL}api/user/predictions`, config).then((res) => {
    //             setPredictions(res.data.predictions);
    //             setTempPredictions(res.data.tempPredictions);
    //             setAddedPredictions(res.data.addedPredictions);
    //             setEditedPredictions(res.data.editedPredictions);
    //             setAdsViewed(res.data.adsViewed);
    //         })
    //     }
    //     loadData();
    // }, [])

    useEffect(() => {
        const incrementPredictions = async () => {

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

    // const showDialog = (p, i) => {
    //     console.log("Id is ----->", i)
    //     setPN(p)
    //     setId(i)
    //     setPredictionNumber("");
    //     setVisible(true);
    // };

    // const handleCancel = () => {
    //     setVisible(false);
    //     setPN(null)
    // };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         async function fetchData() {
    //             await axios.get(`${BASE_API_URL}api/winning/winning_numbers`)
    //                 .then(res => {
    //                     let yesterdayDateStr = "";
    //                     if (announced) {
    //                         const currentDate = new Date();
    //                         const yesterdayDate = new Date(currentDate);
    //                         yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
    //                     } else {
    //                         const currentDate = new Date();
    //                         const yesterdayDate = new Date(currentDate);
    //                         yesterdayDate.setDate(currentDate.getDate() - 1);
    //                         yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
    //                     }

    //                     for (const item of res.data) {
    //                         if (item.created_date_time.startsWith(yesterdayDateStr)) {
    //                             setYesterdayWinningNumber(item.winning_number);
    //                             setYesterdayWinningURL(item.youtube_url);
    //                             break;
    //                         }
    //                     }
    //                 })
    //                 .catch(err => {
    //                     Alert.alert(err);
    //                 });
    //         }
    //         fetchData();
    //     }, [])
    // )

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config)
    //             const sortedData = await result.data.sort((a, b) => new Date(b.created_date_time) - new Date(a.created_date_time));
    //             let day = "";
    //             let yesterday = "";
    //             if (announced) {
    //                 const tomorrow = new Date();
    //                 tomorrow.setDate(tomorrow.getDate() + 1);
    //                 day = tomorrow.toISOString().split('T')[0];
    //                 yesterday = new Date().toISOString().split('T')[0];
    //             } else {
    //                 day = new Date().toISOString().split('T')[0];
    //                 const yesterdayDate = new Date();
    //                 yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    //                 yesterday = yesterdayDate.toISOString().split('T')[0];
    //             }
    //             const todayDocuments = sortedData.filter(item => item.transaction_date.startsWith(day));
    //             const yesterdayDocuments = sortedData.filter(item => item.transaction_date.startsWith(yesterday));
    //             const lastThreePredictions = todayDocuments.map(item => ({
    //                 prediction_number: item.prediction_number,
    //                 _id: item._id
    //             }));
    //             const yesterdayPredictions = yesterdayDocuments.map(item => ({
    //                 prediction_number: item.prediction_number,
    //                 _id: item._id
    //             }));

    //             setYesterdayPredictionsData(yesterdayPredictions);
    //             setPredictionData(lastThreePredictions);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData();
    // }, [predictionData]);

    // async function handleEditPrediction() {
    //     loadInterstitial();
    //     setIsLoading(true);
    //     try {
    //         if (predictionNumber && predictionNumber.length == 5) {
    //             await axios.put(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber, id }, config);
    //             await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: 0, addedPredictions: 0, editedPredictions: 1, adsViewed: 0 }, config).then((res) => {
    //                 setPredictions(res.data.predictions);
    //                 setTempPredictions(res.data.tempPredictions);
    //                 setAddedPredictions(res.data.addedPredictions);
    //                 setEditedPredictions(res.data.editedPredictions);
    //                 setAdsViewed(res.data.adsViewed);
    //             }).catch((err) => {
    //                 console.log('====================================');
    //                 console.log(err.response.data.message);
    //                 console.log('====================================');
    //             });

    //             showInterstitial();
    //             Alert.alert('Success', `Your entry successfully changed from ${editPN} to ${predictionNumber}`, [
    //                 {
    //                     text: 'Share',
    //                     onPress: () => navigation.navigate("ReferAndEarn"),
    //                     style: 'cancel',
    //                 },
    //                 { text: 'OK', onPress: () => navigation.navigate("Prediction") },
    //             ]);
    //             setIsLoading(false);
    //             setPredictionNumber("");
    //             setVisible(false);
    //         }
    //         else if (!predictionNumber) {
    //             setIsLoading(false);
    //             Alert.alert("Please enter your prediction number !")
    //         }
    //         else if (predictionNumber.length < 5) {
    //             setIsLoading(false);
    //             Alert.alert("Please enter 5 digit number !")
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         Alert.alert(error.response.data.message);
    //     }
    // }

    const submitPrediction = async () => {
        loadInterstitial();
        setIsLoading(true);
        console.log(predictionNumber);
        try {
            if (predictionNumber && predictionNumber.length == 5) {
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

                showInterstitial();
                Alert.alert('Success', `Your entry ${predictionNumber} added successfully`, [
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
                setVisible(false);
                setIsLoading(false);
                setPredictionNumber("");
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

    const handleShare = async (predictionNumber) => {
        try {
            await Share.share({
                title: `Tring Tring`,
                message:
                    `https://tring-tring.netlify.app/ \n!,I am using Tring Tring to GUESS and WIN daily !!!\nMy entry for today is ${predictionNumber}.\nJoin by my referral and gain more entries.`,
            })
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    // handleShare(55555);

    const handleInputChange = (input) => {
        // Remove non-numeric characters
        const cleanedInput = input.replace(/[^0-9]/g, '');

        // Update the state with the cleaned numeric value
        setPredictionNumber(cleanedInput);
    };

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    function numberToOrdinal(number) {
        switch (number) {
            case 1:
                return "First";
            case 2:
                return "Second";
            case 3:
                return "Third";
            case 4:
                return "Fourth";
            case 5:
                return "Fifth";
            case 6:
                return "Sixth";
            default:
                return "";
        }
    }

    return (
        <SafeAreaView>
            <View style={{ paddingTop: 64 }}>
                <Text style={styles.text2}>Enter Your Prediction</Text>
                <TextInput
                    style={[styles.textInput]}
                    maxLength={5}
                    autoFocus={true}
                    keyboardType='numeric'
                    inputmode='numeric'
                    returnKeyType="done"
                    placeholder=' - - - - - '
                    value={predictionNumber}
                    onChangeText={(text) => { const cleanedInput = text.replace(/[^0-9]/g, ''); setPredictionNumber(cleanedInput) }}
                >
                </TextInput>
                {/* <Text style={{ marginTop: -5, fontWeight: "bold", color: "lightgreen", textAlign: "center" }}>terms & conditions apply*</Text> */}
                {
                    isloading ? <ActivityIndicator></ActivityIndicator> :
                        <TouchableOpacity
                            style={styles.button}
                            onPress={submitPrediction}
                        >
                            <Text style={{ color: "white", fontFamily: "lato-reg", fontWeight: 600, fontSize: 16 }}>Submit</Text>
                        </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = EStyleSheet.create({
    text2: {
        fontSize: 20,
        fontFamily: "lato-reg", fontWeight: 600,
        color: COLORS.black,
        textAlign: "center"
    },
    button: {
        marginTop: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: "center"
    },
    textInput: {
        marginTop: 16,
        color: COLORS.primary, fontSize: 80,
        letterSpacing: 5,
        textAlign: "center"
    },
});

export default InputNumber;