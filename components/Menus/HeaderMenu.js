import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { AntDesign } from '@expo/vector-icons';
import EStyleSheet from "react-native-extended-stylesheet";
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { useFocusEffect } from "@react-navigation/native";
import { PredictionContext } from "../../context/predictionContext";
import axios from "axios";
import { BASE_API_URL } from "../../constants/baseApiUrl";

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6067634275916377/1879585158';

const HeaderMenu = () => {
  const { state } = useContext(AuthContext);
  const { predictions, setPredictions } = useContext(PredictionContext);
  const { tempPredictions, setTempPredictions } = useContext(PredictionContext);
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
        await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: 1, addedPredictions: 0, editedPredictions: 0 }, config).then((res) => {
          setPredictions(res.data.predictions);
          setTempPredictions(res.data.tempPredictions);
        })
      }
    }
    incrementPredictions();
  }, [isEarnedReward])

  const showAds = async () => {
    show();
  }


  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, columnGap: 10, borderRadius: 50, backgroundColor: "#00BF63" }}>
      <View>
        <Text style={styles.text2}>{predictions + tempPredictions}</Text>
        <Text style={styles.text2}>Predictions</Text>
      </View>
      <TouchableOpacity onPress={() => { showAds(); }}>
        <AntDesign name="pluscircleo" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};
const styles = EStyleSheet.create({
  text2: {
    fontSize: "15rem",
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
});

export default HeaderMenu;
