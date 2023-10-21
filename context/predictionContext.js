import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_API_URL } from '../constants/baseApiUrl';
//context
const PredictionContext = createContext();

//provider
const PredictionProvider = ({ children }) => {
    //predicted for today
    const [isPredicted, setisPredicted] = useState(false);
    const [predictions, setPredictions] = useState(Number);
    const [tempPredictions, setTempPredictions] = useState(Number);
    const [addedPredictions, setAddedPredictions] = useState(Number);
    const [editedPredictions, setEditedPredictions] = useState(Number);
    const [adsViewed, setAdsViewed] = useState(Number);
    const [announced, setAnnounced] = useState(false);
    const [winner, setWinner] = useState(false);
    useEffect(() => {
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem("@auth");
            let loginData = JSON.parse(data);

            const token = loginData?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            if (token) {
                await axios.get(`${BASE_API_URL}api/user/predictions`, config).then((res) => {
                    setPredictions(res.data.predictions);
                    setTempPredictions(res.data.tempPredictions);
                    setAddedPredictions(res.data.addedPredictions);
                    setEditedPredictions(res.data.editedPredictions);
                    setAdsViewed(res.data.adsViewed);
                })
            }
        };
        loadLocalStorageData();
    }, [predictions, tempPredictions, editedPredictions, adsViewed, addedPredictions]);

    useEffect(() => {
        async function checkWinningNumber() {
            const currentDate = new Date().toISOString().split('T')[0];
            const result = await axios.get(`${BASE_API_URL}api/winning/winning_numbers`);
            const todayWinningEntry = result.data.find(entry => entry.draw_date.includes(currentDate));
            if (todayWinningEntry) {
                let data = await AsyncStorage.getItem("@auth");
                let loginData = JSON.parse(data);

                const token = loginData?.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const reset = await axios.get(`${BASE_API_URL}api/user/reset`, config);

                if (!reset.data.reset) {
                    await axios.post(`${BASE_API_URL}api/user/reset`, { reset: false }, config);
                }
                await AsyncStorage.setItem("@announced", "true");
                setAnnounced(true);
            } else {
                await AsyncStorage.setItem("@announced", "false");
                setAnnounced(false);
            }
        }

        // Check every minute (60,000 milliseconds)
        setInterval(checkWinningNumber, 60000);
    }, []);


    return (
        <PredictionContext.Provider value={{ isPredicted, setisPredicted, predictions, setPredictions, tempPredictions, addedPredictions, editedPredictions, setTempPredictions, setAddedPredictions, setEditedPredictions, adsViewed, setAdsViewed, announced, setAnnounced, winner, setWinner }}>
            {children}
        </PredictionContext.Provider>
    );
};

export { PredictionContext, PredictionProvider };
