import React, { useEffect, useState, useLayoutEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { styles, colors } from "../stylesheet/styles";
import { useFocusEffect } from "@react-navigation/native";
import { xt, getDataStorage } from "../api/service";
export default function LoadingRows() {
    const [lang, setLang] = useState({});
    const [themes, setthemes] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
        }, [])
    );
    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

    };
    return (
        <View style={styles.container}>
            <View style={[styles.background, { backgroundColor: themes == 'light' ? colors.white : colors.back_dark, justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={"#02D667"} />
                <Text style={[styles.h4_bold, { marginTop: 10, color: themes == 'light' ? colors.black : colors.white }]}>
                    {lang.overlayLoading}
                </Text>
                <Text style={[styles.h5, {color: themes == 'light' ? colors.black : colors.white }]}>
                    {lang.overlayLoading_sub}
                </Text>
            </View>
        </View>
    );
}

