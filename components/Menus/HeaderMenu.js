import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { AntDesign } from '@expo/vector-icons';
import EStyleSheet from "react-native-extended-stylesheet";
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { useFocusEffect } from "@react-navigation/native";
import { PredictionContext } from "../../context/predictionContext";
import axios from "axios";
import { BASE_API_URL } from "../../constants/baseApiUrl";
import COLORS from "../../constants/colors";

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';

const HeaderMenu = () => {
  const { state } = useContext(AuthContext);
  const { predictions, setPredictions } = useContext(PredictionContext);
  const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
  const { addedPredictions, setAddedPredictions } = useContext(PredictionContext);
  const { editedPredictions, setEditedPredictions } = useContext(PredictionContext);
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
      show();
    }
  }


  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 4, borderRadius: 50, borderColor: "#D1D5DB", borderWidth: 1 }}>
      <Text style={styles.text2}>{predictions + tempPredictions} Entries</Text>
      <TouchableOpacity onPress={() => { showAds(); }}>
        <AntDesign name="pluscircle" size={30} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};
const styles = EStyleSheet.create({
  text2: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 12,
    paddingRight: 8,
    color: COLORS.black,
    textAlign: "center"
  },
});

export default HeaderMenu;
