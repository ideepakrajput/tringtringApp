// InviteFriends.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Share, TextInput } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import FooterMenu from '../components/Menus/FooterMenu';

const image = require('../assets/icon.png');

const InviteFriends = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getContacts();
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

    const handleShare = async (name) => {
        //     const asset = Asset.fromModule(image);
        //     await asset.downloadAsync();
        //     const tmpFile = FileSystem.cacheDirectory + 'icon.png';

        //     try {
        //         const isAvailable = await Sharing.isAvailableAsync();
        //         if (isAvailable) {
        //             FileSystem.copyAsync({ from: asset.localUri, to: tmpFile });
        //             Sharing.shareAsync(tmpFile, {
        //                 dialogTitle: 'Hey there ! ',
        //             });
        //         } else {
        //             alert('Sharing is not available on your device');
        //         }

        //     } catch (e) {
        //         console.error(e);
        //     }
        // };
        try {
            const result = await Share.share({
                title: "Tring Tring",
                url: "https://www.tring-tring.netlify.app",
                message:
                    'Hey ${name}! , I am using Tring Tring to PREDICT and WIN daily !!!\nJoin by my referral get bonus money and more predictions.',
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


    const renderItem = ({ item }) => (
        <View style={styles.contactItem}>
            {item.image ? (
                <Image source={{ uri: item.image.uri }} style={styles.contactImage} />
            ) : (
                <Image source={require("../assets/user-avatar.png")} style={styles.contactImage} />
            )}
            <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactNumber}>{item.phoneNumbers != null ? item.phoneNumbers[0].number : ""}</Text>
            </View>
            <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleShare(item.name)}
            >
                <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contactList}
                />
            </View>
            <View style={{ flex: 0.1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
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
        flex: 1,
    },
    contactNumber: {
        flex: 1,
        fontSize: 16
    },
    shareButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 50,
        marginLeft: 10,
    },
    shareButtonText: {
        color: '#fff',
    },
});

export default InviteFriends;
