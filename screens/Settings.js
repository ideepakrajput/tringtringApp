import { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import SelectPicker from '../components/SelectPicker';
import NotificationSwitch from '../components/NotificationSwitch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URL } from "../constants/baseApiUrl";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { state, setState } = useContext(AuthContext);
  const { isEnabled, setIsEnabled } = useContext(AuthContext);

  const options = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Malyalam", "Bengali"];
  const [selectedOption, setSelectedOption] = useState(null);
  const { isPredicted } = useContext(AuthContext);

  async function schedulePushNotification() {
    const trigger = {
      hour: 10, // Hour in 24-hour format
      minute: 0,
      repeats: true, // Repeat daily
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Predict and Win",
        body: `Aaj tring tring nhi kiya kya ????
      Predict your number to win exiting prizes !!`,
      },
      trigger
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await Notifications.getExpoPushTokenAsync({ projectId: '72bad700-de75-45e7-8a36-492269f53e30' })).data;
      console.log(token);
      setExpoPushToken(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  async function schedulePushNotification7PM() {
    const trigger = {
      hour: 19, // Hour in 24-hour format
      minute: 0,
      repeats: true, // Repeat daily
    };

    if (!isPredicted) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Predict and Win",
          body: `Aaj tring tring nhi kiya kya ????
      Predict your number to win exiting prizes !!`,
        },
        trigger
      });
    }
  }


  const handleSelect = (option) => {
    setSelectedOption(option);
  };


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // Load the user's preference from AsyncStorage
    loadNotificationPreference();
  }, []);

  useEffect(() => {
    schedulePushNotification();

    const intervalId = setInterval(schedulePushNotification, 60000);

    return () => {
      clearInterval(intervalId);
    }
  }, [])
  useEffect(() => {
    schedulePushNotification7PM();

    const intervalId = setInterval(schedulePushNotification7PM, 60000);

    return () => {
      clearInterval(intervalId);
    }
  }, [])

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

  const token = state?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  async function handleSettings() {
    await axios.post(`${BASE_API_URL}api/user/settings`, {
      language: selectedOption,
      notificationsEnabled: isEnabled
    }, config).then(() => {
      alert("Your settings has been updated");
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: 'flex-start',
        marginVertical: 50
      }}>
      <View>
        <SelectPicker options={options} onSelect={handleSelect} />
        <Text style={{ fontSize: 30, marginTop: 20 }}>Notifications</Text>
        <NotificationSwitch />
        <TouchableOpacity
          style={{ backgroundColor: "#F4E869", padding: 10, borderRadius: 15, marginTop: 20 }}
          onPress={handleSettings}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "white", textAlign: "center" }}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}