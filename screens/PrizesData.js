import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FontAwesome } from '@expo/vector-icons';
import FooterMenu from '../components/Menus/FooterMenu';
import COLORS from '../constants/colors';
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
                    {/* <View style={styles.table}>
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
                    </View> */}

                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 16 }}>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Second</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(4 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>500 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 170, height: 170, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Image style={{ height: 38, resizeMode: "contain", alignSelf: "center", paddingBottom: 12 }} source={require("../assets/trophy.png")}></Image>
                                <Text style={styles.prizeHeading}>Winner</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(5 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>1 lakh Rupees </Text>
                                        <Text style={styles.prize}>Cash Prize </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/cash.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Third</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(3 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                    <View>
                                        <Text style={styles.prize}>250 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </>
            );
            break;
        case 'B':
            content = (
                <View>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 16 }}>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Second</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(4 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>500 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 170, height: 170, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Image style={{ height: 38, resizeMode: "contain", alignSelf: "center", paddingBottom: 12 }} source={require("../assets/trophy.png")}></Image>
                                <Text style={styles.prizeHeading}>Winner</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(5 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>1 lakh Rupees </Text>
                                        <Text style={styles.prize}>Cash Prize </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/cash.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Third</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(3 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                    <View>
                                        <Text style={styles.prize}>250 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
            break;
        case 'C':
            content = (
                <View>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 16 }}>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Second</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(4 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>500 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 170, height: 170, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Image style={{ height: 38, resizeMode: "contain", alignSelf: "center", paddingBottom: 12 }} source={require("../assets/trophy.png")}></Image>
                                <Text style={styles.prizeHeading}>Winner</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(5 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <View>
                                        <Text style={styles.prize}>1 lakh Rupees </Text>
                                        <Text style={styles.prize}>Cash Prize </Text>
                                    </View>
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/cash.png")}></Image>
                                </View>
                            </View>

                            <View style={{ width: 150, height: 150, paddingVertical: 12, paddingHorizontal: 5, backgroundColor: COLORS.prize, borderRadius: 8 }}>
                                <Text style={styles.prizeHeading}>Third</Text>
                                <Text style={{ fontSize: 8, fontFamily: "lato-bold", fontWeight: 600, textAlign: "center" }}>(3 numbers match)</Text>
                                <View style={styles.cell}>
                                    <Text style={styles.cellTextInput}>
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.primary} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                        <FontAwesome name="circle" size={12} color={COLORS.grey} />
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }} >
                                    <Image style={{ height: 45, width: 45, resizeMode: "contain", alignSelf: "center" }} source={require("../assets/bookmyshow.png")}></Image>
                                    <View>
                                        <Text style={styles.prize}>250 Rupees</Text>
                                        <Text style={styles.prize}> BookMyShow</Text>
                                        <Text style={styles.prize}>Coupon </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            );
            break;
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 20 }}>
                    <TouchableOpacity
                        onPress={handleComponentA}
                        style={[showComponent === 'A' ? styles.activeTabStyle : styles.inactiveTabStyle]}
                    >
                        <Text style={[styles.text1, showComponent === 'A' ? styles.activeTextStyle : styles.inactiveTextStyle]}>DAILY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleComponentB}
                        style={[showComponent === 'B' ? styles.activeTabStyle : styles.inactiveTabStyle]}
                    >
                        <Text style={[styles.text1, showComponent === 'B' ? styles.activeTextStyle : styles.inactiveTextStyle]}>MONTHLY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleComponentC}
                        style={[showComponent === 'C' ? styles.activeTabStyle : styles.inactiveTabStyle]}
                    >
                        <Text style={[styles.text1, showComponent === 'C' ? styles.activeTextStyle : styles.inactiveTextStyle]}>YEARLY</Text>
                    </TouchableOpacity>
                </View>
                {content}
                <View style={{ paddingTop: 40 }}>
                    <Text style={styles.prizes}>Your Prizes</Text>
                    <Text style={{ fontSize: 16, fontFamily: "lato-reg", color: COLORS.secondary }}>Hmm! Looks Empty Start predicting to win exciting cash prices.</Text>
                </View>
                <View style={{ paddingTop: 24 }}>
                    <Text style={styles.prizes}>Terms & Conditions Apply:</Text>
                    <Text style={styles.text2}>*1st Prize if more than 1 user predicts same number the amount would be split equally.</Text>
                    <Text style={styles.text2}>*2nd & 3rd Prize would be given for first 10 winners only.</Text>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <FooterMenu />
            </View>
        </SafeAreaView >
    );
};

const styles = EStyleSheet.create({
    text1: {
        fontSize: 20,
        fontFamily: "lato-bold",
    },
    text2: {
        fontSize: 14,
        fontFamily: "lato-reg",
        paddingTop: 8
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
        justifyContent: "center",
        alignSelf: "center"
    },
    headCellText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: "white",
        fontSize: "1rem",
    },
    cellTextInput: {
        textAlign: 'left',
        fontWeight: 'bold',
        letterSpacing: 5,
    },
    cellText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: "1rem"
    },
    activeTabStyle: {
        color: COLORS.primary,
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 2
    },
    activeTextStyle: {
        color: COLORS.primary
    },
    inactiveTextStyle: {
        color: 'black', // Example active tab text color
    },
    inactiveTabStyle: {
        textAlign: "center",
    },
    prizeHeading: {
        fontFamily: "lato-bold",
        fontSize: 20,
        fontWeight: 900,
        textAlign: "center"
    },
    prize: {
        fontFamily: "lato-bold",
        fontSize: 16,
        textAlign: "center"
    },
    prizes: {
        fontSize: 24,
        color: COLORS.primary,
        fontFamily: "lato-bold",
        fontWeight: 900
    }
});

const styless = StyleSheet.create({
    prize: {
        fontFamily: "lato-bold",
        fontSize: 16,
        textAlign: "center"
    }
})


export default PrizesData;
