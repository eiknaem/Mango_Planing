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
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { apiAuth } from "../../api/authentication";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import { CheckViewPPN } from "../../components/variousRights";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { err } from "react-native-svg";
import moment from "moment";
import { isLoading } from "expo-font";

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



    // const [isRefresh, setRefresh] = React.useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            // headerShown: global.startTutorial,
            headerLeft: () => headerLeft(),
            // headerRight: () => <HeaderRight navigation={navigation} showIcon={true} showWarehouse={true} docList={getdocList} />,
            headerRight: () => headerRight()
        });
    }, [route, isCountNoti]);
    const headerLeft = () => {
        let _dataStore = global?.DataStore?.store?.length || 0
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", }}>
                    <AntDesign name="appstore1" size={18} color={themes == 'light' ? colors.black : colors.white} />
                </TouchableOpacity>
            </View>
        )
    }
    const headerRight = () => {
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="search" size={18} color={themes == 'light' ? colors.black : colors.white} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onRefresh()}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="refresh" size={18} color={themes == 'light' ? colors.black : colors.white} />
                </TouchableOpacity>

                <Text style={{ color: '#fff' }}>{loadfile ? "true" : "false"}</Text>
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={22} color={themes == 'light' ? colors.black : colors.white} />
                    {isCountNoti > 0 && (
                        <View style={{ width: width * 0.05, height: height * 0.025, position: "absolute", backgroundColor: colors.red_t, right: width * -0.001, top: "-30%", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            {loadfile
                                ? <ActivityIndicator size={12} color={"#fff"} />
                                : (<Text style={[styles.h5_bold, { color: colors.white, fontSize: 12, marginLeft: 3 }]}>{isCountNoti > 99 ? "99+" : isCountNoti} </Text>)}
                            {/* <ActivityIndicator size={12} color={"#fff"} /> */}
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
            v.pathpic = v.pathpic || v.pm || null;
            v.project_img = v.project_img || null;
            v.pre_des = v.pre_des || v.project || null;
            v.progress_per = v.progress_per;
        });
        console.log("data", data);
        onFilter(data, searchValue_);
    };
    const onFilter = async (data_, searchValue_) => {
        setSeachValue(searchValue_);
        if (searchValue_) {
            const filterdata = data_.filter(function filter(c) {
                return (
                    searchValue_ === "" ||
                    c.pre_des.toLowerCase().includes(searchValue_.toLowerCase())
                );
            });

            if (filterdata.length != 0) {
                setDataemty(false);
            } else {
                setDataemty(true);
            }
            setDataArr(filterdata);
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
    const onReadNotification = async () => {
        try {
            setLoadfile(true)
            // let res2 = await xt.getServer(`Planning/Planning/Planning_Noti_showAll`);
            let res2 = await xt.showAllNoti();
            console.log(res2, "allNotiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            // console.log(res2.length, "count");
            let cleanData = $linq(res2).where(x => x.read_timestamp == null || x.count_d > 0 || x.count_e > 0 || x.count_s > 0).toArray();
            console.log(cleanData, "res noti:==============================================================:==============================================================:============================================================== ");

            setCountNoti(cleanData.length); // CountNoti
            setDataNoti(cleanData); // ShowAllNoti
console.log("set");

        } catch (error) {
            console.log("catch noti: ", error);
            setLoadfile(false)
        } finally {
            setLoadfile(false)

        }

    }
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
    const renderItem = ({ item, index }) => {
        console.log("item", item);
        return (
            <>
                <View style={[styles.blockcard, { backgroundColor: themes == 'light' ? colors.white : colors.font_dark }]}>
                    {/* Header */}
                    <View style={{ width: '100%', height: 250, }}>
                        <View style={[styles.blockcard, { flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: themes == 'light' ? colors.white : colors.back_dark }]}>
                            <Text style={[styles.h3_bold, { color: '#8d99b2', }]}>no image avaliable</Text>
                        </View>
                        <View style={[styles.blockcard, { flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.font_dark }]}>
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                                <View style={{ flex: 3 }} >
                                    <Text style={[styles.h5_14, { fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]} numberOfLines={1} > {item.pre_des}</Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                                    <View style={{ alignItems: 'flex-end', paddingEnd: 15 }}>
                                        <Feather name="paperclip" size={20} color="#8d99b2" />
                                    </View>
                                </View>
                            </View>

                            {/* Body */}
                            <View style={{ flex: 2, flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 30, height: 30, backgroundColor: 'lime', borderRadius: 30, }}>
                                    </View>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PM : {item.empfullname_t || lang.overlayNoRows}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.start_date}</Text>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.startdate}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.emd_date}</Text>
                                        <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.enddate}</Text>
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
        < View style={{ flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.back_bg, padding: 10 }} >
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
    );
}

