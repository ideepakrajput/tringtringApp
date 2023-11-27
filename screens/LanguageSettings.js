import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
// import { Dropdown } from 'react-native-element-dropdown';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import COLORS from "../constants/colors";

export default function LanguageSettings() {
    const [language, setLanguage] = useState();

    const data = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada", "Malyalam", "Bengali"];
    // const data = [
    //     { label: "English", value: "english" },
    //     { label: "Hindi", value: "hindi" },
    //     { label: "Telugu", value: "telugu" },
    //     { label: "Tamil", value: "tamil" },
    //     { label: "Marathi", value: "marathi" },
    //     { label: "Kannada", value: "kannada" },
    //     { label: "Malayalam", value: "malayalam" },
    //     { label: "Bengali", value: "bengali" }
    // ]
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
                setLanguage(res.data.language)
            }).catch((error) => {
                console.log(error.response.data.message);
            })
        }

        async function handleSettings() {
            await axios.post(`${BASE_API_URL}api/user/settings`, {
                language
            }, config).then(() => {
            }).catch((err) => {
                console.log(err);
            });
        }
        fetchData();
        handleSettings();
    }, [language])
    return (
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            {/* <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle} r
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select your gender"
                value={language}
                onChange={item => {
                    setGender(item.value);
                }}
            /> */}
            {
                data.map((datum) => (
                    <View key={datum}>
                        <Text onPress={() => setLanguage(datum)} style={{ fontSize: 20, paddingVertical: 8, fontFamily: "lato-reg", fontWeight: "400", borderBottomWidth: 1 }}><Text style={[language == datum ? { fontWeight: "900" } : { fontWeight: "400" }]}>{datum}</Text></Text>
                    </View>
                ))
            }
        </View >
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