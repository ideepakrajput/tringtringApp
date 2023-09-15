import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const [token, setToken] = useState([]);
  const [userData, setUserData] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const gettoken = async () => {
        setToken(await AsyncStorage.getItem("token"));
        setUserData(await AsyncStorage.getItem("userData"));
      }
      gettoken();
    }, [])
  );

  return (
    <SafeAreaView>
      <View>
        {userData === null ?
          <Text>User not loggedin</Text>
          :
          <Text>User Phone Number :- {userData}</Text>
        }
      </View>
    </SafeAreaView>
  )
}