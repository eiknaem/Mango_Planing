import React, { } from "react";
import {
    Text,
    View,
    ScrollView,
    Linking,
    Platform,
    Image,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, styles } from "./stylesheet/styles";
import { LogoMangoHome } from "../IconSVG";
export default function OtherApp({ route, navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                global.module = "";
                // global.is_api = "Y"
                // navigation.setOptions({
                //     headerRight: () => <HeaderRight navigation={navigation} showIcon={true} />,
                // });
            };
            fetchData();
        }, [route])
    );
    const _openApp = async (url, bundleId, appleId, appName) => {
        let passcode = await AsyncStorage.getItem("passcode");
        let mango_auth = await AsyncStorage.getItem("mango_auth");
        let baseUrl = await AsyncStorage.getItem("baseUrl");
        let workplace = await AsyncStorage.getItem("workplace");
        let session = await AsyncStorage.getItem("session");
        let webview = await AsyncStorage.getItem("webview");
        let auth = await AsyncStorage.getItem("auth");
        try {
            // console.log(this.state.mango_auth);
            // console.log(this.state.passcode);
            // console.log("baseUrl", this.state.baseUrl);
            console.log("app", `https://play.google.com/store/apps/details?id=${bundleId}`);
            const resp = `${url}://?mango_auth=${mango_auth}&passcode=${passcode}&baseUrl=${baseUrl}&workplace=${workplace}&session=${session}&webview=${webview}&auth=${auth}`;
            await Linking.openURL(resp);
        } catch (ex) {
            console.log("CATCH ERROR");
            Platform.OS == "ios"
                ? await Linking.openURL(
                    `https://apps.apple.com/th/app/${appName}/id${appleId}?l=th`
                )
                : await Linking.openURL(
                    `https://play.google.com/store/apps/details?id=${bundleId}`
                );
        }
    };
    return (
        <View style={[styles.container, {
            // Try setting `flexDirection` to `"row"`.
            flexDirection: "column",
            backgroundColor: "#fff",
            zIndex: 1
        }]}>
            <StatusBar
                animated={true}
                backgroundColor="transparent"
                barStyle={'dark-content'}
                translucent={true}
            />
            <View style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: 20

            }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={{ alignSelf: "center", zIndex: 99, paddingLeft: 7.5 }}
                        onPress={() => navigation.navigate("Home")}>
                        <AntDesign name="arrowleft" size={28} color="black" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 20 }}>
                        <LogoMangoHome />
                    </View>
                    <TouchableOpacity style={{ zIndex: 99, flex: 1, alignItems: "flex-end", justifyContent: "center", right: 10 }}
                        onPress={() => navigation.navigate("Setting")}>
                        <MaterialCommunityIcons name="cog" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ right: 0, top: "4.3%", zIndex: 1, position: "absolute", zIndex: -1 }}>
                    <Image
                        style={{
                        }} source={require("../assets/NewHome/237574.png")} />
                </View>
            </View>
            <Text style={[styles.h5_bold, { fontSize: 18, alignSelf: "flex-start", padding: 15 }]}>Others App</Text>
            <View style={{ flex: 5 }} >
                <ScrollView>
                    <View style={{ flex: 1, width: "100%" }}>
                        <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
                            <View style={[styles.block_item3]}>
                                <Image
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                    }}
                                    source={{ uri: "https://play-lh.googleusercontent.com/PTorT_Wy8scjQHJSuw5X_bLbYYctIGr9nwUPT61xA3pV1olHJy6EOGL4XNrRWHwU1eQ=w480-h960" }} />
                            </View>
                            <View style={{ width: "75%" }}>
                                <Text style={[styles.h5_bold, { fontSize: 18 }]}>Mango Planning</Text>
                                <Text style={[styles.h5, { fontSize: 12 }]}>สำหรับใช้ในการส่งผลงาน ตรวจผลงาน และ แจ้งเตือนผู้รับเหมาก่อสร้างแบบ Real-Time </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        _openApp(
                                            "mangoplan",
                                            "com.mangoconsultant.mango.plan",
                                            "1536377911",
                                            "Planning"
                                        )}
                                    style={{ width: "20%", height: "20%", backgroundColor: colors.bluesky, borderRadius: 30, margin: 10, marginLeft: 0 }}>
                                    <Text style={[styles.h5_bold, { color: colors.white, alignSelf: "center" }]}>เปิด</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1, borderBottomWidth: 1, width: "95%", borderColor: "#D9D9D9" }}></View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
                            <View style={[styles.block_item3]}>
                                <Image
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                    }}
                                    source={{ uri: "https://play-lh.googleusercontent.com/T5j4Bu9k6JditzWibXfkcmXcQMlHJu8J_STdxcCn9W0rcThEUzV1R56YpeCF9omm2O8=w480-h960" }} />
                            </View>
                            <View style={{ width: "75%" }}>
                                <Text style={[styles.h5_bold, { fontSize: 18 }]}>Mango QCM</Text>
                                <Text style={[styles.h5, { fontSize: 12 }]}>สำหรับการตรวจสอบควมคุมคุณภาพของการทำงานในแผนงานที่มีการจัดทำแบบประเมิณคุณภาพไว้</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        _openApp(
                                            "mangoqcmapp",
                                            "com.mangoconsultant.app.qcm",
                                            "1536377911",
                                            "MangoQcmApp"
                                        )}
                                    style={{ width: "20%", height: "20%", backgroundColor: colors.bluesky, borderRadius: 30, margin: 10, marginLeft: 0 }}>
                                    <Text style={[styles.h5_bold, { color: colors.white, alignSelf: "center" }]}>เปิด</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1, borderBottomWidth: 1, width: "95%", borderColor: "#D9D9D9" }}></View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={{ left: 0, bottom: 0, position: "absolute", zIndex: 1, justifyContent: "flex-end" }}>
                <Image
                    style={{
                    }} source={require("../assets/NewHome/237578.png")} />
            </View>
        </View >
    );
}