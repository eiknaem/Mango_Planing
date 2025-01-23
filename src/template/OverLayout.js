import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, styles } from "../stylesheet/styles";
import {
    StyleSheet,
    StatusBar,
    View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function OverLayout({ props, navigation }) {
    // console.log("theme", theme);
    const [isTheme, setTheme] = useState({});
    const [isLoadding, setLoadding] = useState(false);
    useEffect(() => {
        async function fetchData() {
            // let theme = JSON.parse(
            //     await AsyncStorage.getItem("theme")
            // );
            // // console.log("layout theme ", theme);
            // setTheme(theme)
            setLoadding(true)
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: colors.bluesea,
                    shadowColor: "transparent",
                    elevation: 0,
                },
            });
        }
        fetchData();
    }, []);
    return (
        isLoadding && <View style={styles.container_full}>
            <StatusBar barStyle={'light-content'} />
            {props}
        </View>
    )
}