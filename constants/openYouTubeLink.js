import { Linking, Alert } from "react-native";

export const openYouTubeLink = (yesterdayWinningURL) => {

    if (yesterdayWinningURL == undefined || null) {
        Alert.alert("SORRY", "Video not found !")
    } else if (yesterdayWinningURL != "" || undefined) {
        Linking.openURL(yesterdayWinningURL);
    } else {
        Alert.alert("SORRY", "Video not found !")
    }
};