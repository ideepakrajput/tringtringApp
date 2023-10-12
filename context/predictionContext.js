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

    async function resetLocalStorageData() {
        // Get the current date
        const currentDate = new Date();

        // Check if it's midnight (00:00:00)
        if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {

            await axios.post(`${BASE_API_URL}api/user/predictions`, { predictions: 0, tempPredictions: -tempPredictions, addedPredictions: -addedPredictions, editedPredictions: -editedPredictions }, config).then((res) => {
                setPredictions(res.data.predictions);
                setTempPredictions(res.data.tempPredictions);
                setAddedPredictions(res.data.addedPredictions);
            })

        }
    }

    // Check and reset local storage data every minute
    setInterval(resetLocalStorageData, 60000);

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
                })
            }
        };
        loadLocalStorageData();
    }, []);

    return (
        <PredictionContext.Provider value={{ isPredicted, setisPredicted, predictions, setPredictions, tempPredictions, addedPredictions, editedPredictions, setTempPredictions, setAddedPredictions, setEditedPredictions }}>
            {children}
        </PredictionContext.Provider>
    );
};

export { PredictionContext, PredictionProvider };
