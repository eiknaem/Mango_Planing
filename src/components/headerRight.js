import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, Animated, Easing, AppState, Text } from 'react-native';
// import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors, styles } from "../stylesheet/styles";
import $xt from "../api/xtools";
import Alert from "../../src/components/Alert";
import linq from "js-linq";
import Moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function HeaderRight({ navigation, showScan, docList, showIcon, showNoti, module, theme }) {
    // console.log("theme", theme);
    const $linq = (arr) => new linq(arr);
    // const checkMat = docList?.detail[0]?.itemcode || null;
    const newDoc = global?.globalDoc;
    const checkMat = newDoc?.detail[0]?.itemcode || null;
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [alertShow, setAlertShow] = useState(false);
    // console.log("checkMat", checkMat);
    let rotateValueHolder = new Animated.Value(0)
    const RotateData = rotateValueHolder.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    // useEffect(() => {
    //     const subscription = AppState.addEventListener("change", async nextAppState => {
    //         if (appState.current.match(/background/) && nextAppState === "active") {
    //             console.log("App has come to the foreground!");
    //             var setTime = (await AsyncStorage.getItem("Times")) || "";
    //             var nowTime = Moment(new Date()).format("HH:mm");
    //             var diff_ms = Moment(nowTime, "HH:mm").diff(Moment(setTime, "HH:mm"));
    //             var dur_obj = Moment.duration(diff_ms);
    //             console.log("setTime", setTime, "dur_obj.minutes()", dur_obj.minutes());
    //             // console.log("Moment", Moment(nowTime, 'HH:mm').format("HH:mm"), "====", Moment(setTime, 'HH:mm').format("HH:mm"));
    //             if (dur_obj.minutes() > 2 && !$xt.isEmpty(setTime)) {
    //                 console.log("show alert");
    //                 setAlertShow(!alertShow);
    //             }
    //         }
    //         appState.current = nextAppState;
    //         setAppStateVisible(appState.current);
    //         // console.log('AppState', appState.current);
    //         if (appState.current === "background") {
    //             var SleepTime = Moment(new Date()).format("HH:mm");
    //             console.log("SleepTime", SleepTime);
    //             await AsyncStorage.setItem("Times", SleepTime);
    //         }
    //     });
    //     return () => {
    //         subscription.remove();
    //     };
    // }, []);

    const _beforeNext = (type) => {
        if (type == "history") {
            navigation.navigate("History")
        } else if (type == "setting") {
            navigation.navigate("Setting", { theme })
        } else if (type == "notification") {
            navigation.navigate("Notification", { docList })
        } else if (type == "barcode") {
            navigation.navigate("BarCode", { docList })
        } else if (type == 'tree') {
            navigation.navigate("ProductHistory", { docList })
        }

    }
    const renderItem = () => {
        if (showScan) {
            return (
                <View style={{ flexDirection: 'row', zIndex: 10 }}>
                    {!$xt.isEmpty(checkMat) ?
                        <TouchableOpacity style={{ paddingHorizontal: 7.5, zIndex: 10 }} onPress={() => _beforeNext("stock")}>
                            <Animated.View style={{ transform: [{ scaleX: -1 }] }}>
                                <MaterialCommunityIcons name="truck-outline" size={28} color="white" />
                                <View style={styles.badge2}><Animated.Text style={[styles.h5, { fontSize: 7, transform: [{ scaleX: -1 }] }]}>{docList.detail.length || 0}</Animated.Text></View>
                            </Animated.View>
                        </TouchableOpacity>
                        : null}
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, marginRight: 7.5, zIndex: 2 }} onPress={() => _beforeNext("barcode")}>
                        <Animated.View style={{ transform: [{ rotate: RotateData }] }}>
                            <MaterialCommunityIcons name="barcode-scan" size={28} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )
        } else if (module == 'ic') {
            return (
                <View style={{ flexDirection: 'row', zIndex: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, zIndex: 10 }} onPress={() => _beforeNext("tree")}>
                        <TreeSVG color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, zIndex: 10 }} onPress={() => _beforeNext("history")}>
                        <Animated.View style={{ transform: [{ rotate: RotateData }] }}>
                            <Ionicons name="time-outline" size={28} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, marginRight: 7.5, zIndex: 10 }} onPress={() => _beforeNext("setting")}>
                        <Animated.View style={{ transform: [{ rotate: RotateData }] }}>
                            <MaterialCommunityIcons name="cog" size={28} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )
        } else if (module == 'qcm') {
            return (
                <View style={{ flexDirection: 'row', zIndex: 10 }}>

                    {/* {showNoti && <TouchableOpacity style={{ paddingHorizontal: 7.5, zIndex: 10 }} onPress={() => _beforeNext("notification")}>
                        <Animated.View style={{ transform: [{ scaleX: -1 }] }}>
                            <MaterialIcons name="notifications-none" size={28} color="white" />
                            <View style={styles.badge2}>
                                <Animated.Text
                                    style={[styles.h5, { fontSize: 10, color: colors.white, transform: [{ scaleX: -1 }] }]}>{docList?.detail?.length < 99 ? docList?.detail?.length : "99+"}</Animated.Text></View>
                        </Animated.View>
                    </TouchableOpacity>} */}
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, marginRight: 7.5, zIndex: 10 }} onPress={() => _beforeNext("setting")}>
                        <Animated.View style={{ transform: [{ rotate: RotateData }] }}>
                            <MaterialCommunityIcons name="cog" size={28} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ flexDirection: 'row', zIndex: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 7.5, marginRight: 7.5, zIndex: 10 }} onPress={() => _beforeNext("setting")}>
                        <Animated.View style={{ transform: [{ rotate: RotateData }] }}>
                            <MaterialCommunityIcons name="cog" size={28} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    const _onClose = async () => {
        console.log("on close");
        setAlertShow(!alertShow);
        await AsyncStorage.setItem("Times", "");
        let pincode_menu = await AsyncStorage.getItem("pincode_menu") || "N";
        navigation.navigate(pincode_menu == 'Y' ? "PinCode" : "Login")
    };
    return (
        <>
            {alertShow && (
                <Alert
                    visible={alertShow}
                    onClose={() => {
                        _onClose();
                    }}
                    message={"Your Session is Expire!"}
                    type={"warning"}
                />
            )}
            {showIcon && renderItem()}
        </>
    )
}