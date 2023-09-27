import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FontAwesome } from '@expo/vector-icons';
import FooterMenu from '../components/Menus/FooterMenu';
const PrizesData = () => {

    const [showComponent, setShowComponent] = useState('A');

    let content;

    const handleComponentA = () => {
        setShowComponent('A')
    }
    const handleComponentB = () => {
        setShowComponent('B')
    }
    const handleComponentC = () => {
        setShowComponent('C')
    }

    switch (showComponent) {
        case 'A':
            content = (
                <>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={styles.headCell}>
                                <Text style={styles.headCellText}>Match</Text>
                            </View>
                            <View style={styles.headCell}>
                                <Text style={styles.headCellText}>Prize</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.cellTextInput}>
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                </Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>1 Lakh Rupees</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.cellTextInput}>
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                </Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>500 Rupees BookMyShow</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.cellTextInput}>
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                    <FontAwesome name="circle" size={25} color="green" />
                                </Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>250 Rupees BookMyShow</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View>
                        <Text style={styles.text3}>Terms & Conditions Apply:</Text>
                        <Text style={styles.text2}>*1st Prize if more than 1 user predicts same number the amount would be split equally.</Text>
                        <Text style={styles.text2}>*2nd & 3rd Prize would be given for first 10 winners only.</Text>
                    </View> */}
                </>
            );
            break;
        case 'B':
            content = (
                <View>
                    <Text style={styles.text3}>Coming Soon</Text>
                </View>
            );
            break;
        case 'C':
            content = (
                <View>
                    <Text style={styles.text3}>Coming Soon</Text>
                </View>
            );
            break;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.text3}>List of Prizes you can win !</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 20 }}>
                <TouchableOpacity onPress={handleComponentA} style={styles.button}><Text style={styles.text1}>DAILY</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleComponentB} style={styles.button}><Text style={styles.text1}>MONTHLY</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleComponentC} style={styles.button}><Text style={styles.text1}>YEARLY</Text></TouchableOpacity>
            </View>
            {content}
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </SafeAreaView>
    );
};

const styles = EStyleSheet.create({
    text1: {
        fontSize: "21rem",
        fontWeight: "bold",
        color: "black",
        padding: "5rem",
    },
    text2: {
        fontSize: "21rem",
        fontWeight: "bold",
        color: "black",
        padding: "4rem",
        marginLeft: 15
    },
    text3: {
        fontSize: "30rem",
        fontWeight: "bold",
        color: "black",
        padding: "4rem",
        marginHorizontal: 15
    },
    button:
    {
        borderWidth: 2,
        textAlign: "center",
        borderRadius: 10
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
        marginHorizontal: 15
    },
    row: {
        flexDirection: 'row',
    },
    headCell: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "black",
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        justifyContent: "center"
    },
    headCellText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: "white",
        fontSize: "21rem",
    },
    cellTextInput: {
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 5,
        marginLeft: 10
    },
    cellText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: "25rem"
    },
});

export default PrizesData;
