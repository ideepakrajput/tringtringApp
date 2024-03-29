// InviteFriends.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Share, Clipboard, TextInput } from 'react-native';
import * as Contacts from 'expo-contacts';
import FooterMenu from '../components/Menus/FooterMenu';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { BASE_API_URL } from '../constants/baseApiUrl';
import COLORS from '../constants/colors';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
// import Clipboard from '@react-native-clipboard/clipboard';

const InviteFriends = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [myreferralcode, setMyReferralCode] = useState('');
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

    const copyToClipboard = () => {
        Clipboard.setString(myreferralcode);
        // try {
        //     Clipboard.setString(myreferralcode);
        //     Alert.alert('Copied to clipboard!', 'You can now paste the text wherever you want.');
        // } catch (error) {
        //     console.error('Error copying to clipboard:', error);
        // }
    };

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
                <View style={{ backgroundColor: "black", paddingHorizontal: 24, paddingVertical: 16, marginBottom: 24, borderRadius: 8 }}>
                    <Text style={styles.text1}>Refer and Gain entries</Text>
                    <View style={{ flexDirection: "row", gap: 8, justifyContent: "space-around" }}>
                        <View style={{ flexDirection: "row", borderRadius: 8, borderColor: COLORS.primary, borderWidth: 1, alignSelf: "center", marginVertical: 8 }}>
                            <TextInput style={[styles.text2, { color: "white", paddingLeft: 8 }]} editable={false} value={myreferralcode}></TextInput>
                            <TouchableOpacity
                                style={[styles.shareButton, { alignItems: "flex-end", marginLeft: 8 }]}
                                onPress={copyToClipboard}
                            >
                                <Text style={styles.shareButtonText}>Copy <Ionicons name="copy-outline" size={14} color="white" /></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginVertical: 8 }}>
                            <TouchableOpacity
                                style={[styles.shareButton]}
                                onPress={() => handleShare(myreferralcode)}
                            >
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={{ fontSize: 16, fontFamily: "lato-reg", fontWeight: 900 }}>Contacts</Text>
                <View style={styles.searchInputBox}>
                    <EvilIcons name="search" size={24} color="black" />
                    <TextInput
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
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
        fontSize: 16,
        fontFamily: "lato-reg",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    text2: {
        fontFamily: "lato-reg",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    searchInputBox: {
        padding: 8,
        flexDirection: "row",
        gap: 8,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 16,
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    contactImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginRight: 10,
        alignSelf: "center"
    },
    contactName: {
        fontSize: 12,
    },
    contactNumber: {
        fontSize: 12
    },
    shareButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        borderRadius: 8,
        paddingVertical: 8
    },
    shareButtonText: {
        fontFamily: "lato-reg",
        fontSize: 16,
        color: '#fff',
        textAlign: "center"
    },
});

export default InviteFriends;