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
    const [editCount, setEditCount] = useState(Number);
    const [tempPredictions, setTempPredictions] = useState(Number);
    const [addedPredictions, setAddedPredictions] = useState(Number);
    const [editedPredictions, setEditedPredictions] = useState(Number);

    async function resetLocalStorageData() {
        // Get the current date
        const currentDate = new Date();

        // Check if it's midnight (00:00:00)
        if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
            // Reset your local storage data here
            await AsyncStorage.setItem('tempPredictions', "0");
            await AsyncStorage.setItem('addedPredictions', "0");
            await AsyncStorage.setItem('editedPredictions', "0");
        }
    }

    // Check and reset local storage data every minute
    setInterval(resetLocalStorageData, 60000);

    // initial local storage data
    useEffect(() => {
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem("@auth");
            let loginData = JSON.parse(data);
            let tempPredictionsData = await AsyncStorage.getItem('tempPredictions');
            let addedPredictionsData = await AsyncStorage.getItem('addedPredictions');
            let editedPredictionsData = await AsyncStorage.getItem('editedPredictions');
            tempPredictionsData = parseInt(tempPredictionsData);
            addedPredictionsData = parseInt(addedPredictionsData);
            editedPredictionsData = parseInt(editedPredictionsData);
            setTempPredictions(tempPredictionsData);
            setAddedPredictions(addedPredictionsData);
            setEditedPredictions(editedPredictionsData);

            const token = loginData?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            if (token) {
                await axios.get(`${BASE_API_URL}api/user/edit_count`, config).then((res) => {
                    console.log(tempPredictionsData);
                    console.log(addedPredictions);
                    console.log(editedPredictions);
                    setEditCount(res.data.editCount);
                })
            }
        };
        loadLocalStorageData();
    }, []);

    return (
        <PredictionContext.Provider value={{ isPredicted, setisPredicted, editCount, setEditCount, tempPredictions, addedPredictions, editedPredictions, setTempPredictions, setAddedPredictions, setEditedPredictions }}>
            {children}
        </PredictionContext.Provider>
    );
};

export { PredictionContext, PredictionProvider };
