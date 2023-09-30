import React, { useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';
import * as Notifications from 'expo-notifications';

const NotificationSwitch = () => {
    const { isEnabled, setIsEnabled } = useContext(AuthContext);

    useEffect(() => {
        // Load the user's preference from AsyncStorage
        loadNotificationPreference();
    }, []);

    const loadNotificationPreference = async () => {
        try {
            const preference = await AsyncStorage.getItem('notificationPreference');
            if (preference !== null) {
                setIsEnabled(preference === 'true');
            }
        } catch (error) {
            console.error('Error loading notification preference:', error);
        }
    };

    const saveNotificationPreference = async (value) => {
        try {
            await AsyncStorage.setItem('notificationPreference', value.toString());
            if (value) {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                    }),
                });
            }
            else {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: false,
                        shouldPlaySound: false,
                        shouldSetBadge: false,
                    }),
                });
            }
        } catch (error) {
            console.error('Error saving notification preference:', error);
        }
    };

    const toggleSwitch = (value) => {
        setIsEnabled(value);
        saveNotificationPreference(value);
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20 }}>Receive Notifications</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#00BF63' }}
                thumbColor={isEnabled ? '#00BF63' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ fontSize: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default NotificationSwitch;
