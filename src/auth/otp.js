import React, { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    View,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    StatusBar
} from "react-native";
import {
    Feather,
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { styles, colors } from "../stylesheet/styles";
import LoaddingLayout from "../template/loadding_layout";
import MessageBox from "../api/msg";
import $xt from "../api/xtools";
import { apiAuth, requestOTPMango } from "../api/authentication";
import OTPLogo from "../../assets/otp-img.png"
export default function OtpAuth({ navigation, route }) {
    const params = route?.params;
    // console.log("params", params);
    const authData = params?.authData
    // console.log("authData", authData);
    const [loading, setLoading] = useState(false);
    const [isReady, setReady] = useState(false);
    const [lineColor, setLineColor] = useState(false);
    const [infoPopup, setInfoPopup] = useState(false);
    const [isCheckOtp, setIsCheckOtp] = useState(false);
    const [sentAgain, setSentAgain] = useState(false);
    const [isOtp, setIsOtp] = useState("");
    const [countdown, setCountdown] = useState(180);
    const [isAuthData, setAuthData] = useState({});
    const [isPassError, setPassError] = useState(0);
    useEffect(() => {
        let interval = setInterval(() => {
            setCountdown(lastTimerCount => {
                if (lastTimerCount == 0) {
                    return 0
                    //your redirection to Quit screen
                } else {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                }
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true)
                    var rsp = await requestOTPMango(authData?.maincode, authData?.userid, authData?.email, authData?.signature);
                    console.log("rsp", rsp);
                } catch (ex) {
                    MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
                } finally {
                    setLoading(false)
                }
                if (rsp.error) {
                    MessageBox.Alert(`Error`, rsp.error);
                } else {
                    let newAuth = { ...authData }
                    newAuth.otp_ref = rsp.refc;
                    setAuthData(newAuth);
                    setReady(true)
                }
                // setReady(true)
            }
            fetchData();
        }, [route, sentAgain])
    );
    const changeHandler = (val) => {
        console.log("val", val);
        setIsOtp(val);
        setIsCheckOtp(false);
    };
    const clearText = () => {
        setIsOtp("");
        setIsCheckOtp(false);

    };
    const _beforeNext = async () => {
        try {
            let token_push = (await AsyncStorage.getItem("token_push")) || "";
            // var authData = {
            //     maincode: isAuthData.maincode,
            //     userid: isAuthData.userid,
            //     password: isAuthData.password,
            //     token_push: token_push,
            //     otp_ref: isAuthData.otp_ref,
            //     otp: isOtp,
            //     signature: isAuthData.signature
            // }
            // console.log("authData", authData);
            let request_otp = "Y"
            var rsp = await apiAuth.login(
                isAuthData.maincode,
                isAuthData.userid,
                isAuthData.password,
                request_otp,
                isAuthData.otp_ref,
                isOtp,
                isAuthData.signature
            );
        } catch (ex) {
            await $xt.sleep(200);
            MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
        } finally {
            setLoading(false);
        }
        console.log("resp", rsp);
        if (!rsp.success) {
            let lnwM = await MessageBox.Alert(`แจ้งเตือน`, "รหัส OTP ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง");
            if (lnwM) {
                console.log("isPassError", isPassError + 1);
                let __passerror = isPassError + 1;
                setPassError(isPassError + 1);
                if (__passerror == 5) {
                    navigation.reset({
                        index: 1,
                        routes: [{ name: "Login" }],
                    });
                }
                clearText();
            }
        } else {
            await AsyncStorage.setItem("mango_auth", rsp.data);
            // await AsyncStorage.setItem("authData", JSON.stringify(authData));
            setIsCheckOtp(true);
            AsyncStorage.removeItem("putList");
            navigation.reset({
                index: 1,
                routes: [{ name: global.home_page }],
            });
        }
    }
    const otpTime = () => {
        setSentAgain(!sentAgain)
        setCountdown(180);
        let interval = setInterval(() => {
            setCountdown(lastTimerCount => {
                if (lastTimerCount == 0) {
                    return 0
                    //your redirection to Quit screen
                } else {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                }
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)

    };
    return (
        <>
            {loading ? <LoaddingLayout /> : null}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <StatusBar barStyle={'dark-content'} />
                    <View style={{ flex: 0.8, flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}
                            style={{ flex: 1, justifyContent: "flex-end" }}>
                            <Feather name="chevron-left" size={30} color="#808080" style={{ marginLeft: 15 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setInfoPopup(true)}
                            style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", marginRight: 15 }}>
                            <MaterialCommunityIcons name="information-outline" size={24} color="#808080" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1.5, alignItems: "center" }}>
                        <Image source={OTPLogo} style={[styles.banner, { marginVertical: 0 }]} />

                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={[styles.otpFont, { fontSize: 24, lineHeight: 24, fontWeight: "900", paddingTop: 10 }]}>OTP Verification</Text>
                        <Text style={[styles.otpFont]}>เพื่อดำเนินการต่อ โปรดป้อนรหัสที่ถูกส่งใน E-mail </Text>
                        <Text style={[styles.otpFont, { color: "#808080" }]}>{authData?.email}</Text>
                    </View>
                    {isReady && <View style={{ flex: 2, justifyContent: "center", marginTop: -20 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            //   width: '100%',

                        }}>
                            <Text style={[styles.h4, {
                                paddingVertical: 0
                            }]}
                            >{isAuthData.otp_ref}-
                            </Text>
                            <TextInput
                                autoCorrect={false}
                                style={[styles.h4, {
                                    paddingVertical: 0,
                                    borderBottomWidth: 2,
                                    borderBottomColor: lineColor == false ? "#CCCCCC" : isCheckOtp ? "#FF3B34" : "#02D667",
                                    opacity: !isOtp ? 0.6 : 1,
                                    marginTop: isCheckOtp ? 20 : 0,
                                    width: 80
                                }]}
                                placeholder="XXXXXX"
                                placeholderTextColor="#929292"
                                onPressIn={() => setLineColor(true)}
                                onEndEditing={() => setLineColor(false)}
                                onChangeText={changeHandler}
                                keyboardType='numeric'
                                maxLength={6}
                                value={isOtp}
                            />
                            {isOtp ? <TouchableOpacity onPress={() => clearText()}
                                style={{
                                    position: "absolute",
                                    alignSelf: "flex-end",
                                    top: 3,
                                    right: 24
                                }} >
                                <AntDesign name="closecircle" size={24} color="#E6E6E6" />
                            </TouchableOpacity> : null}
                            {/* {isCheckOtp ? <Text style={[styles.otpFont, { textAlign: "center", color: "#FF3B34" }]}>รหัส OTP ผิดกรุณากรอกใหม่อีกครั้ง</Text> : null} */}

                        </View>
                    </View>}
                    {/* //ปุ่ม ตรวจสอบ */}
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                        <TouchableOpacity onPress={() => _beforeNext()} disabled={isOtp.length < 6}
                            style={{ width: "90%", height: 50, backgroundColor: "#13c16e", borderRadius: 15, alignSelf: "center", justifyContent: "center", opacity: isOtp.length < 6 ? 0.6 : 1 }}>
                            <Text style={[styles.h5_bold, { color: colors.white, fontSize: 14, fontWeight: "500", lineHeight: 21.17, alignSelf: "center" }]}>ตรวจสอบ</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", marginTop: 24 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[styles.otpFont]}>ไม่พบรหัส OTP ในอีเมล</Text>
                            <TouchableOpacity onPress={() => otpTime()} disabled={countdown == 0 ? false : true} >
                                <Text style={[styles.otpFont, { paddingLeft: 5, color: "#13c16e", opacity: countdown == 0 ? 1 : 0.5 }]}>ส่งรหัสอีกครั้ง </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 16, flexDirection: "row" }}>
                            <Text style={[styles.otpFont, { color: "#CCCCCC" }]}>รหัสผ่านจะหมดอายุใน</Text>
                            <Text style={[styles.otpFont, { color: "#CCCCCC", paddingLeft: 5 }]}>{countdown} วินาที</Text>

                        </View>
                    </View>
                    {infoPopup ?
                        <View style={{ flex: 1, position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: infoPopup ? 0 : 10 }}>
                            <View style={{ flex: 1, position: "absolute", backgroundColor: colors.black, opacity: 0.5, top: 0, left: 0, bottom: 0, right: 0 }}></View>
                            <View style={{
                                backgroundColor: colors.white,
                                top: '25%',
                                marginHorizontal: 15,
                                alignItems: "center",
                                justifyContent: 'center',
                                borderRadius: 30,
                                paddingVertical: 20
                            }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={[styles.h5_bold, { flex: 7, fontSize: 18, textAlign: "center", padding: 15 }]}>ข้อมูลเพิ่มเติม</Text>
                                    <TouchableOpacity onPress={() => setInfoPopup(false)}
                                        style={{ flex: 1 }}>
                                        <AntDesign name="close" size={24} color="#808080" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingTop: 12, paddingHorizontal: 18 }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ marginTop: 8 }}>
                                            <FontAwesome name="circle" size={5} color="#808080" />
                                        </View>
                                        <Text style={[styles.otpFont, { fontSize: 14, color: "#808080", paddingLeft: 10 }]}>
                                            เพื่อความปลอดภัยของระบบ{"\n"}จำเป็นต้องมีการตรวจสอบชั้นที่ 2 เพื่อยืนยันตัวตน
                                            โดยที่ระบบจะส่งข้อความพร้อมรหัสแบบใช้ครั้งเดียว
                                            ให้คุณผ่าน E-Mail ของคุณที่ลงทะเบียนไว้
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", paddingTop: 8 }}>
                                        <View style={{ marginTop: 8 }}>
                                            <FontAwesome name="circle" size={5} color="#808080" />
                                        </View>
                                        <Text style={[styles.otpFont, { fontSize: 14, color: "#808080", paddingLeft: 10 }]}>
                                            โปรดตรวจสอบในกล่องข้อความ{"\n"}
                                            บางกรณีอาจอยู่ในกล่องจดหมายขยะ
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", paddingTop: 8 }}>
                                        <View style={{ marginTop: 8 }}>
                                            <FontAwesome name="circle" size={5} color="#808080" />
                                        </View>
                                        <Text style={[styles.otpFont, { fontSize: 14, color: "#808080", paddingLeft: 10 }]}>
                                            หากพบปัญหากรุณาติดต่อผู้ดูแลระบบ
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View> : null}
                </View>
            </TouchableWithoutFeedback>
        </>

    );
}