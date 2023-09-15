import { View, Text, Dimensions, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import COLORS from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { ordinalDateFormat } from '../constants/dataTime';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const UserHistory = ({ navigation }) => {
    const [data, setData] = useState();
    const [isData, setIsData] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const token = await AsyncStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    setLoading(true);

                    const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config);
                    result.data.sort((a, b) => {
                        return new Date(b.transaction_date) - new Date(a.transaction_date);
                    });
                    setData(result.data);
                    if (result.data.length > 0) {
                        setIsData(true);
                    }
                    setLoading(false);
                }
                catch (error) {
                    setLoading(false);
                    console.error(error.message);
                }
            }
            fetchData();
        }, [])
    )

    const renderItem = ({ item }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.cell}>{item.transaction_date.substring(0, 10)}</Text>
                <Text style={styles.cell}>{item.prediction_number}</Text>
                <Text style={styles.cell}>{item.winning_number || 'N/A'}</Text>
            </View>
        );
    };


    return (
        <ScrollView horizontal style={styles.container}>
            <View style={{ margin: 30, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.text1}>Your Prediction History</Text>
                {
                    loading ?
                        <>
                            <ActivityIndicator size="large"></ActivityIndicator>
                        </>
                        :
                        <>
                            {
                                isData
                                    ?
                                    <View style={styles.table}>
                                        <View style={styles.row}>
                                            <Text style={styles.headerCell}>Date</Text>
                                            <Text style={styles.headerCell}>Prediction Number</Text>
                                            <Text style={styles.headerCell}>Winning Number</Text>
                                        </View>

                                        <FlatList
                                            data={data}
                                            renderItem={renderItem}
                                            keyExtractor={(item) => item._id}
                                        />
                                    </View>
                                    :
                                    <>
                                        <Text style={styles.text1}>You have not made any prediction yet.</Text>
                                    </>

                            }
                        </>
                }
            </View>
        </ScrollView>
    );
};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'black',
        padding: 8,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    text1: {
        fontSize: "30rem",
        fontWeight: "bold",
        color: COLORS.black,
        padding: "10rem",
        textAlign: "center"
    },
});

export default UserHistory;