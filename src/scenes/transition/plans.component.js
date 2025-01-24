import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    Keyboard,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    ListRenderItemInfo,
    ScrollView,
    ViewProps,

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

export default function PlansScreen({ route, navigation }) {
    // const abortController = new AbortController();
    // const signal = abortController.signal

    //console.log("navigation",route,navigation);
    const $linq = arr => new linq(arr);
    // const theme = useTheme();
    const [lang, setLang] = useState({});
    const [dataServer, setDataServer] = useState(route.params.site);
    const [dataArr, setDataArr] = useState([]);
    const [searchValue, setSeachValue] = useState(null);
    const [searchTime, setSeachTime] = useState(null);
    const [statusValue, setStatusValue] = useState([]);

    const [dataloadding, setDataloadding] = useState(true);
    const [dataemty, setDataemty] = useState(false);
    const [usertype, setUsertype] = useState("");
    const [isViewPPN, setViewPPN] = useState("");
    const [themes, setthemes] = useState("")
    const [isAbort, setAbort] = useState(false);
    const [updateTime, setUpdateTime] = useState(0);
    const [loadfile, setLoadfile] = useState(false);

    // console.log("route.params", route.params);
    const { width, height } = Dimensions.get('window');


    // const [isRefresh, setRefresh] = React.useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            // headerShown: global.startTutorial,
            headerLeft: () => headerLeft(),
            // headerRight: () => <HeaderRight navigation={navigation} showIcon={true} showWarehouse={true} docList={getdocList} />,
            headerRight: () => headerRight()
        });
    }, [route, loadfile]);
    const headerLeft = () => {
        let _dataStore = global?.DataStore?.store?.length || 0
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", }}
                    onPress={() => goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={themes == 'light' ? colors.black : colors.white} />
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
            </View >
        )
    }
    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            // onloadConfig();
            onloadproject();
            onReadNotification();
            // onLoadAuth();

        }, [])
    );

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

    };
    const goBack = () => {
        navigation.navigate('Project');
    };
    // const onloadConfig = async () => { //
    //     var data = [];
    //     try {
    //         let res = await xt.getServer("Planning/Plan/ppn_config");
    //         console.log("res onloadConfig", res);
    //         data = res.config;
    //         let decimalArr = data.filter(function (v) {
    //             return v.code == "PPN_DECIMAL" && v.active == "Y";
    //         });
    //         if (decimalArr.length == 0) {
    //             setDecimal(2);
    //         } else {
    //             let decimal_ = parseInt(decimalArr[0].value_data) || 2;
    //             setDecimal(decimal_);

    //         }
    //         global.decimal = decimal;
    //         // set date alert
    //         setAlertDateType({
    //             start: $linq(res.data).where(x => x.alertcode == "AT003").select(x => x.alertdate).firstOrDefault() || 0,
    //             end: $linq(res.data).where(x => x.alertcode == "AT001").select(x => x.alertdate).firstOrDefault() || 0,
    //             deadline: $linq(res.data).where(x => x.alertcode == "AT002").select(x => x.alertdate).firstOrDefault() || 0
    //         });
    //     } catch (err) {
    //         setDecimal(2);
    //     };

    // };
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
    // const onLoadAuth = async () => {
    //     let server_data = (await apiAuth.getAuth()).data;
    //     let auth = server_data.auth;
    //     console.log("auth: ", auth);
    //     setAuth(auth)
    // }
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
                <View style={[styles.blockcard, { flex: 1, top: '5%', width: '100%', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }]}>
                    {/* Body */}
                    <View style={{ flex: 2, flexDirection: 'row', }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.h4, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Plan name : </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingEnd: 20 }}>
                            <Text style={[styles.h5_bold, { backgroundColor: colors.red, width: 100, height: 20, borderRadius: 5, marginLeft: 5, fontSize: 12, textAlign: 'center', color: themes == 'light' ? colors.black : colors.white }]}>Overdue</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PL :</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PG :</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flex: 6, flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                        <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 30, height: 30, backgroundColor: 'lime', borderRadius: 30, }}>
                            </View>
                        </View>
                        <View style={{ flex: 5, flexDirection: 'row', }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 4, alignItems: 'center' }}>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.start_date}</Text>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.startdate}</Text>
                                </View>
                                <View style={{ flex: 4, alignItems: 'center' }}>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.emd_date}</Text>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.enddate}</Text>
                                </View>
                                <View style={{ flex: 2, alignItems: 'center' }}>
                                    <Feather name="paperclip" size={20} color="#8d99b2" />
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
                <>
                    {/* Status */}
                    <View style={{ flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.back_dark }}>
                        <Text style={[styles.h5_bold, { marginLeft: 5, fontSize: 16, color: themes == 'light' ? colors.black : colors.white }]}>Status :</Text>
                        <View style={{ flexDirection: 'row', width: width * 2 }}>
                            <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>In progress </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Not Start </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Delay </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Overdue </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ top: '1%' }}>
                        <FlatList
                            data={dataArr}
                            renderItem={renderItem}
                            initialNumToRender={10}
                            maxToRenderPerBatch={5}
                            windowSize={10}
                        />
                    </View>
                </>
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

