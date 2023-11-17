// InviteFriends.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Share, TextInput } from 'react-native';
import * as Contacts from 'expo-contacts';
import FooterMenu from '../components/Menus/FooterMenu';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { BASE_API_URL } from '../constants/baseApiUrl';

const image = require('../assets/icon.png');

const InviteFriends = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [myreferralcode, setMyReferralCode] = useState("");
    const { state } = useContext(AuthContext);

    const token = state?.token;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    async function getReferralCode() {
        await axios.get(`${BASE_API_URL}api/user/user_details`, config).then((foundUser) => {
            setMyReferralCode(foundUser.data.myReferralCode);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        getContacts();
        getReferralCode();
    }, []);

    const getContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
            });

            if (data.length > 0) {
                setContacts(data);
            }
        }
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleShare = async (myreferralcode) => {
        try {
            const result = await Share.share({
                title: `Tring Tring`,
                message:
                    `https://tring-tring.netlify.app/ \nI am using Tring Tring to GUESS and WIN daily !!!\nJoin by my referral get bonus money and more entries.\nMy referral code is ${myreferralcode}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log('====================================');
                    console.log("Activity Type", result.activityType);
                    console.log('====================================');
                } else {
                    // shared
                    console.log('====================================');
                    console.log("Shared");
                    console.log('====================================');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log('====================================');
                console.log("Dismiseds");
                console.log('====================================');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };


    const MemoizedContactItem = React.memo(({ item, handleShare }) => (
        <View style={styles.contactItem}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View>
                    {item.image ? (
                        <Image source={{ uri: item.image.uri }} style={styles.contactImage} />
                    ) : (
                        <Image source={require("../assets/user-avatar.png")} style={styles.contactImage} />
                    )}
                </View>
                <View>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactNumber}>{item.phoneNumbers != null ? item.phoneNumbers[0].number : ""}</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShare(myreferralcode)}
                >
                    <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    ));

    const renderItem = ({ item }) => (
        <MemoizedContactItem item={item} handleShare={handleShare} />
    );

    return (
        <>
            <View style={styles.container}>
                <View style={{ backgroundColor: "skyblue", padding: 10, marginBottom: 10 }}>
                    <Text style={styles.text1}>Refer and Gain entries</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 50, borderColor: "#4caf50", borderWidth: 1, alignSelf: "center", marginVertical: 8 }}>
                        <TextInput style={[styles.text2, { color: "black", marginLeft: 16 }]} editable={false} value={myreferralcode}></TextInput>
                        <TouchableOpacity
                            style={[styles.shareButton, { alignItems: "flex-end", marginLeft: 16 }]}
                            onPress={() => handleShare(myreferralcode)}
                        >
                            <Text style={styles.shareButtonText}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                            style={[styles.shareButton, { width: 100 }]}
                            onPress={() => handleShare(myreferralcode)}
                        >
                            <Text style={styles.shareButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contactList}
                />
            </View >
            <View style={{ flex: 0.1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    text1: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    text2: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    container: {
        flex: 1,
    },
    searchInput: {
        height: 40,
        borderColor: 'green',
        borderRadius: 25,
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 16,
        marginHorizontal: 24,
    },
    contactList: {
        paddingHorizontal: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    contactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    contactName: {
        fontSize: 16,
    },
    contactNumber: {
        fontSize: 16
    },
    shareButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 50,
    },
    shareButtonText: {
        color: '#fff',
        textAlign: "center"
    },
});

export default InviteFriends;