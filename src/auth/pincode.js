import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert,
    ScrollView,
    Dimensions
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import linq from "js-linq";
import Ripple from 'react-native-material-ripple';
import * as SecureStore from 'expo-secure-store';
// Link api
import MessageBox from "../api/msg";
import $xt from "../api/xtools";
import { styles, colors } from "../stylesheet/styles";
import LoaddingLayout from "../template/loadding_layout";
import OverLayout from "../template/OverLayout";
import BannerImage from "../../assets/images/logo.png";
import { apiPasscode, apiAuth } from "../api/authentication";
const windowWidth = Dimensions.get('window').width;
const widthScreen = 767;
export default function PinCode({ route, navigation }) {
    let page = route?.params?.page || "";
    const params = route?.params || "";
    const isReset = params?.reset || false;
    const isSetting = params?.page || false;
    const $linq = (arr) => new linq(arr);
    const [putList, setPutList] = useState([null, null, null, null, null, null]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [isPinCode, setPinCode] = useState("");
    const [isPassError, setPassError] = useState(0);
    const [isFaceID, setFaceID] = useState(false);
    const [isPage, setPage] = useState("");
    async function authenticate() {
        const hasPassword = await LocalAuthentication.isEnrolledAsync();
        if (!hasPassword) return;

        const { success, error } = await LocalAuthentication.authenticateAsync();

        if (success) {
            _beforeNext()
        } else {
            // MessageBox.Alert("เข้าสู่ระบบไม่สำเร็จ!");
        }
        // Platform.OS === "android" && setIsModalVisible(false);
    };
    useFocusEffect(
        React.useCallback(() => {
            const __setPinCode = async () => {
                // let pinLnwM = (await AsyncStorage.getItem("pinCode")) || "";
                reset();
                let faceID = (await AsyncStorage.getItem("faceID")) || "";
                let pinLnwM = "";
                if (!global.resetPin) {
                    pinLnwM = (await AsyncStorage.getItem("pinCode")) || "";
                }
                console.log("pinCode", pinLnwM);
                setPinCode(pinLnwM);
                setFaceID(faceID == "Y" ? true : false);
                setPage(page)
                let theme = global.theme
                await AsyncStorage.setItem("theme", JSON.stringify(theme));
                // faceID == "Y" ? authenticate() : null;
                // $xt.isEmpty(pinLnwM) ? reset() : null
                await AsyncStorage.setItem("fromAuth", "N");
                if (faceID == "Y" && !global.resetPin) {
                    authenticate();
                }
                setLoading(false);
            };
            __setPinCode();
            // authenticate()
        }, [route])
    );
    const _beforeNext = async () => {
        // console.log("before login");
        let username = await SecureStore.getItemAsync("username");
        let password = await SecureStore.getItemAsync("password");
        let maincode = (await AsyncStorage.getItem("maincode")) || "";
        console.log(maincode, username, password);
        // setLoading(true);
        try {
            setLoading(true);
            let request_otp = "N"
            var rsp = await apiAuth.login(maincode, username, password, request_otp);
        } catch (ex) {
            await $xt.sleep(200);
            MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
        } finally {
            setLoading(false);
        }
        if (!rsp.success) {
            let msg = await MessageBox.Alert(`Error`, rsp.error);
            msg ? reset() : null;
        } else {
            await AsyncStorage.setItem("mango_auth", rsp.data);
            await AsyncStorage.setItem("pincode_menu", "Y");
            AsyncStorage.removeItem("putList");
            global.resetPin = false;
            await AsyncStorage.setItem("fromAuth", "Y");
            navigation.reset({
                index: 1,
                routes: [{ name: global.home_page }],
            });
        }

    };
    const reset = () => {
        console.log("reset");
        setPutList([null, null, null, null, null, null]);
        setCount(0);
    };
    const fill = async (number) => {
        console.log("isPinCode", isPinCode);
        putList[count] = number;
        setPutList([...putList]);
        setCount(count + 1);
        let data = $linq(putList)
            .where((x) => x == null)
            .toArray();
        if (putList.filter((put) => put != null).length === 6) {
            // console.log("pinCode_putList :", putList.join(""));
            if ($xt.isEmpty(isPinCode)) {
                let msg = await MessageBox.Alert("แจ้งเตือน", "กรุณายืนยันอีกครั้ง");
                if (msg) {
                    setPinCode(putList.join(""))
                    // console.log(".....pincode");
                    reset();
                }
            } else if (putList.join("") === isPinCode) {
                await AsyncStorage.setItem("pinCode", putList.join(""));
                _beforeNext()
            } else if (putList != isPinCode) {
                let lnwM = await MessageBox.Alert(
                    `แจ้งเตือน`,
                    "PIN Code ของคุณไม่ถูกต้อง"
                );
                if (lnwM) {
                    console.log("isPassError", isPassError + 1);
                    let __passerror = isPassError + 1;
                    setPassError(isPassError + 1);
                    if (__passerror == 5) {
                        await AsyncStorage.setItem("pinCode", "");
                        navigation.navigate("Login");
                    }
                    reset();
                }
            }
            // reset();
        }
    };
    const __onDelete = async () => {
        let _pin = $linq(putList).where(x => x != null).count() - 1;
        if (_pin >= 0) {
            console.log("putList", _pin);
            let newPutList = [...putList]
            newPutList[_pin] = null
            setPutList(newPutList);
            setCount(_pin);
        }
    };
    const _forgotPass = async () => {
        console.log("_forgotPass");
        setPinCode("")
        await AsyncStorage.setItem("pinCode", "");
    }
    return (
        <>
            {loading ? <LoaddingLayout /> : null}
            <StatusBar barStyle={'dark-content'} />
            <ScrollView style={{ flex: 1 }}>
                {/* <Image
                style={[styles.stretch, { position: 'absolute' }]}
                ImageCacheEnum={'force-cache'}
                source={require('../../assets/images/passcode_bg.jpg')}
            /> */}
                <View style={[styles.containerCenter]}>
                    <Image source={BannerImage} style={styles.banner} />
                    <View style={{}}>
                        {$xt.isEmpty(isPinCode) ? (
                            <Text
                                style={{ fontSize: 16, fontWeight: '600', paddingVertical: 5 }} >
                                กรุณาตั้งรหัสผ่าน
                            </Text>
                        ) : (
                            <Text
                                style={{ fontSize: 18, fontWeight: '600', paddingVertical: 5 }} >
                                กรุณาใส่รหัสผ่าน
                            </Text>
                        )}
                    </View>
                    <View style={styles.putListContainer}>
                        {putList.map((put, idx) => (
                            <View
                                key={idx}
                                style={[styles.putCode, put == null ? null : styles.fill]}
                            />
                        ))}
                    </View>
                    <View style={styles.pinContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(1)}>
                                <Text style={styles.pinBoxText}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(2)}>
                                <Text style={styles.pinBoxText}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(3)}>
                                <Text style={styles.pinBoxText}>3</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(4)}>
                                <Text style={styles.pinBoxText}>4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(5)}>
                                <Text style={styles.pinBoxText}>5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(6)}>
                                <Text style={styles.pinBoxText}>6</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(7)}>
                                <Text style={styles.pinBoxText}>7</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(8)}>
                                <Text style={styles.pinBoxText}>8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(9)}>
                                <Text style={styles.pinBoxText}>9</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {isFaceID && $xt.isEmpty(isPage) ? (
                                <TouchableOpacity
                                    style={styles.faceId}
                                    disabled={count == 6 ? true : false}
                                    onPress={() => authenticate()}
                                >
                                    <MaterialCommunityIcons
                                        name="face-recognition"
                                        size={windowWidth > widthScreen ? 60 : 30}
                                        color={"#000"}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.faceId}></TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.pinBox}
                                disabled={count == 6 ? true : false}
                                onPress={() => fill(0)}>
                                <Text style={styles.pinBoxText}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pinDelete}
                                disabled={count == 6 ? true : false}
                                onPress={() => __onDelete()}
                            >
                                <Feather name="delete" size={windowWidth > widthScreen ? 60 : 30} color={"#000"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* <TouchableOpacity
                onPress={() => _forgotPass()}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.h3, { color: "#38B34A", marginTop: 10, textDecorationLine: 'underline' }]}>ลืมรหัสผ่าน</Text>
            </TouchableOpacity> */}
                {!isReset && !isSetting && <Ripple
                    rippleColor="#76ff03"
                    rippleOpacity={0.87}
                    rippleDuration={1000}
                    style={[styles.button, {
                        width: '70%', marginLeft: '15%', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: "#fff", borderWidth: 1, borderColor: '#38B34A', shadowOpacity: 0
                    }]}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={[styles.h5_bold, { color: '#38B34A' }]}>กลับสู่หน้าล็อกอิน</Text>
                </Ripple>}
            </ScrollView>
        </>
        // <OverLayout navigation={navigation} props={

    );
}
