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

} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { apiAuth } from "../../api/authentication";
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
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <Octicons name="apps" size={24} color="black" />
                </TouchableOpacity>
            </View>
        )
    }
    const headerRight = () => {
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="search" size={20} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="refresh" size={20} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                    {isCountNoti > 0 && (
                        <View style={{ width: width * 0.037, height: height * 0.02, position: "absolute", backgroundColor: colors.red_t, alignSelf: "flex-end", right: width * 0.001, top: "-20%", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.h5_bold, { color: colors.white, fontSize: width * 0.02 }]}>{isCountNoti > 99 ? "99+" : isCountNoti} </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
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
        console.log("Projectfilter_",Projectfilter_);

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

        } catch (err) {
            if (err?.response?.status == 404) {
                let res = await xt.getServer('Planning/Planning/Planning_project');
                data = res.data || [];
            }
        };


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


            setLoadfile(false)
        } catch (error) {
            console.log("catch noti: ", error);
            setLoadfile(false)
        }
    }
    const onLoadAuth = async () => {
        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        console.log("auth: ", auth);
        setAuth(auth)
    }
    const renderItem = ({ item, index }) => {
        console.log("item",item);
        return (
            <>
                <View style={[styles.blockcard, { backgroundColor: "red" }]}>

                </View>
            </>
        );
    };
    return (
        < View style={{ flex: 1 }}>
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
        </View>
    );
}
const styles_plan = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    headerTitle: {
        paddingHorizontal: 8,
    },
    headerDivider: {
        marginVertical: 8,
    },
    listContent: {
        padding: 8,
    },
    item: {
        marginVertical: 8,
    },
    itemHeader: {
        height: 170,
    },
    itemHeader_p: {
        height: 170,
    },
    itemTitle: {
        zIndex: 1,
        padding: 10,
        backgroundColor: "rgba(52, 52, 52, 0.5)",
    },
    itemDescriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
    },
    titleitem: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemRow: {
        flexDirection: "row"
    },
    itemtitle: {
        // marginTop: -10,
        // backgroundColor: "pink",
        padding: 5,
        color: "#ffffff",
        borderRadius: 9,
        paddingHorizontal: 10
    },
    itemDescription: {
        marginHorizontal: 16,
    },
    itemFooter: {
        flexDirection: "row",
        marginHorizontal: -8,
        marginTop: 5,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
    itemAuthoringContainer: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 5,
    },
    enddate: {
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    startdate: {
        marginRight: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    boxsort: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        margin: 2,
    },
    placeholderCard: {
        justifyContent: "center",
        alignItems: "center",
        height: 150,
        margin: 0,
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "background-basic-color-3",
    },
    complete: {
        marginRight: -10,
        padding: 1,
        backgroundColor: "#2fb344",
        borderRadius: 5,
        minWidth: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    notstart: {
        marginRight: -10,
        padding: 1,
        backgroundColor: "#a3a4a6",
        borderRadius: 5,
        minWidth: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    inprogress: {
        marginRight: -10,
        padding: 1,
        backgroundColor: "#4299e1",
        borderRadius: 5,
        minWidth: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    overdue: {
        marginRight: -10,
        padding: 1,
        backgroundColor: "#d63939",
        borderRadius: 5,
        minWidth: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    delay: {
        marginRight: -10,
        padding: 1,
        backgroundColor: "#f76707",
        borderRadius: 5,
        minWidth: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    complete_t: {
        color: "#2fb344",
    },
    notstart_t: {
        color: '#a3a4a6',
    },
    inprogress_t: {
        color: "#4299e1",
    },
    overdue_t: {
        color: '#d63939',
    },
    delay_t: {
        color: '#f76707',
    },
    statussort: {
        paddingTop: 10,
        height: 30,
        backgroundColor: "rgba(0, 0, 0, 0)",
    },
    statussort_x: {
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 3,
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 5,
        minWidth: 95,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    statussort_atv: {
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 3,
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 5,
        minWidth: 95,
        backgroundColor: "#2fb344",
        alignItems: "center",
        justifyContent: "center",
    },
    notiPPN: {
        backgroundColor: "red",
        borderRadius: 20,
        width: 30,
        height: 20,
        position: "absolute",
        alignItems: "center",
        top: -10,
        right: -5,
        zIndex: 99999,
        justifyContent: "center",
    },
    attacFile: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 20,
        width: 20,
        height: 11,
        position: "absolute",
        alignItems: "center",
        top: 15,
        right: -5,
        zIndex: 99999,
        justifyContent: "center",
    }
});
