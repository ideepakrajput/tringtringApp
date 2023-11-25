import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import COLORS from "../constants/colors";
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import { formatDateToDDMMYYYY, formatTimestampToTimeDate } from '../constants/dataTime';
import { openYouTubeLink } from '../constants/openYouTubeLink';
let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const UserHistory = () => {
    const [data, setData] = useState({});
    const [isData, setIsData] = useState(false);
    const [loading, setLoading] = useState(false);

    const { state } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const token = state?.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    setLoading(true);

                    const result = await axios.get(`${BASE_API_URL}api/winning/user/user_history`, config);
                    result.data.sort((a, b) => {
                        return new Date(b.created_date_time) - new Date(a.created_date_time);
                    });
                    const groupedData = {}
                    result.data.forEach(item => {
                        const date = item.transaction_date.split('T')[0];
                        if (!groupedData[date]) {
                            groupedData[date] = [];
                        }
                        groupedData[date].push(item);
                    });
                    setData(groupedData);
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

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text1}>History</Text>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Created On</Text>
                    <Text style={[styles.headerCell, { textAlign: "center", marginLeft: 20 }]}>Prediction No</Text>
                    <Text style={[styles.headerCell, { textAlign: "right" }]}>Winning No Info</Text>
                </View>
                {loading ?
                    <ActivityIndicator size="large"></ActivityIndicator>
                    :
                    <ScrollView style={{ marginBottom: 40 }}>
                        {isData ?
                            <>
                                {Object.entries(data).map(([date, items]) => (
                                    <View style={{ flexDirection: "column", borderRadius: 8, backgroundColor: COLORS.history, marginTop: 16, minHeight: 90 }} key={date}>
                                        {items.map((item, index) => (
                                            <View style={{ flexDirection: "row", padding: 8, height: 30 }} key={item._id}>
                                                <Text style={[styles.cell, { fontSize: 12, marginRight: 40 }]}>{formatTimestampToTimeDate(item.created_date_time)}</Text>
                                                <Text style={[styles.cell, { fontSize: 12, textAlign: "center" }]}>{item.prediction_number}</Text>
                                                <View style={{ marginLeft: 'auto' }}>
                                                    {index === 0 ?
                                                        <View style={{ gap: 8 }}>
                                                            <Text style={styles.cell}>{formatDateToDDMMYYYY(item.transaction_date)}</Text>
                                                            <Text style={[styles.cell, { fontSize: 16, textAlign: "center" }]}>{item.winning_number || " 55555 "}</Text>
                                                            <TouchableOpacity onPress={() => openYouTubeLink(item.youtube_url)} style={styles.cell}>
                                                                <Image
                                                                    source={require("../assets/utubelogo.png")}
                                                                    style={{
                                                                        height: 30,
                                                                        width: 30,
                                                                        alignSelf: "center"
                                                                    }}
                                                                >
                                                                </Image>
                                                            </TouchableOpacity>
                                                        </View>
                                                        :
                                                        <>
                                                        </>
                                                    }
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </>
                            :
                            <Text style={styles.text1}>You have not made any prediction yet.</Text>
                        }
                    </ScrollView>
                }
            </View >
            <View style={{ flex: 0.1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    text1: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.black,
        marginTop: 32,
        marginBottom: 24,
        textAlign: "center"
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerCell: {
        textTransform: "uppercase",
        flex: 1,
        fontSize: 14,
        fontFamily: "lato-reg",
        color: COLORS.secondary
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    cell: {
        fontFamily: "lato-reg",
        color: "#4B5563",
    },
});

export default UserHistory;