import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import COLORS from "../constants/colors";
import Button from "../components/Button";
import { BASE_API_URL } from '../constants/baseApiUrl';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

export default function BasicDetails() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const token = state?.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        async function fetchData() {
            await axios.get(`${BASE_API_URL}api/user/user_details`, config).then((res) => {
                setName(res.data.name);
                setPhoneNumber(res.data.phoneNumber.toString());
                setEmail(res.data.email)
            }).catch((error) => {
                console.log(error.response.data.message);
            })
        }
        fetchData();
    }, [])

    const saveDetails = async () => {
        await axios.post(`${BASE_API_URL}api/user/user_details`, { name, email, phoneNumber }, config).then((res) => {
            setName(res.data.name);
            setPhoneNumber(res.data.phoneNumber.toString());
            setEmail(res.data.email)
        }).catch((error) => {
            console.log(error.response.data.message);
        })
    }

    return (
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            <View style={{ marginBottom: 8, marginTop: 8 }}>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                    }}
                >
                    Name
                </Text>

                <View
                    style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22,
                    }}
                >
                    <TextInput
                        placeholder="Update your name"
                        placeholderTextColor={COLORS.secondary}
                        style={{
                            width: "100%",
                        }}
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </View>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                    }}
                >
                    Mobile Number
                </Text>
                <View style={styles.inputView}>
                    <TextInput
                        placeholder="+91"
                        placeholderTextColor={COLORS.secondary}
                        keyboardType="numeric"
                        style={{
                            fontSize: 22,
                            fontWeight: "500",
                            borderLeftColor: COLORS.secondary,
                        }}
                    />

                    <TextInput
                        placeholder="Update your Mobile No"
                        placeholderTextColor={COLORS.secondary}
                        keyboardType="numeric"
                        style={[styles.inputBox, { width: "89%" }]}
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                    />
                </View>
            </View>
            <View style={{ marginBottom: 8, marginTop: 8 }}>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                    }}
                >
                    Email
                </Text>

                <View
                    style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22,
                    }}
                >
                    <TextInput
                        placeholder="Update your Email Id"
                        placeholderTextColor={COLORS.secondary}
                        style={{
                            width: "100%",
                        }}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
            </View>
            <Button
                title="Save Details"
                filled
                style={{
                    marginTop: 16,
                }}
                onPress={saveDetails}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 8,
        paddingLeft: 22,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    inputView: {
        width: "100%",
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8
    },
    inputBox: {
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    dropdown: {
        height: 45,
        borderWidth: 1,
        borderRadius: 5
    },
    placeholderStyle: {
        fontSize: 16,
        paddingLeft: 8
    },
    selectedTextStyle: {
        fontSize: 16,
        paddingLeft: 22
    },
});