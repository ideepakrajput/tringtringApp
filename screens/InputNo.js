import {
    View,
    Text,
    TextInput,
} from "react-native";

import React, { useState, useContext, useEffect } from "react";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const InputNo = async ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8,
                        }}
                    >
                        Mobile Number
                    </Text>

                    <View
                        style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22,
                        }}
                    >
                        <TextInput
                            placeholder="+91"
                            placeholderTextColor={COLORS.black}
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%",
                            }}
                            defaultValue="+91"
                        />

                        <TextInput
                            placeholder="Enter your phone number"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={{
                                width: "80%",
                            }}
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)}
                        />

                        <Button
                            title="Login"
                            filled
                            style={{
                                marginTop: 18,
                                marginBottom: 4,
                            }}
                            onPress={handleLogin}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default InputNo;