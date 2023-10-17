import React, { useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';
import { PredictionContext } from '../context/predictionContext';
import axios from 'axios';
import { BASE_API_URL } from '../constants/baseApiUrl';

export default ScheduledNotificaction = () => {

    const { isPredicted } = useContext(AuthContext);
    const [people, setPeople] = useState(88989);
    const { winner, setWinner } = useContext(PredictionContext);
    const { announced, setAnnounced } = useContext(PredictionContext);
    const [matchDigits, setMatchDigits] = useState(Number);
    const [userName, setUserName] = useState();
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const checkForWinner = async () => {
            const token = state?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const today = new Date();
            const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config);
            result.data.sort((a, b) => {
                return new Date(b.transaction_date) - new Date(a.transaction_date);
            });

            const todayTransactions = result.data.filter(transaction => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate.toDateString() === today.toDateString();
            });

            todayTransactions.forEach(transaction => {
                if (transaction.winning_number === undefined) {
                    return { _id: transaction._id, matchType: 'No Winning Number' };
                }

                const predictionNumberStr = transaction.prediction_number.toString();
                const winningNumberStr = transaction.winning_number.toString();

                const allDigitsMatch = predictionNumberStr === winningNumberStr;
                const firstFourDigitsMatch = predictionNumberStr.slice(0, 4) === winningNumberStr.slice(0, 4);
                const firstThreeDigitsMatch = predictionNumberStr.slice(0, 3) === winningNumberStr.slice(0, 3);

                if (allDigitsMatch) {
                    setMatchDigits(5);
                    setWinner(true);
                    return { _id: transaction._id, matchType: 'All Digits Match' };
                } else if (firstFourDigitsMatch) {
                    setMatchDigits(4);
                    setWinner(true);
                    return { _id: transaction._id, matchType: 'First Four Digits Match' };
                } else if (firstThreeDigitsMatch) {
                    setMatchDigits(3);
                    setWinner(true);
                    return { _id: transaction._id, matchType: 'First Three Digits Match' };
                } else {
                    setMatchDigits(0);
                    return { _id: transaction._id, matchType: 'No Match' };
                }
            });
        }
        checkForWinner();
    }, []);

    useEffect(() => {
        const checkAndSendNotification = async () => {
            // Check if notification has already been sent today
            const isNotificationSentToday = await AsyncStorage.getItem('notificationSent');

            if (!isNotificationSentToday) {
                // Schedule daily notification at 10 AM
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Predict and Win",
                        body: `Aaj tring tring nhi kiya kya ???? \nPredict your number to win exiting prizes !!`,
                    },
                    trigger: {
                        hour: 10,
                        minute: 0,
                        repeats: true,
                    },
                });

                // Mark notification as sent for today
                await AsyncStorage.setItem('notificationSent', 'true');
            }
        };

        checkAndSendNotification();
    }, []);
    useEffect(() => {
        const checkAndSendNotification6PM = async () => {
            // Check if notification has already been sent today
            const isNotificationSentToday = await AsyncStorage.getItem('notificationSent6PM');

            if (!isNotificationSentToday && !isPredicted) {
                // Schedule daily notification at 10 AM
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Predict and Win",
                        body: `Did you forget to predict and match five digits for a chance to claim the bounty? ${people} people hava already made their prediction. Don't miss out!"`,
                    },
                    trigger: {
                        hour: 18,
                        minute: 0,
                        repeats: true,
                    },
                });

                // Mark notification as sent for today
                await AsyncStorage.setItem('notificationSent6PM', 'true');
            }
        };

        checkAndSendNotification6PM();
    }, []);
    useEffect(() => {
        const resultNotification = async () => {
            // Check if notification has already been sent today
            const isNotificationSentToday = await AsyncStorage.getItem('resultNotification');

            if (!isNotificationSentToday && announced) {
                // Schedule daily notification at 10 AM
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Predict and Win",
                        body: `Today's prediction results are in, and you've matched ${matchDigits} digits. Keep the winning spirit alive, predict tomorrow's, and continue your streak!`,
                    },
                    trigger: null
                });

                // Mark notification as sent for today
                await AsyncStorage.setItem('resultNotification', 'true');
            }
        };

        resultNotification();
    }, []);
    useEffect(() => {
        const userWinNotication = async () => {
            // Check if notification has already been sent today
            const isNotificationSentToday = await AsyncStorage.getItem('userWinNotication');
            setUserName(state?.user);

            if (!isNotificationSentToday && winner) {
                // Schedule daily notification at 10 AM
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Predict and Win",
                        body: `🎉 Great news, ${userName}! You've just won in today's Tring Tring prediction round. The winning number is [Winning Number]. 🥳 Claim your exciting prize now and enjoy your winnings! Tap here to redeem your reward. 🎁`,
                    },
                    trigger: null
                });

                // Mark notification as sent for today
                await AsyncStorage.setItem('userWinNotication', 'true');
            }
        };

        userWinNotication();
    }, []);
    // useEffect(() => {
    //     const userFriendJoinedNotiification = async () => {
    //         // Check if notification has already been sent today
    //         const isNotificationSentToday = await AsyncStorage.getItem('userFriendJoinedNotiification');

    //         if (!isNotificationSentToday) {
    //             // Schedule daily notification at 10 AM
    //             await Notifications.scheduleNotificationAsync({
    //                 content: {
    //                     title: "Predict and Win",
    //                     body: `Hurray! You've received a bonus of 5 prediction chances because your friend joined Tring-Tring. You can use these extra chances whenever you like.`,
    //                 },
    //                 trigger: null
    //             });

    //             // Mark notification as sent for today
    //             await AsyncStorage.setItem('userFriendJoinedNotiification', 'true');
    //         }
    //     };

    //     userFriendJoinedNotiification();
    // }, []);

    useEffect(() => {
        // Clear notification status at 12 AM
        const clearNotificationStatus = async () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);

            const timeUntilMidnight = midnight - now;

            setTimeout(async () => {
                // Clear notification status
                await AsyncStorage.removeItem('notificationSent');
                await AsyncStorage.removeItem('notificationSent6PM');
                await AsyncStorage.removeItem('resultNotification');
                await AsyncStorage.removeItem('userWinNotication');
                // await AsyncStorage.removeItem('userFriendJoinedNotiification');
            }, timeUntilMidnight);
        };

        clearNotificationStatus();
    }, []);

    return (
        <></>
    );
};

