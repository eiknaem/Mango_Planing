//React Native
import React, { useEffect, useState, useRef } from "react";
import { AppState } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import $xt from "../api/xtools";
import Alert from "../components/Alert";
import { colors } from "../stylesheet/styles";
import MessageBox from "../api/msg";
import { apiAuth } from "../api/authentication";
export default function HomeLayout({ props }) {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [alertShow, setAlertShow] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        async function fetchData() {
            var fromAuth = await AsyncStorage.getItem("fromAuth");
            console.log("fromAuth", fromAuth);
            console.log("HomeLayout", appState);
            let pincode_menu = await AsyncStorage.getItem("pincode_menu") || "N";
            if (appState.current == "active" && fromAuth == "Y"&& pincode_menu != 'Y') {
                console.log("active");
                var setTime = (await AsyncStorage.getItem("Times")) || "";
                let sessionValue = await AsyncStorage.getItem("sessionValue") || 2;
                var nowTime = Moment(new Date()).format("HH:mm");
                var diff_ms = Moment(nowTime, "HH:mm").diff(Moment(setTime, "HH:mm"));
                var dur_obj = Moment.duration(diff_ms);
                let _sessionValue = $xt.dec(sessionValue)
                console.log("dur_obj.minutes", dur_obj.minutes());
                console.log("_sessionValue", _sessionValue);
                console.log("setTime", setTime);
                if ((dur_obj.minutes() >= _sessionValue) && !$xt.isEmpty(setTime)) {
                    console.log("show alert1");
                    // console.log("show alert");
                    // _onClose();
                    setAlertShow(true);
                }
            }
        }
        const subscription = AppState.addEventListener("change", async nextAppState => {
            var fromAuth = await AsyncStorage.getItem("fromAuth");
            console.log("fromAuth", fromAuth);
            if (appState.current.match(/background/) && nextAppState === "active") {
                console.log("App has come to the foreground!");
                var setTime = (await AsyncStorage.getItem("Times")) || "";
                let sessionValue = await AsyncStorage.getItem("sessionValue") || 2;
                var nowTime = Moment(new Date()).format("HH:mm");
                var diff_ms = Moment(nowTime, "HH:mm").diff(Moment(setTime, "HH:mm"));
                var dur_obj = Moment.duration(diff_ms);
                console.log("sessionValue", sessionValue);
                let _sessionValue = $xt.dec(sessionValue)
                console.log("dur_obj.minutes", dur_obj.minutes());
                console.log("เวลาตอนนี้", Moment(nowTime, 'HH:mm').format("HH:mm"), "==== เวลาปิดจอ", Moment(setTime, 'HH:mm').format("HH:mm"));
                console.log("_sessionValue", _sessionValue);
                console.log("setTime", setTime);
                console.log("fromAuth", fromAuth);
                if ((dur_obj.minutes() >= _sessionValue) && !$xt.isEmpty(setTime) && fromAuth == "Y") {
                    console.log("show alert2");
                    // _onClose();
                    setAlertShow(true);
                }
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState);
            if (appState.current === "background") {
                var SleepTime = Moment(new Date()).format("HH:mm");
                console.log("เริ่มหยุดจอตอนเวลา", SleepTime);
                await AsyncStorage.setItem("Times", SleepTime);
            }
        });
        fetchData();
        return () => {
            subscription.remove();
        };
    }, []);
    const _onClose = async () => {
        let theme = { head: colors.darkBlue, body: colors.white }
        await AsyncStorage.setItem("theme", JSON.stringify(theme));
        global.module = "";
        let pincode_menu = await AsyncStorage.getItem("pincode_menu") || "N";
        if (pincode_menu != 'Y') {
            try {
                await apiAuth.logout();
            } catch (ex) {
                MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
            }
            await AsyncStorage.setItem("mango_auth", "");
            await AsyncStorage.setItem("Times", "");
            console.log("pincode_menu", pincode_menu);
        }
        await AsyncStorage.setItem("fromAuth", "N");
        navigation.reset({
            index: 1,
            routes: [{ name: pincode_menu == 'Y' ? "PinCode" : "Login" }],
        });
    };
    return (
        <>
            {alertShow && (
                <Alert
                    visible={alertShow}
                    onClose={() => {
                        setAlertShow(false);
                        _onClose()
                    }}
                    message={"Your Session is Expire!"}
                    type={"warning"}
                />
            )}
            {props}
        </>
    )
}