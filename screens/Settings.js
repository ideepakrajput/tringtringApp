import { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import SelectPicker from '../components/SelectPicker';
import NotificationSwitch from '../components/NotificationSwitch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [state] = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(null);

  const options = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Malyalam", "Bengali"];
  const [selectedOption, setSelectedOption] = useState(null);

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

  const handleSettings = async (e) => {
    e.preventDefault();
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
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginHorizontal: 20
      }}>


      <View>
        <SelectPicker options={options} onSelect={handleSelect} />
        <Text style={{ fontSize: 30, marginTop: 20 }}>Notifications</Text>
        <NotificationSwitch />
        <TouchableOpacity
          style={{ backgroundColor: "#F4E869", padding: 10, borderRadius: 15, marginTop: 20 }}
          onPress={handleSettings}
        >
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>Save Settings</Text>
        </TouchableOpacity>
      </View>


      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Predict and Win",
      body: `Aaj tring tring nhi kiya kya ????
      Predict your number to win exiting prizes !!`,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
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
