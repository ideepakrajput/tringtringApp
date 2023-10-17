import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BASE_API_URL } from '../constants/baseApiUrl';
import { AuthContext } from '../context/authContext';

const ProfileDetailsCard = () => {
    const [name, setName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
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
                setPhoneNumber(res.data.phoneNumber);
            }).catch((error) => {
                console.log(error.response.data.message);
            })
        }
        fetchData();
    }, [name, phoneNumber])
    return (
        <View style={styles.card}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{name}</Text>

            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.text}>{phoneNumber}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: 55,
        paddingVertical: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        margin: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 20,
        marginBottom: 15,
    },
});

export default ProfileDetailsCard;
