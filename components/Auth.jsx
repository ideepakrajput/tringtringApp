// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from '@react-native-google-signin/google-signin';
// // import { supabase } from '../utils/supabase';
// import { View, StyleSheet } from 'react-native';
// export default function () {
//     GoogleSignin.configure({
//         scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//         webClientId: '463746785862-a1r667n088f5p85tvl31qltsgsfrsr70.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access). Required to get the `idToken` on the user object!
//     });

//     return (
//         <View style={styles.container}>
//             <GoogleSigninButton
//                 size={GoogleSigninButton.Size.Wide}
//                 color={GoogleSigninButton.Color.Dark}
//                 onPress={async () => {
//                     try {
//                         await GoogleSignin.hasPlayServices();
//                         const userInfo = await GoogleSignin.signIn();
//                         // console.log(userInfo)
//                         if (userInfo.idToken) {
//                             // const { data, error } = await supabase.auth.signInWithIdToken({
//                             //     provider: 'google',
//                             //     token: userInfo.idToken
//                             // });
//                             console.log(userInfo)
//                         }
//                         else {
//                             throw new Error("no token ID")
//                         }
//                     } catch (error) {
//                         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//                             console.log("cancelled")
//                         } else if (error.code === statusCodes.IN_PROGRESS) {
//                             console.log("In progress")
//                         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//                             console.log("Gplay services not enabled")
//                         } else {
//                             console.log("something went wrong")
//                         }
//                     }
//                 }}
//             />
//         </View>

//     )
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center'
//     }
// })