import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [token, setToken] = useState();
  const [userData, setUserData] = useState();
  const gettoken = async () => {
    setToken(await AsyncStorage.getItem("token"));
    setUserData(await AsyncStorage.getItem("userData"));
  }
  gettoken();
  return (
    <SafeAreaView>
      <View>
        <Text>{userData}</Text>
        <Text>{token}</Text>
      </View>
    </SafeAreaView>
  )
}