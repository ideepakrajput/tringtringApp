import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { AntDesign } from '@expo/vector-icons';
import EStyleSheet from "react-native-extended-stylesheet";
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { useFocusEffect } from "@react-navigation/native";
import { PredictionContext } from "../context/predictionContext";
import axios from "axios";
import { BASE_API_URL } from "../constants/baseApiUrl";

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';

const ShowAds = ({ navigation }) => {
    const { state } = useContext(AuthContext);
    const { predictions, setPredictions } = useContext(PredictionContext);
    const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
    const { adsViewed, setAdsViewed } = useContext(PredictionContext);
    const { isLoaded, isEarnedReward, load, show } = useRewardedAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    useFocusEffect(
        React.useCallback(() => {
            if (!isLoaded) {
                load();
            }
        }, [load, isLoaded])
    );

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
                    setAdsViewed(res.data.adsViewed);
                })
            }
        }
        incrementPredictions();
    }, [isEarnedReward])

    const showAds = async () => {
        if (adsViewed >= 2) {
            Alert.alert("Sorry !", "You can watch only 2 videos per today ! Share with friends to get more predictions.");
            navigation.navigate("Prediction");
        } else {
            show();
            navigation.navigate("Prediction");
        }
    }
    showAds();


    return (
        <View>
        </View>
    );
};

export default ShowAds;
