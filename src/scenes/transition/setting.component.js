import React, { useEffect, useState, useLayoutEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Switch, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { styles, colors } from "../../stylesheet/styles";
import { Ionicons } from "@expo/vector-icons";
export default function SettingScreen(route, navigation) {
    const [lang, setLang] = useState({});
    const [themes, setthemes] = useState("");
    const [pincode, setPincode] = useState(false);
    const [language, setLanguage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
        }, [])
    );
    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
        setLanguage(lang_.lang_wh == 'th-TH' ? "TH" : "EN");


        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

    };
    const toggleLanguage = async (key) => {
        setLanguage(key);
        setDataStorage("language_ppn", key);
        let lang_ = await xt.getLang();
        setLang(lang_);
    };
    const toggleThemes = async (key) => {
        // console.log("key", key, themes);
        setDataStorage("themes_ppn", key);
        setthemes(key);
    };
    return (
        <View style={{ flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.back_bg, padding: 10 }}>
            <View style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, justifyContent: "center" }}>
                <Text style={[styles.h5_bold, { marginLeft: 10 }]}>{lang.language}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleLanguage("TH")}
                style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_14, { marginLeft: 30 }]}>{lang.thai}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    {language == 'TH' ? (<Ionicons name="checkmark-circle" size={24} color="#8d99b2" />) : null}

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleLanguage("EN")}
                style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_14, { marginLeft: 30 }]}>{lang.english}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    {language == 'EN' ? (<Ionicons name="checkmark-circle" size={24} color="#8d99b2" />) : null}

                </View>
            </TouchableOpacity>
            <View style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_bold, { marginLeft: 10 }]}>{lang.pincode}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    <Switch
                        trackColor={{ false: "#51b84f", true: "#767577" }}
                        thumbColor={pincode ? "#fff" : "#fff"}
                        ios_backgroundColor="#51b84f"
                        onValueChange={() => {
                            setPincode(!pincode);;
                        }}
                        value={pincode}
                    />
                </View>

            </View>
            <View style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_bold, { marginLeft: 10 }]}>{lang.login_biometric}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    <Switch
                        trackColor={{ false: "#51b84f", true: "#767577" }}
                        thumbColor={pincode ? "#fff" : "#fff"}
                        ios_backgroundColor="#51b84f"
                        onValueChange={() => {
                            setPincode(!pincode);;
                        }}
                        value={pincode}
                    />
                </View>
            </View>
            <View style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_bold, { marginLeft: 10 }]}>{lang.save_media_library}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    <Switch
                        trackColor={{ false: "#51b84f", true: "#767577" }}
                        thumbColor={pincode ? "#fff" : "#fff"}
                        ios_backgroundColor="#51b84f"
                        onValueChange={() => {
                            setPincode(!pincode);;
                        }}
                        value={pincode}
                    />
                </View>

            </View>
            <View style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, justifyContent: "center" }}>
                <Text style={[styles.h5_bold, { marginLeft: 10 }]}>{lang.themes_select}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleThemes('light')}
                style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_14, { marginLeft: 30 }]}>{lang.light}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    {themes == 'light' ? (<Ionicons name="checkmark-circle" size={24} color="#8d99b2" />) : null}

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleThemes('dark')}
                style={{ width: "100%", height: 50, borderBottomWidth: 2, borderBottomColor: colors.image_light, flexDirection: "row" }}>
                <View style={{ flex: 3, justifyContent: "center" }}>
                    <Text style={[styles.h5_14, { marginLeft: 30 }]}>{lang.dark}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    {themes == 'dark' ? (<Ionicons name="checkmark-circle" size={24} color="#8d99b2" />) : null}

                </View>
            </TouchableOpacity>
        </View>
    );
}
