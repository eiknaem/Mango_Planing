import React, { useEffect, useLayoutEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, styles } from "../stylesheet/styles";
import { SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native-animatable";
export default function Layout({ props, navigation, }) {
    // console.log("theme", theme);
    const [isTheme, setTheme] = useState({});
    const [isLoadding, setLoadding] = useState(false);
    useLayoutEffect(() => {
        async function fetchData() {
            let theme = JSON.parse(
                await AsyncStorage.getItem("theme")
            );
            // console.log("layout theme ", theme);
            setTheme(theme)
            setLoadding(true)
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: theme?.head || colors.red,
                    shadowColor: "transparent",
                    elevation: 0,
                },
            });
        }
        fetchData();
    }, []);
    return (
        isLoadding && <View style={{ backgroundColor: isTheme?.head || colors.red, flex: 1, zIndex: 10 }}>
            <SafeAreaView style={[styles.container_layout]}>
                {props}
            </SafeAreaView>
        </View>
    )
}