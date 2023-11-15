import { View, Text, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
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

const UserHistory = ({ navigation }) => {
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
                    <Text style={[styles.headerCell, { textAlign: "center" }]}>Prediction Number</Text>
                    <Text style={[styles.headerCell, { textAlign: "center" }]}>Winning Number Info</Text>
                </View>
                {loading ?
                    <ActivityIndicator size="large"></ActivityIndicator>
                    :
                    <ScrollView style={{ marginBottom: 10 }}>
                        {isData ?
                            <>
                                {Object.entries(data).map(([date, items]) => (
                                    <View style={{ flexDirection: "column", backgroundColor: 'skyblue', marginTop: 10, minHeight: 120 }} key={date}>
                                        {items.map((item, index) => (
                                            <View style={{ flexDirection: "row", marginTop: 10, paddingRight: 10, paddingVertical: 5, height: 30 }} key={item._id}>
                                                <Text style={[styles.cell, { fontSize: 15 }]}>{formatTimestampToTimeDate(item.created_date_time)}</Text>
                                                <Text style={[styles.cell, { marginLeft: 50 }]}>{item.prediction_number}</Text>
                                                <View style={{ marginLeft: 'auto' }}>
                                                    {index === 0 ?
                                                        <View>
                                                            <Text style={styles.cell}>{formatDateToDDMMYYYY(item.transaction_date)}</Text>
                                                            <Text style={[styles.cell, { fontSize: 28 }]}>{item.winning_number || " - "}</Text>
                                                            <TouchableOpacity onPress={() => openYouTubeLink(item.youtube_url)} style={styles.cell}>
                                                                <Image
                                                                    source={require("../assets/utubelogo.png")}
                                                                    style={{
                                                                        height: 40,
                                                                        width: 40,
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

const styles = EStyleSheet.create({
    text1: {
        fontSize: "30rem",
        fontWeight: "bold",
        color: COLORS.black,
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
    },
    container: {
        flex: 1,
        padding: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#303030',
        padding: 5,

    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: 'white'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    cell: {
        textAlign: 'center',
        marginLeft: 10
    },
});

export default UserHistory;