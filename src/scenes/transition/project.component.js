import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    Keyboard,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    Platform,
    Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { reFormatPicture } from "../../api/bind_api";
import { apiAuth } from "../../api/authentication";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import { CheckViewPPN } from "../../components/variousRights";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { err } from "react-native-svg";
import moment from "moment";
import { isLoading } from "expo-font";
import $xt from "../../api/xtools";
import { useTheme } from "../../components/themeProvider";
export default function ProjectScreen({ route, navigation }) {
    // const theme = useTheme();
    const $linq = (arr) => new linq(arr);
    const [lang, setLang] = useState({});
    const [dataServer, setDataServer] = useState(null);
    const [dataArr, setDataArr] = useState([]);
    const [searchValue, setSeachValue] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const [dataloadding, setDataloadding] = useState(true);
    const [dataemty, setDataemty] = useState(false);

    const [decimal, setDecimal] = useState(2);
    const [usertype, setUsertype] = useState("");
    const [isViewPPN, setViewPPN] = useState("");
    const [isDataNoti, setDataNoti] = useState([]);
    const [isCountNoti, setCountNoti] = useState("");
    const [loadfile, setLoadfile] = useState(false);
    const [themes, setthemes] = useState("");
    const [isAuth, setAuth] = useState("");
    const [alertDateType, setAlertDateType] = useState({
        start: 0,
        end: 0,
        deadline: 0
    });
    const { width, height } = Dimensions.get('window');
    const [isShowMenu, setShowMenu] = useState(false);
    const { themeObject } = useTheme();
    const [isLoading, setLoading] = useState(true);

    // const [isRefresh, setRefresh] = React.useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: themeObject.colors.background },
            headerTintColor: themeObject.colors.text,
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight()
        });
    }, [route, isCountNoti, loadfile, isShowMenu, themeObject]);
    const headerLeft = () => {
        let _dataStore = global?.DataStore?.store?.length || 0
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => setShowMenu(!isShowMenu)}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", zIndex: 20 }}>
                    <AntDesign name="appstore1" size={18} color={themeObject.colors.text} />
                </TouchableOpacity>
            </View>
        )
    }
    const headerRight = () => {
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate("ProjectSearch")}
                >
                    <FontAwesome name="search" size={18} color={themeObject.colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onRefresh()}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="refresh" size={18} color={themeObject.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => goNextNoti()}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={22} color={themeObject.colors.text} />
                    {isCountNoti > 0 && (
                        <View
                            style={{
                                width: width * 0.05,
                                height: height * 0.025,
                                position: "absolute",
                                backgroundColor: colors.red_t,
                                right: 0.5, // ปรับเป็นตัวเลขที่เหมาะสม
                                top: -10, // ปรับเป็นตัวเลขที่เหมาะสม
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {loadfile ? (
                                <ActivityIndicator size={12} color={"#fff"} />
                            ) : (
                                <Text style={[styles.h5_bold, { color: colors.white, fontSize: 12 }]}>
                                    {isCountNoti > 99 ? "99+" : isCountNoti}
                                </Text>
                            )}
                        </View>
                    )}

                </TouchableOpacity >
            </View >
        )
    }
    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            onloadConfig();
            onloadproject();
            onReadNotification();
            onLoadAuth();
            setLoading(false);
        }, [])
    );

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

    };
    const onloadConfig = async () => { //
        var data = [];
        try {
            let res = await xt.getServer("Planning/Plan/ppn_config");
            console.log("res onloadConfig", res);
            data = res.config;
            let decimalArr = data.filter(function (v) {
                return v.code == "PPN_DECIMAL" && v.active == "Y";
            });
            if (decimalArr.length == 0) {
                setDecimal(2);
            } else {
                let decimal_ = parseInt(decimalArr[0].value_data) || 2;
                setDecimal(decimal_);

            }
            global.decimal = decimal;
            // set date alert
            setAlertDateType({
                start: $linq(res.data).where(x => x.alertcode == "AT003").select(x => x.alertdate).firstOrDefault() || 0,
                end: $linq(res.data).where(x => x.alertcode == "AT001").select(x => x.alertdate).firstOrDefault() || 0,
                deadline: $linq(res.data).where(x => x.alertcode == "AT002").select(x => x.alertdate).firstOrDefault() || 0
            });
        } catch (err) {
            setDecimal(2);
        };

    };
    const onloadproject = async () => {

        const server = await getDataStorage("sitevalue_key");

        if (!server) {
            console.log("No dataServer available");
            setDataloadding(false);
            return;
        }
        setDataServer(server);

        var Projectfilter_ = (await getDataStorage("Projectfilter")) || "Y";
        var usertype_ = await getDataStorage("usertype");
        console.log("usertype_ project: ", usertype_);
        setUsertype(usertype_)
        console.log("Projectfilter_", Projectfilter_);

        if (Projectfilter_ == "N") {
            setDataemty(false);
            setDataloadding(false);
            setDataStorage("Projectfilter", "Y");
        } else {

            setDataemty(true);
            setDataArr([]);
            setDataloadding(true);
        }

        var searchValue_ = (await getDataStorage("ProjectsearchValue")) || "";
        var dataServer = await getDataStorage("sitevalue_key");
        setDataServer(dataServer);

        var data = [];

        try {
            if (usertype_ == "Employee") {
                console.log("usertype_ Employee123131: ");

                let viewPPN = await CheckViewPPN();
                console.log("viewPPN: ", viewPPN);
                console.log("fromAuth Project Page: ", await AsyncStorage.getItem("fromAuth"));


                if (viewPPN == "Y") { // เปิด view ppn
                    let res = await xt.getServer("/Planning/Planning/Planning_project_web")
                    console.log("res: ", res);
                    data = res.data || [];

                } else if (viewPPN == "N") { // ปิด view ppn
                    let res = await xt.getServer("Planning/Plan/app_project_list");
                    console.log("res noview ppn: ", res);
                    data = res.plan_auth || [];


                }
                console.log("datadata: ", data);
                console.log("ขนาด: ", data.length);
                setViewPPN(viewPPN)
            } else if (usertype_ == "Outsource") {
                let res = await xt.getServer("Planning/Plan/app_project_list");
                console.log("res noview ppn: ", res);
                data = res.plan_auth || [];
            }
        } catch (error) {
            if (err?.response?.status == 404) {
                let res = await xt.getServer('Planning/Planning/Planning_project');
                data = res.data || [];
            }
        }



        data.forEach((v, i) => {
            v.startdate = moment(v.j_start || v.startdate).format("DD/MM/YYYY");
            v.enddate = moment(v.j_end || v.enddate).format("DD/MM/YYYY");
            v.pathpic = v.pathpic || v.pm || null; // ตรวจสอบว่ามีค่า
            v.project_img = v.project_img || null;
            v.pre_des = v.pre_des || v.project || null;
            v.progress_per = v.progress_per;
        });
        for (let xx in data) {
            let x = data[xx];
            try {
                // console.log("Processing image for:", x.pre_des);
                // console.log("Current dataServer:", server);

                if (x.pathpic) {
                    const pathpicUrl = server + "api/file/download/?download=false&id=" + x.pathpic;
                    // console.log("PathPic URL:", pathpicUrl);
                    x.pathpic = pathpicUrl;
                }

                if (x.project_img) {
                    const projectImgUrl = server + "api/file/download/?download=false&id=" + x.project_img;
                    // console.log("ProjectImg URL:", projectImgUrl);
                    x.project_img = projectImgUrl;
                }

            } catch (ex) {
                console.error("Error processing images:", ex);
                MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
            }
        }
        console.log("data", data);
        onFilter(data, searchValue_);
    };
    const onFilter = async (data_, searchValue_) => {
        setSeachValue(searchValue_);
        if (searchValue_) {
            const filterdata = data_.filter(function filter(c) {
                return (
                    searchValue_ === "" ||
                    c.pre_des.toLowerCase().startsWith(searchValue_.toLowerCase())
                );
            });

            if (filterdata.length != 0) {
                setDataArr(filterdata);
                setDataemty(false);
            } else {
                //ไม่พบข้อมูลที่ค้นหา
                setDataArr(data_);
                setDataemty(false);
                setDataStorage("ProjectsearchValue", "");
                Alert.alert(
                    'ไม่พบข้อมูลที่ค้นหา',
                    'ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง',
                    [{ text: 'ตกลง' }]
                );

            }

        } else {
            setDataArr(data_);
            if (data_.length != 0) {
                setDataemty(false);
            } else {
                setDataemty(true);
            }
        }
        setDataloadding(false);
    };
    // const onReadNotification = async () => {
    //     console.log("Start onReadNotification");
    //     setLoadfile(true);
    //     console.log("setLoadfile(true)");

    //     try {
    //         let res2 = await xt.showAllNoti();
    //         console.log(res2, "allNotiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    //         let cleanData = $linq(res2)
    //             .where(x => x.read_timestamp == null || x.count_d > 0 || x.count_e > 0 || x.count_s > 0)
    //             .toArray();
    //         console.log(cleanData, "Filtered Notifications");
    //         setCountNoti(cleanData.length);
    //         setDataNoti(cleanData);
    //         setLoadfile(false);
    //     } catch (error) {
    //         console.log("Error in onReadNotification:", error);
    //     }
    // };
    const onReadNotification = async () => {
        console.log("📩 Start onReadNotification");
        setLoadfile(true);
      
        try {
          const res = await xt.showAllNoti();
          console.log("🔔 All Notifications:", res);
      
          const cleanData = $linq(res)
            .where(x => x.read_timestamp == null || x.count_d > 0 || x.count_e > 0 || x.count_s > 0)
            .toArray();
      
          console.log("✅ Filtered Notifications:", cleanData);
      
          setCountNoti(cleanData.length);
          setDataNoti(cleanData);
        } catch (error) {
          console.error("❌ Error in onReadNotification:", error);
        } finally {
          setLoadfile(false);
          console.log("📴 setLoadfile(false)");
        }
      };
      

    const onLoadAuth = async () => {
        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        console.log("auth: ", auth);
        setAuth(auth)
    }
    const onRefresh = async () => {
        setDataStorage("ProjectsearchValue", "");
        setDataStorage("Projectfilter", "Y");
        onloadproject();
        onReadNotification();
    };
    const ongetimg = ({ download, file }) => {
        if (file) {
            const imgUrl =
                dataServer + "api/file/download/?download=" + download + "&id=" + file;
            // console.log("Image URL:", imgUrl);
            return imgUrl;
        } else {
            // console.log("Default image used");
            return null;
        }
    };

    // const ongetimgProject = ({ download, file }) => {
    //     if (file) {
    //         var ing =
    //             dataServer + "api/file/download/?download=" + download + "&id=" + file;
    //         return { uri: ing };
    //     } else {
    //         return null;
    //     }
    // };

    const ongetimgProject = ({ download, file }) => {
        if (file) {
            const imgUrl = dataServer + "api/file/download/?download=" + download + "&id=" + file;
            return { uri: imgUrl };
        }
        return null;
    };

    const onProfile = () => {
        setShowMenu(false);
        navigation.navigate("Profile");
    }

    const onSetting = () => {
        setShowMenu(false);
        setDataStorage("ProjectsearchValue", "");
        navigation.navigate("Setting", {
            site: dataServer,
        });
    };

    const onLogoutConfirm = async () => {
        setShowMenu(false);
        setDataStorage("ProjectsearchValue", "");

        let rs = await xt.getServer("api/public/logout?all=false&is_api=N");

        if (rs.success) {
            try {
                if (usertype === "Employee") {
                    let url = `Ext_API/Approve/set_tokenpush?maincode=${isAuth.maincode}&empno=${isAuth.empno}&session_id=${isAuth.session_id}&token_push=${""}`;
                    await xt.getServer(url);
                }

                await setDataStorage("token_key", "");
                await setDataStorage("login_UP", "Y");
                await setDataStorage("faceid_UP", "Y");
                await AsyncStorage.setItem("fromAuth", "N");

                let pincode_key = await getDataStorage("pincode_ppn");
                let pincodeval_key = await getDataStorage("pincodeval_ppn") || "";

                if (pincode_key === "true" && pincodeval_key !== "") {
                    navigation.navigate("PinCode");
                } else {
                    navigation.navigate("Login");
                }

            } catch (error) {
                console.log("Logout error:", error);
                Alert.alert(
                    'แจ้งเตือน',
                    'เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่อีกครั้ง'
                );
            }
        }
    };

    const onLogout = () => {
        Alert.alert(
            'ออกจากระบบ',
            'ยืนยันการออกจากระบบ',
            [
                {
                    text: 'ยกเลิก',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'ยืนยัน',
                    onPress: () => onLogoutConfirm()
                }
            ]
        );
    };


    const goNextNoti = () => {
        let newDoc = [...isDataNoti]
        console.log("LINE 612 :newDoc: ", newDoc, "<======================================================================================================");
        setDataStorage("ProjectsearchValue", "");
        navigation.navigate("Notification", {
            docList: newDoc,
            skill: "Normal",
            owner_id: newDoc[0]?.owner_id || "",
            owner_id_outsource: newDoc[0]?.owner_id_outsource || "",
            site: dataServer,
            alertDateType: alertDateType,
            themes: themes
            // viewppn: isViewPPN
            // skill: (item.IsOwner == "Y") ? "Normal" : "JustWatch"
        })
    }


    const beforeNextImage = (item) => {
        setDataStorage('searchTime', "");
        setDataStorage("plansearchValue", "");
        setDataStorage("statusValue", "inprogress,notstart,delay,overdue");
        setDataStorage("ProjectsearchValue", "");
        navigation.navigate("Plans", {
            site: dataServer,
            pre_event2: item.pre_event2,
            pre_event: item.pre_event,
            pre_des: item.pre_des,
            decimal: decimal,
        });
    };
    const renderMenu = () => {
        return isShowMenu && (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isShowMenu}
                onRequestClose={() => setShowMenu(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}>
                        <View
                            style={{
                                width: width * 0.4,
                                height: height * 0.2,
                                top: Platform.OS == 'ios' ? height * 0.10 : height * 0.05,
                                left: width * 0.06,
                                borderWidth: 1,
                                borderColor: colors.image_light,
                                borderRadius: 10,
                                backgroundColor: colors.white,
                                position: "absolute",
                            }}
                        >
                            <TouchableOpacity onPress={() => onProfile()}
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="person-sharp" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.profile}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="notifications-sharp" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.notification}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onSetting()}
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="settings" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.setting_system}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onLogout()}
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5 }}>
                                <Ionicons name="power" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.logout}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    };

    const renderItem = ({ item, index }) => {
        return (
            <>
                <View style={[styles.blockcard, { backgroundColor: themeObject.colors.font_dark }]}>
                    {/* Header */}
                    <View style={{ width: '100%', height: 250, }}>
                        <TouchableOpacity style={[styles.blockcard, { flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: themeObject.colors.back_dark }]}
                            onPress={() => beforeNextImage(item)}>
                            {!$xt.isEmpty(item.project_img) ?
                                (
                                    <Image
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 6,

                                        }}
                                        resizeMode="cover"
                                        // source={ongetimgProject(false, item.project_img)}
                                        source={{ uri: item.project_img }}
                                    />
                                )
                                :
                                (
                                    <Text style={[styles.h3, { color: '#8d99b2', }]}>no image avaliable</Text>

                                )}

                        </TouchableOpacity>
                        <View style={[styles.blockcard, { flex: 1, backgroundColor: themeObject.colors.font_dark }]}>
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: themeObject.colors.font_dark }}>
                                <View style={{ flex: 3 }} >
                                    <Text style={[styles.h5_14, { fontSize: 12, color: themeObject.colors.text }]} numberOfLines={1} > {item.pre_des}</Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: themeObject.colors.font_dark }}>
                                    <View style={{ alignItems: 'flex-end', paddingEnd: 15 }}>
                                        <Feather name="paperclip" size={20} color="#8d99b2" />
                                    </View>
                                </View>
                            </View>

                            {/* Body */}
                            <View style={{ flex: 2, flexDirection: 'row', backgroundColor: themeObject.colors.font_dark }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 30, height: 30, borderWidth: 1, borderColor: colors.greentree, borderRadius: 30, }}>
                                        <Image
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 90,
                                            }}
                                            resizeMode="cover"
                                            // source={{ uri: ongetimg(false, item.pathpic)}}
                                            source={
                                                !$xt.isEmpty(item.pathpic)
                                                    ? { uri: item.pathpic } // ลิงก์ภาพ
                                                    : require("../../../assets/images/user.png") // fallback ภาพ default
                                            }
                                        ></Image>
                                    </View>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themeObject.colors.text }]}>PM : {item.empfullname_t || lang.overlayNoRows}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themeObject.colors.text }]}>{lang.start_date}</Text>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themeObject.colors.text }]}>{item.startdate}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themeObject.colors.text }]}>{lang.emd_date}</Text>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themeObject.colors.text }]}>{item.enddate}</Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                </View >
            </>
        );
    };
    return (
        <>
            {renderMenu()}
            < View style={{ flex: 1, backgroundColor: themeObject.colors.background, padding: 10 }} >
                {dataemty == false ? (
                    <FlatList
                        data={dataArr}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        // ListHeaderComponent={renderHeader()}
                        // showsVerticalScrollIndicator={false}
                        initialNumToRender={10} // Reduce initial render amount
                        maxToRenderPerBatch={5} // Reduce number in each render batch
                        windowSize={3} // Reduce the window size
                    />
                ) : (
                    <>
                        {dataloadding == false ? (
                            <NoRows />
                        ) : (
                            <LoadingRows />
                        )}
                    </>
                )}

            </View>
        </>
    );
}

