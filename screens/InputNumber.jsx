import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import COLORS from "../constants/colors";
import axios from "axios";
import { BASE_API_URL } from "../constants/baseApiUrl";

function InputNumber({ navigation }) {

    const [predictionNumber, setPredictionNumber] = useState("");
    const [isloading, setIsLoading] = useState(false);

    const submitPrediction = async () => {

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
        fontSize: "1rem",
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
        color: COLORS.primary, fontSize: "2rem",
        letterSpacing: 5,
        textAlign: "center"
    },
});

export default InputNumber;