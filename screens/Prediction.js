import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import COLORS from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BASE_API_URL } from '../constants/baseApiUrl';

let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const Prediction = ({ navigation }) => {
    const [predictionNumber, setPredictionNumber] = useState('');


    const submitPrediction = async () => {
        const token = await AsyncStorage.getItem("token");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.post(`${BASE_API_URL}api/winning/user/prediction_number`, { predictionNumber }, config);

            navigation.navigate("Home");
            Alert.alert("Prediction Number Added Successfully");
        } catch {
            Alert.alert(error.response.data.message);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, height: 100, flexDirection: "column", justifyContent: "space-around", backgroundColor: COLORS.white }}>
            <View style={{ flex: 2 }}>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={styles.text}
                    >
                        ENTER 5 DIGIT PREDICTION NUMBER
                    </Text>

                    <Text
                        style={styles.text}
                    >
                        FOR , DRAW @ 9 PM IST
                    </Text>

                    <TextInput
                        style={{ color: "green", fontSize: 40, borderWidth: 2, marginVertical: 10, paddingHorizontal: 10, width: 145, borderRadius: 15, borderColor: "green" }}
                        maxLength={5}
                        autoFocus={true}
                        keyboardType='numeric'
                        placeholder=' - - - - -'
                        value={predictionNumber}
                        onChangeText={(text) => setPredictionNumber(text)}
                    >
                    </TextInput>
                    <Text style={{ marginTop: -5, fontWeight: "bold", color: "green" }}>terms & conditions apply*</Text>
                    <TouchableOpacity
                        style={{
                            margin: 10,
                            backgroundColor: "green",
                            borderRadius: 15,
                            padding: 10,
                            width: 125
                        }}
                        onPress={submitPrediction}
                    >
                        <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold"
                        }}
                    >Yesterday's Winning Number ()</Text>
                    <Text
                        style={{
                            letterSpacing: 15,
                            fontSize: 50
                        }}
                    >22222</Text>


                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            backgroundColor: "grey",
                            width: 250,
                            textAlign: "center",
                            padding: 10,
                            borderRadius: 15,
                            margin: 10
                        }}
                    >Your Prediction ()</Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center" }}>
                    <Image
                        source={require("../assets/facebook.png")}
                        style={{
                            height: 50,
                            width: 50,
                            marginRight: 8,
                        }}
                        resizeMode="contain"
                    >
                    </Image>

                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: "center",
                            padding: 10,
                        }}
                    >WATCH THE DRAW VIDEO</Text>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <View style={{ alignItems: "center", backgroundColor: "#F8DE22", padding: 20 }}>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: "center",
                            fontWeight: 'bold'
                        }}>
                        GET TO WIN
                    </Text>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: "center",
                            fontWeight: 'bold'
                        }}>
                        AMAZING PRIZES !!!
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            backgroundColor: "red",
                            color: "white",
                            width: 300,
                            textAlign: "center",
                            padding: 10,
                            borderRadius: 15,
                            margin: 10
                        }}
                    >
                        VIEW LIST OF PRIZES
                    </Text>
                </View>
            </View>
        </SafeAreaView >
    )
}


const styles = EStyleSheet.create({
    text: {
        fontSize: "21rem",
        fontWeight: "bold",
        color: COLORS.black,
    }
})

export default Prediction;