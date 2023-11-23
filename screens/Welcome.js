import React, { useCallback } from 'react';
import { Dimensions, Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AntDesign } from '@expo/vector-icons';

let entireScreenWidth = Dimensions.get('window').width;

SplashScreen.preventAutoHideAsync();

EStyleSheet.build({ $rem: entireScreenWidth > 340 ? 18 : 16 });

const Welcome = ({ navigation }) => {
    const [isLoaded] = useFonts({
        "lato-reg": require("../assets/fonts/Lato/Lato-Regular.ttf"),
        "lato-light": require("../assets/fonts/Lato/Lato-Light.ttf"),
        "lato-bold": require("../assets/fonts/Lato/Lato-Bold.ttf"),
    });

    const handleOnLayout = useCallback(async () => {
        if (isLoaded) {
            await SplashScreen.hideAsync(); //hide the splashscreen
        }
    }, [isLoaded]);

    if (!isLoaded) {
        return null;
    }

    const handleIcon = () => {
        navigation.navigate("Login");
    }

    return (
        <SafeAreaView>
            <View style={styles.container} onLayout={handleOnLayout}>
                <View>
                    <Text style={[styles.text, { color: COLORS.black }]}>Welcome <Text style={[styles.text, { color: COLORS.primary }]}>Onboard!</Text></Text>

                </View>
                <View>
                    <Text style={[styles.text2]}>
                        Finish setting up your account and start earning instantly
                    </Text>
                </View>
                <View>
                    <Image style={styles.image} source={require("../assets/BusinessPlan.png")}>
                    </Image>
                </View>
                <View>
                    <TouchableOpacity style={styles.icon} onPress={handleIcon}>
                        <AntDesign name="right" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = EStyleSheet.create({
    container: {
        padding: "1rem",
        paddingTop: "4rem",
    },
    text: {
        fontSize: "2rem",
        fontWeight: 800,
        fontFamily: "lato-reg"
    },
    text2: {
        fontSize: "1rem",
        fontWeight: 500,
        fontFamily: "lato-reg",
        color: COLORS.secondary,
    },
    image: {
        width: 328,
        height: 328,
        marginTop: 32,
        marginBottom: 48,
        alignSelf: "center"
    },
    icon: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 8,
        marginRight: 16
    }
})

export default Welcome;