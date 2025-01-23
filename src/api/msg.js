import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default {
    Confirm: (title, text, no_text, yes_text) => {
        return new Promise((rs, rj) => {
            Alert.alert(
                title,
                text,
                [
                    {
                        text: no_text || "No",
                        onPress: () => {
                            console.log("Cancel Pressed")
                            rs(false);
                        },
                        style: "cancel"
                    },
                    {
                        text: yes_text || "Yes", onPress: () => {
                            rs(true);
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    },
    Alert: async (title, text, ok_text,navigation ) => {
        console.log("text", text.toString());
        var pincode_menu = await AsyncStorage.getItem("pincode_menu") || "N";
        return new Promise((rs, rj) => {
            // const __Navigator = () => {
            //     // const navigation = useNavigation();
            //     navigation.goBack();
            // }
            if (text.toString() == "AxiosError: Request failed with status code 403") {
                Alert.alert(
                    title,
                    text,
                    [
                        {
                            text: ok_text || "OK", onPress: () => {
                                navigation?.navigate(pincode_menu == 'Y' ? "PinCode" : "Login") ||  rs(true);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else if (text.toString() == "AxiosError: Network Error") {
                Alert.alert(
                    title,
                    text,
                    [
                        {
                            text: ok_text || "OK", onPress: () => {
                                navigation?.navigate("Passcode") ||  rs(true);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    title,
                    text,
                    [
                        {
                            text: ok_text || "OK", onPress: () => {
                                rs(true);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }



        });
    }
}