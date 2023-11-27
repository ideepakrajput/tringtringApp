import { View, Text, TextInput, TouchableOpacity, Image, Modal, Animated, Dimensions, Alert, Share, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import COLORS from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { ordinalDate, ordinalDateFormat } from '../constants/dataTime';
import FooterMenu from '../components/Menus/FooterMenu';
import { openYouTubeLink } from '../constants/openYouTubeLink';
import { useRewardedAd, useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { PredictionContext } from '../context/predictionContext';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync();
let entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth > 340 ? 18 : 16 });

const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6067634275916377/4705877289';
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';

const ModalPoup = ({ visible, children }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        toggleModal();
    }, [visible]);
    const toggleModal = () => {
        if (visible) {
            setShowModal(true);
            Animated.spring(scaleValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setTimeout(() => setShowModal(false), 200);
            Animated.timing(scaleValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };
    return (
        <Modal transparent visible={showModal}>
            <View style={styles.modalBackGround}>
                <Animated.View
                    style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const Prediction = ({ navigation }) => {
    const [predictionNumber, setPredictionNumber] = useState("");
    const [predictionData, setPredictionData] = useState([]);
    const [yesterdayPredictionsData, setYesterdayPredictionsData] = useState([]);
    const [yesterdayWinningNumber, setYesterdayWinningNumber] = useState();
    const [yesterdayWinningURL, setYesterdayWinningURL] = useState("");
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState("");
    const [isloading, setIsLoading] = useState(false);
    const [editPN, setPN] = useState(null);

    const { announced, setAnnounced } = useContext(PredictionContext);
    const { predictions, setPredictions } = useContext(PredictionContext);
    const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
    const { addedPredictions, setAddedPredictions } = useContext(PredictionContext);
    const { editedPredictions, setEditedPredictions } = useContext(PredictionContext);
    const { adsViewed, setAdsViewed } = useContext(PredictionContext);

    const [tooltipVisible, setTooltipVisible] = useState(false);

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

    useEffect(() => {
        async function loadData() {
            await axios.get(`${BASE_API_URL}api/user/predictions`, config).then((res) => {
                setPredictions(res.data.predictions);
                setTempPredictions(res.data.tempPredictions);
                setAddedPredictions(res.data.addedPredictions);
                setEditedPredictions(res.data.editedPredictions);
                setAdsViewed(res.data.adsViewed);
            })
        }
        loadData();
    }, [])

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

    const showDialog = (p, i) => {
        console.log("Id is ----->", i)
        setPN(p)
        setId(i)
        setPredictionNumber("");
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setPN(null)
    };

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                await axios.get(`${BASE_API_URL}api/winning/winning_numbers`)
                    .then(res => {
                        let yesterdayDateStr = "";
                        if (announced) {
                            const currentDate = new Date();
                            const yesterdayDate = new Date(currentDate);
                            yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
                        } else {
                            const currentDate = new Date();
                            const yesterdayDate = new Date(currentDate);
                            yesterdayDate.setDate(currentDate.getDate() - 1);
                            yesterdayDateStr = yesterdayDate.toISOString().slice(0, 10);
                        }

                        for (const item of res.data) {
                            if (item.created_date_time.startsWith(yesterdayDateStr)) {
                                setYesterdayWinningNumber(item.winning_number);
                                setYesterdayWinningURL(item.youtube_url);
                                break;
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
        const fetchData = async () => {
            try {
                const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config)
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

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [predictionData]);

    async function handleEditPrediction() {
        loadInterstitial();
        setIsLoading(true);
        try {
            if (predictionNumber && predictionNumber.length == 5) {
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

                showInterstitial();
                Alert.alert('Success', `Your entry successfully changed from ${editPN} to ${predictionNumber}`, [
                    {
                        text: 'Share',
                        onPress: () => navigation.navigate("ReferAndEarn"),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation.navigate("Prediction") },
                ]);
                setIsLoading(false);
                setPredictionNumber("");
                setVisible(false);
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

    const submitPrediction = async () => {
        loadInterstitial();
        setIsLoading(true);
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
                    `https://tring-tring.netlify.app/ \n!,I am using Tring Tring to GUESS and WIN daily !!!\nMy entry for today is ${predictionNumber}.\nJoin by my referral get bonus money and gain more entries.`,
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 28, paddingHorizontal: 20 }}>
                <View style={{ paddingHorizontal: 28, paddingVertical: 24, backgroundColor: COLORS.black, borderRadius: 16, flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={{ gap: 8 }}>
                        <Text style={{ fontSize: 12, color: "white", fontFamily: "lato-reg", fontWeight: "800", width: 140 }}>
                            Enter a 5 digit number and stand a chance to win <Text style={{ color: "#B09300" }}>1 LAKH</Text> rupees daily {" "}
                            <AntDesign onPress={() => setTooltipVisible(true)} name="infocirlceo" size={12} color="#B09300" />
                        </Text>
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={tooltipVisible}
                            onRequestClose={() => setTooltipVisible(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
                                <View style={styles.tooltip}>
                                    <View style={styles.modalContent}>
                                        <Text style={{ color: "white", fontSize: 8, fontFamily: "lato-reg", }}>Enter a 5 digit number</Text>
                                        <Text style={{ color: "white", fontSize: 8, fontFamily: "lato-reg", }}>Draw @9pm everyday</Text>
                                        <Text style={{ color: "white", fontSize: 8, fontFamily: "lato-reg", }}>Prediction for next day starts after 9pm each day</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>

                        <TouchableOpacity onPress={() => navigation.navigate("PrizesData")}>
                            <Text style={{ color: COLORS.primary, fontSize: 12, fontFamily: "lato-reg", fontWeight: "700", textDecorationLine: "underline" }}>View all Prizes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ backgroundColor: "white", width: 60, height: 60, borderRadius: 50, position: "relative", marginTop: 8 }}></View>
                        <Image style={{ height: 40, width: 100, resizeMode: "contain", position: "absolute", top: 18, right: 1 }} source={require("../assets/coins.png")}></Image>
                    </View>
                </View>
                <View>
                    {
                        (predictions + tempPredictions) <= 0 ?
                            <>
                                <Text style={[styles.text1, { fontFamily: "lato-reg", fontWeight: 800, }]}>Your Entries are completed</Text>
                                <Text style={{ color: "black", fontFamily: "lato-reg", fontWeight: 600, textAlign: "center", fontSize: 14, paddingHorizontal: 24 }}>*Watch an Ad or Refer the app to your friends to gain entries</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
                                    {adsViewed >= 2 ?
                                        <TouchableOpacity
                                            disabled={true}
                                            style={styles.buttonDisable}
                                            onPress={() => showAds()}
                                        >
                                            <Text style={{ color: "black", fontFamily: "lato-reg", fontWeight: 600, textAlign: "center", fontSize: 16 }}>Watch Ads</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => showAds()}
                                        >
                                            <Text style={{ color: "white", fontFamily: "lato-reg", fontWeight: 600, textAlign: "center", fontSize: 16 }}>Watch Ads</Text>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate("ReferAndEarn")}
                                    >
                                        <Text style={{ color: "white", fontFamily: "lato-reg", fontWeight: 600, textAlign: "center", fontSize: 16 }}>Refer a Friend</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <>
                                {addedPredictions >= 3 ?
                                    <>
                                        <Text style={[styles.text1, { fontFamily: "lato-reg", fontWeight: 800, }]}>You have reached the limit to make entries for today</Text>
                                        <Text style={{ color: "black", fontFamily: "lato-reg", fontWeight: 600, textAlign: "center", fontSize: 14, paddingHorizontal: 24 }}>(maximum 3 entries per day)</Text>
                                    </>
                                    :
                                    <>
                                        {/* <Text style={styles.text2}>Your {numberToOrdinal(addedPredictions + 1)} Prediction</Text> */}
                                        <Text style={styles.text2}>Enter Your Prediction</Text>
                                        <Text style={{ textAlign: "center", fontSize: 48, fontWeight: "bold", marginTop: 8 }} onPress={() => navigation.navigate("InputNumber")}> - - - - -</Text>
                                        {/* <Text style={{ marginTop: -5, fontWeight: "bold", color: "lightgreen", textAlign: "center" }}>terms & conditions apply*</Text> */}
                                        {
                                            isloading ? <ActivityIndicator></ActivityIndicator> :
                                                <TouchableOpacity
                                                    style={[styles.button, { marginTop: 0 }]}
                                                    onPress={submitPrediction}
                                                >
                                                    <Text style={{ color: "white", fontFamily: "lato-reg", fontWeight: 800, fontSize: 16 }}>Submit</Text>
                                                </TouchableOpacity>
                                        }
                                    </>
                                }
                            </>
                    }
                </View>
                <View>
                    {addedPredictions === 0 ?
                        <Text style={[styles.text1, { fontFamily: "lato-reg", fontWeight: 600 }]}>You haven{"'"}t made any predictions yet</Text>
                        :
                        <Text style={[styles.text1, { fontFamily: "lato-reg", fontWeight: 600 }]}>Your Current Predictions</Text>
                    }
                    {
                        announced ?
                            <Text style={{ fontFamily: "lato-reg", fontWeight: 600, fontSize: 12, color: COLORS.secondary, textAlign: "center" }}>
                                {"("}Draw @ {ordinalDate(tomorrowDate)} 9 PM{")"}
                            </Text>
                            :
                            <Text style={{ fontFamily: "lato-reg", fontWeight: 600, fontSize: 12, color: COLORS.secondary, textAlign: "center" }}>
                                {"("}Draw @ {ordinalDate(new Date())} 9 PM{")"}
                            </Text>
                    }
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "center" }}>
                        {predictionData.map((item, index) => (
                            <View key={item._id} style={{ flexDirection: 'row', alignContent: 'center', justifyContent: "center", alignItems: "center" }}>
                                {
                                    editedPredictions >= 3 ?
                                        <>
                                            <Text style={styles.text2}>{item.prediction_number}</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 15,
                                                    marginVertical: 5,
                                                    paddingHorizontal: 8,
                                                }}
                                                onPress={() => Alert.alert("No edit left.")}
                                            >
                                                <MaterialIcons name="edit-off" size={16} color={COLORS.secondary} />
                                            </TouchableOpacity></>
                                        :
                                        <>
                                            <Text style={{ fontFamily: "lato-reg", fontWeight: 400, fontSize: 16, color: COLORS.secondary, textAlign: "center" }}>{item.prediction_number}</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 15,
                                                    marginVertical: 5,
                                                    paddingHorizontal: 8,
                                                }}
                                                onPress={() => showDialog(item.prediction_number, item._id)}
                                            >
                                                <MaterialIcons name="mode-edit" size={16} color={COLORS.primary} />
                                            </TouchableOpacity>
                                            <View style={styles.containerD}>
                                                <ModalPoup visible={visible}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <View style={styles.header}>
                                                            <TouchableOpacity onPress={() => setVisible(false)}>
                                                                <Image
                                                                    source={require('../assets/x.png')}
                                                                    style={{ height: 30, width: 30 }}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.text2}>Your existing number : {editPN}</Text>
                                                    <Text style={[styles.text2, { fontWeight: "bold" }]}>Enter New Number </Text>
                                                    <TextInput
                                                        style={[styles.textInput, { alignSelf: "center" }]}
                                                        maxLength={5}
                                                        autoFocus={true}
                                                        keyboardType='numeric'
                                                        inputmode='numeric'
                                                        placeholder='-----'
                                                        value={predictionNumber}
                                                        onChangeText={handleInputChange}
                                                    >
                                                    </TextInput>
                                                    <Text style={{ marginTop: -5, fontWeight: "bold", color: "lightgreen", textAlign: "center" }}>terms & conditions apply*</Text>

                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={handleEditPrediction}
                                                    >
                                                        <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Submit</Text>
                                                    </TouchableOpacity>
                                                </ModalPoup>
                                            </View>
                                        </>
                                }
                            </View>
                        ))}
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.black, borderRadius: 8, gap: 16 }}>
                    {/* {
                        announced ?
                            <Text style={[styles.text1, styles.green]}>
                                {ordinalDate(new Date())} Draw Result
                            </Text>
                            :
                            <Text style={[styles.text1, styles.green]}>
                                {ordinalDate(yesterdayDate)} Draw Result
                            </Text>
                    } */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontFamily: "lato-reg", fontWeight: 900, fontSize: 14, color: COLORS.black }}>🏆 Previous Winning Number</Text>
                        <TouchableOpacity onPress={() => openYouTubeLink(yesterdayWinningURL)}>
                            <Image
                                source={require("../assets/utubelogo.png")}
                                style={{
                                    height: 24,
                                    width: 24,
                                }}
                            >
                            </Image>
                        </TouchableOpacity>
                        <Text style={styles.winning_number}>{yesterdayWinningNumber || " - "}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontFamily: "lato-reg", fontWeight: 900, fontSize: 12, color: COLORS.black }}>Your Previous Prediction</Text>
                        {yesterdayPredictionsData.length === 0 ?
                            <Text style={styles.winning_number}>{" - "}</Text>
                            :
                            <>
                                <View style={{ flexDirection: "row" }}>
                                    {
                                        yesterdayPredictionsData.map((item, index) => (
                                            <View key={item._id}>
                                                <Text style={{ textAlign: "center", fontFamily: "lato-reg", color: COLORS.secondary, fontWeight: 400, fontSize: 12, }}>{item.prediction_number}
                                                    {index != yesterdayPredictionsData.length - 1 ? <Text style={{ textAlign: "center", color: COLORS.secondary, fontWeight: "bold" }}>{","}</Text> : <></>}
                                                </Text>
                                            </View>
                                        ))
                                    }
                                </View>
                            </>
                        }
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </SafeAreaView >
    )
}


const styles = EStyleSheet.create({
    text1: {
        fontSize: "1rem",
        fontFamily: "lato-reg", fontWeight: 800,
        color: COLORS.black,
        textAlign: "center",
    },
    text2: {
        fontSize: "1rem",
        fontFamily: "lato-reg", fontWeight: 600,
        color: COLORS.black,
        textAlign: "center"
    },
    winning_number: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "italic",
        color: COLORS.black,
        textAlign: "center",
    },
    text3: {
        fontSize: "1rem",
        fontWeight: "bold",
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
    buttonDisable: {
        backgroundColor: "lightgrey",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: "center"
    },
    containerD: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        color: "green", fontSize: "1rem",
        textAlign: "center",
    },
    modalBackGround: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 20,
    },
    header: {
        width: '100%',
        marginTop: -5,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    tooltip: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.black,
        position: "absolute",
        top: 150,
        left: 139,
        padding: 16,
        borderRadius: 8,
        elevation: 5,
    },
});

export default Prediction;