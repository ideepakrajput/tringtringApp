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
    async function resetLocalStorageData() {
        // Get the current date
        // const currentDate = new Date();

        // // Check if it's midnight (00:00:00)
        // if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
        //     await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: -(tempPredictions - 1), addedPredictions: -addedPredictions, editedPredictions: -editedPredictions, adsViewed: -adsViewed }, config).then((res) => {
        //         setPredictions(res.data.predictions);
        //         setTempPredictions(res.data.tempPredictions);
        //         setAddedPredictions(res.data.addedPredictions);
        //         setEditedPredictions(res.data.editedPredictions);
        //         setAdsViewed(res.data.adsViewed);
        //     })
        //     await AsyncStorage.setItem("@announced", "false");
        //     setAnnounced(false);
        // }
        // const announced = await AsyncStorage.getItem("@announced");
        const reset = await AsyncStorage.getItem("@reset");
        const announcedD = await AsyncStorage.getItem("@announced");
        if (announcedD && reset) {
            let data = await AsyncStorage.getItem("@auth");
            let loginData = JSON.parse(data);

            const token = loginData?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: -(tempPredictions - 1), addedPredictions: -addedPredictions, editedPredictions: -editedPredictions, adsViewed: -adsViewed }, config).then((res) => {
                setPredictions(res.data.predictions);
                setTempPredictions(res.data.tempPredictions);
                setAddedPredictions(res.data.addedPredictions);
                setEditedPredictions(res.data.editedPredictions);
                setAdsViewed(res.data.adsViewed);
            })
            await AsyncStorage.setItem("@announced", "false");
            await AsyncStorage.setItem("@reset", "false");
        }
    }

    // Check and reset local storage data every minute
    setInterval(resetLocalStorageData, 6000);

    // initial local storage data
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
                    console.log(res.data.adsViewed);
                })
            }
        };
        loadLocalStorageData();
        async function checkWinningNumber() {
            let currentDate = "";
            const announcedD = await AsyncStorage.getItem("@announced");
            if (announcedD) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                currentDate = tomorrow.toISOString().split('T')[0];
            } else {
                currentDate = new Date().toISOString().split('T')[0];
            }
            const result = await axios.get(`${BASE_API_URL}api/winning/winning_numbers`);
            const todayWinningEntry = result.data.find(entry => entry.draw_date.includes(currentDate));
            if (todayWinningEntry) {
                await AsyncStorage.setItem("@announced", "true");
                await AsyncStorage.setItem("@reset", "true");
                setAnnounced(true);
            } else {
                await AsyncStorage.setItem("@announced", "false");
                await AsyncStorage.setItem("@reset", "false");
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
