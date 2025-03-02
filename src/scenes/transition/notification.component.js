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
    Alert,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import moment from 'moment';
import { CheckViewPPN } from "../../components/variousRights";
import { apiAuth } from "../../api/authentication";
import { UpdateProgress_UR } from "../../components/variousRights";
import { useTheme } from "../../components/themeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";




export default function NotificationScreen({ route, navigation }) {
    const Params = route.params;
    const [getDocList, setDocList] = useState(Params.docList);
    const [getDocListToday, setGetDocListToday] = useState(getDocList.filter(x => moment(x.create_date).format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")));
    const [getDocListYester, setGetDocListYester] = useState(getDocList.filter(x => moment(x.create_date).format("DD/MM/YYYY") != moment().format("DD/MM/YYYY")));
    const getSkill = Params.skill;
    const getOwner_id = Params.owner_id;
    const getOwner_id_outsource = Params.owner_id_outsource; ``
    const alertDateType = Params.alertDateType;
    // console.log("getOwner_id: ", getOwner_id);
    // console.log("getOwner_id_outsource: ", getOwner_id_outsource);
    const $linq = (arr) => new linq(arr);
    const [lang, setLang] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [isAuth, setAuth] = useState(false)
    const [themes, setthemes] = useState("");
    const [dataServer, setDataServer] = useState("");
    const [config, setConfig] = useState({});

    const [dataDocListSelect, setDataDocListSelect] = useState(getDocListToday.slice(0, 5));
    const [dataDocListSelectYester, setDataDocListSelectYester] = useState(getDocListYester.slice(0, 5));
    const [hideList, setHideList] = useState(true);
    const [hideListYester, setHideListYester] = useState(true);

    const [checkYesterday, setCheckYesterday] = useState(getDocList.every(x => moment(x.create_date).format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")));

    const { width, height } = Dimensions.get('window');
    const [isShowMenu, setShowMenu] = useState(false);
    const { themeObject } = useTheme();
    const [usertype, setUsertype] = useState("");



    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            onLoadAuth();
            onloadconfig();
        }, [])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: themeObject.colors.background },
            headerTintColor: themeObject.colors.text,
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight()
        });
    }, [menuVisible, themes, themeObject, isShowMenu]);

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
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: 'flex-end', alignItems: "center" }}>
                <TouchableOpacity
                    onPress={navigation.goBack}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={22} color={themeObject.colors.text} />
                </TouchableOpacity >
            </View >
        )
    }

    const onProfile = () => {
        setMenuVisible(false);
        navigation.navigate("Profile");
    };



    const onSetting = () => {
        setMenuVisible(false);
        navigation.navigate("Setting", {
            //   site: dataServer,
        });
    };


    const onAlertCheck = async () => {
        Alert.alert(
            "",
            lang.noti_alert_revise,
            [
                { text: lang.ok, onPress: () => true },
            ],
            { cancelable: false }
        );
    };


    const onLogoutConfirm = async () => {
        setShowMenu(false);
        setDataStorage("ProjectsearchValue", "");

        let rs = await xt.getServer("api/public/logout?all=false&is_api=N");

        if (rs.success) {
            try {
                if (usertype === "Employee") { // เช็คว่าเป็น Employee หรือไม่
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


    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

        let usertype_ = await getDataStorage("usertype");
        setUsertype(usertype_);
    };

    const onloadconfig = async () => {
        let url = "Anywhere/Management/ConfigReadList";
        let res = await xt.getServer(url);
        let data_ = res.data;
        let PPN_PG_RES = data_.filter(function (v) {
            return v.code == "PPN_PG_RES" && v.active == "Y" && v.value_data == "Y";
        }).length;
        let PPN_UPLOAD_CAMARA_ALLOW = data_.filter(function (v) {
            return v.code == "PPN_UPLOAD_CAMARA_ALLOW" && v.active == "Y";
        }).length;
        let PPN_UPLOAD_SELECT_ALLOW = data_.filter(function (v) {
            return v.code == "PPN_UPLOAD_SELECT_ALLOW" && v.active == "Y";
        }).length;
        let PPN_UPLOAD_VIDEO_ALLOW = data_.filter(function (v) {
            return v.code == "PPN_UPLOAD_VIDEO_ALLOW" && v.active == "Y";
        }).length;
        let conf = {
            PPN_PG_RES: PPN_PG_RES ? "Y" : "N",
            PPN_UPLOAD_CAMARA_ALLOW: PPN_UPLOAD_CAMARA_ALLOW ? "Y" : "N",
            PPN_UPLOAD_SELECT_ALLOW: PPN_UPLOAD_SELECT_ALLOW ? "Y" : "N",
            PPN_UPLOAD_VIDEO_ALLOW: PPN_UPLOAD_VIDEO_ALLOW ? "Y" : "N",
            PPN_UN_PGI_ALLOW:
                !PPN_UPLOAD_VIDEO_ALLOW &&
                    !PPN_UPLOAD_CAMARA_ALLOW &&
                    !PPN_UPLOAD_SELECT_ALLOW
                    ? "N"
                    : "Y",
        };
        // console.log("PPN_PG_RES", PPN_PG_RES, conf);
        setConfig(conf);
    };

    const onLoadAuth = async () => {
        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        console.log("auth: ", auth);
        setAuth(auth)
    }

    const beforeNext = async (item) => {
        console.log("item: ", item);
        let updateMsg = $linq(getDocList).where(o => o.taskid == item.taskid && o.read_type == item.read_type).toArray();
        console.log(" LINE 129 NOTI updateMSG: ============================================================================================================== ", updateMsg);
        let objSave = {
            id: item.taskid,
            plan_code: item.plan_code,
            pre_event: item.pre_event,
            pre_event2: item.pre_event2,
            owner: item.owner,

        }
        if (item.revise_status != "N") {
            await onAlertCheck();
            return;
        }

        if (item.read_type == "CF" || item.read_type == "CM") {
            await saveData(item.read_type, updateMsg, objSave);
        } else if (item.read_type == "CA" || item.read_type == "RA" || item.read_type == "PG") { // item.read_type == "AS" || item.read_type == "RM" || item.read_type == "PG"
            await saveData(item.read_type, updateMsg, objSave);
            navigation.navigate('Tasks', {
                site: dataServer,
                pre_event2: item.pre_event2,
                pre_event: item.pre_event,
                plan_code: item.plan_code,
                taskid: item.takid,
                taskid_h: item.taskid_h,
                decimal: route.params.decimal,
                managerplan: item.owner,
                viewppn: "NOTI",
                dataAge: item.wbs_id.split('.').length
            });
        } else { // item.read_type == null
            let itemType = (item.count_d > 0) ? item.type_d
                : ((item.count_e > 0) ? item.type_e
                    : item.type_s);
            await saveData(itemType, updateMsg, objSave);
            // navigation.navigate('Tasks', {
            //     site: dataServer,
            //     pre_event2: item.pre_event2,
            //     pre_event: item.pre_event,
            //     plan_code: item.plan_code,
            //     decimal: route.params.decimal,
            //     managerplan: item.owner,
            //     // viewppn: isViewPPN
            // });
            let nav = config.PPN_PG_RES == "Y" ? "progressTab" : "Progress";
            navigation.navigate(nav, {
                //progressTab
                site: dataServer,
                pre_event: item.pre_event,
                pre_event2: item.pre_event2,
                plan_code: item.plan_code,
                taskid: item.taskid,
                wbs_id: item.wbs_id,
                taskid_h: item.taskid_h,
                config: config,
                decimal: route.params.decimal,
                manager: item.owner,
                dataTask: [],
                dataAge: 1,
                navfrom: "NOTI"
            });
        }

    }

    const saveData = async (typeSave, updateMsg, item) => {
        // console.log("updateMsgupdateMsg: ",typeSave,updateMsg,item);
        const typeKey = {
            EndDate: "AT001", // end date
            DeadLine: "AT002", // deadline
            StartDate: "AT003", // start date
            CA: "AT004", // assign
            RA: "AT004", // remove assign
            CM: "AT005", // comment
            CF: "AT006", // attach file
            PG: "AT007", // update progress
        }
        let readed_data = [];
        console.log("readed_data before: ", readed_data);
        updateMsg.forEach(s => {
            if (s.taskid == item.id) {
                if (typeSave == "CF" || typeSave == "CM" || typeSave == "CA" || typeSave == "RA" || typeSave == "PG") {
                    let viewer = {
                        activity_id: s.activity_id
                        , read_type: s.read_type
                        , pre_event: item.pre_event
                        , plan_code: item.plan_code
                        , taskid: item.id
                        , alertcode: typeKey[typeSave]
                    }
                    readed_data = viewer;
                }
                if (typeSave == "EndDate" || typeSave == "DeadLine" || typeSave == "StartDate") {
                    let viewer = {
                        activity_id: s.activity_id || null
                        , read_type: typeSave
                        , pre_event: item.pre_event
                        , plan_code: item.plan_code
                        , taskid: item.id
                        , alertcode: typeKey[typeSave]
                        , user_id: s.owner
                        , create_dt: s.create_date
                        , create_user: s.owner
                    }
                    readed_data = viewer;
                }
            }
        })
        console.log("readed_data after: ", readed_data);
        // let type = typeSave == "CM" ? "comment"
        //     : typeSave == "CA" ? "assign"
        //         : typeSave == "PG" ? "progress" : "attach";
        let form = { data: [readed_data] };
        await saveAction(form, item)
    }

    const saveAction = async (data, item) => {
        console.log("datasaveAction: ", data);
        console.log("item saveAction: ", item);
        try {
            let url = `Planning/Planning/Planning_updateUsersSeenNoti`
            let action = await xt.postServerJson(url, data);
            if (action.success) {

                const index = getDocList.findIndex(x => x.taskid == data.data[0].taskid && x.alertcode == data.data[0].alertcode &&
                    (!xt.isEmpty(x.read_type) ? x.read_type : ((x.count_d > 0) ? x.type_d
                        : ((x.count_e > 0) ? x.type_e
                            : x.type_s))) == data.data[0].read_type);
                getDocList[index].read_timestamp = action.data.result[0].read_timestamp;

                setGetDocList(getDocList);
                setGetDocListToday(getDocList.filter(x => moment(x.create_date).format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")));
                setGetDocListYester(getDocList.filter(x => moment(x.create_date).format("DD/MM/YYYY") != moment().format("DD/MM/YYYY")));
                setDataDocListSelect(getDocListToday.slice(0, 5));
                setDataDocListSelectYester(getDocListYester.slice(0, 5));

                console.log("save success: ", action);
                if (data.data[0].read_type == "CF") {
                    navigation.navigate("Attachfile", {
                        pre_event: item.pre_event,
                        plan_code: item.plan_code,
                        taskid: item.id,
                        pre_event2: item.pre_event2,
                        manager: item.owner,
                        from: "task",
                        noti: "Y",
                        skill: getSkill,
                        owner_id: getOwner_id,
                        owner_id_outsource: getOwner_id_outsource,
                        // skill: (item.IsOwner == "Y") ? "Normal" : "JustWatch"

                    })
                } else if (data.data[0].read_type == "CM") {
                    navigation.navigate("Messaging", {
                        pre_event: item.pre_event,
                        plan_code: item.plan_code,
                        taskid: item.id,
                        pre_event2: item.pre_event2,
                        owner_id: getOwner_id,
                        owner_id_outsource: getOwner_id_outsource,
                        // manager: item.owner,
                        // from: "task",
                        // noti: "Y",
                        // skill: getSkill,
                        // skill: (item.IsOwner == "Y") ? "Normal" : "JustWatch"

                    })
                } else {
                    return;
                }
            } else {
                console.log("not success", action);
            }
        } catch (ex) {
            console.log("Error", ex);
        }
    }

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
                            <TouchableOpacity onPress={() => { setShowMenu(!isShowMenu); onProfile(); }}
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="person-sharp" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.profile}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="notifications-sharp" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.notification}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setShowMenu(!isShowMenu); onSetting() }}
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 5, borderBottomWidth: 1, borderBottomColor: colors.image_light }}>
                                <Ionicons name="settings" size={18} color="#8d99b2" />
                                <Text style={[styles.h5, { marginLeft: 5 }]}>{lang.setting_system}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setShowMenu(!isShowMenu); onLogout() }}
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
        if (item.read_timestamp != null) return null;  

        const iconMapping = {
            CA: "user-plus",
            CM: "comment",
            CF: "file-text",
            RA: "user-times",
            PG: "line-chart"
        };

        const remarkMapping = {
            CA: lang.noti_assign,
            CM: lang.noti_comment,
            CF: lang.noti_attach,
            RA: lang.noti_remove_assign,
            PG: lang.noti_update_pg
        };

        const iconMappingDate = {
            StartDate: "briefcase",
            EndDate: "briefcase",
            DeadLine: "clock-o"
        };

        const remarkMappingDate = {
            StartDate: lang.noti_task_start,
            EndDate: lang.noti_task_end,
            DeadLine: lang.noti_task_deadLine
        };

        const getIconView = () => {
            const iconStyle = {
                height: 95,
                width: 95,
                backgroundColor: '#03c6fc',
                marginRight: 20,
                padding: 20,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center'
            };

            if (!xt.isEmpty(item.read_type)) {
                return (
                    <View style={iconStyle}>
                        <FontAwesome
                            name={iconMapping[item.read_type] || "question-circle"}
                            size={50}
                            color="#ffffff"
                        />
                    </View>
                );
            } else if (item.count_d > 0) {
                return (
                    <View style={iconStyle}>
                        <FontAwesome
                            name={iconMappingDate[item.type_d] || "question-circle"}
                            size={50}
                            color="#ffffff"
                        />
                    </View>
                );
            } else if (item.count_s > 0) {
                return (
                    <View style={iconStyle}>
                        <FontAwesome
                            name={iconMappingDate[item.type_s] || "question-circle"}
                            size={50}
                            color="#ffffff"
                        />
                    </View>
                );
            } else {
                return (
                    <View style={iconStyle}>
                        <FontAwesome
                            name={iconMappingDate[item.type_e] || "question-circle"}
                            size={50}
                            color="#ffffff"
                        />
                    </View>
                );
            }
        };

        return (
            <TouchableOpacity
                onPress={() => beforeNext(item)}
                style={{
                    flex: 1,
                    padding: 20,
                    // backgroundColor: themes === 'light' ? "#e8e8e8" : "#1f4e79",
                    marginBottom: 2,
                    // backgroundColor: 'red'
                }}>
                <View style={{ marginBottom: 5 }}>
                    <Text style={{
                        flexDirection: "row",
                        textAlign: 'right',
                        fontSize: 10,
                        color: themes === 'light' ? '#000000' : '#ffffff'
                    }}>{index + 1} |
                        {moment(item.create_date).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")
                            ? ''
                            : moment(item.create_date).format("DD/MM/YYYY")} {moment(item.create_date).format("hh:mm A")}
                    </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                        {getIconView()}
                    </View>

                    <View style={{ flex: 1 }}>
                        {!xt.isEmpty(item.read_type) ? (
                            <Text style={{
                                fontSize: 15,
                                paddingBottom: 5,
                                color: themes === 'light' ? '#03c6fc' : '#ffffff'
                            }}>
                                {remarkMapping[item.read_type]}
                                {(item.read_type === 'StartDate' ||
                                    item.read_type === 'EndDate' ||
                                    item.read_type === 'DeadLine')
                                    ? `${item.count_total} ${lang.day}`
                                    : ''}
                            </Text>
                        ) : item.count_d > 0 ? (
                            <Text style={{
                                fontSize: 15,
                                paddingBottom: 5,
                                color: themes === 'light' ? '#03c6fc' : '#ffffff'
                            }}>
                                {`${remarkMappingDate[item.type_d]} ${alertDateType.deadline} ${lang.day}`}
                            </Text>
                        ) : item.count_s > 0 ? (
                            <Text style={{
                                fontSize: 15,
                                paddingBottom: 5,
                                color: themes === 'light' ? '#03c6fc' : '#ffffff'
                            }}>
                                {`${remarkMappingDate[item.type_s]} ${alertDateType.start} ${lang.day}`}
                            </Text>
                        ) : (
                            <Text style={{
                                fontSize: 15,
                                paddingBottom: 5,
                                color: themes === 'light' ? '#03c6fc' : '#ffffff'
                            }}>
                                {`${remarkMappingDate[item.type_e]} ${alertDateType.end} ${lang.day}`}
                            </Text>
                        )}

                        <Text style={{
                            fontSize: 14,
                            paddingBottom: 5,
                            color: themes === 'light' ? '#000000' : '#ffffff'
                        }}>
                            {lang.project}: {item.pre_des}
                        </Text>

                        <Text style={{
                            fontSize: 14,
                            paddingBottom: 5,
                            color: themes === 'light' ? '#000000' : '#ffffff'
                        }}>
                            {lang.planname}: {item.planname}
                        </Text>

                        <Text style={{
                            fontSize: 14,
                            color: themes === 'light' ? '#000000' : '#ffffff'
                        }}>
                            {lang.taskname}: {item.wbs_id} {item.taskname}
                        </Text>

                        {item.revise_status !== "N" && (
                            <Text style={{ fontSize: 14, color: 'red' }}>
                                {lang.remark}: {lang.noti_alert_revise}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };



    return (
        <>
            {renderMenu()}
            <View style={{
                flex: 1,
                // backgroundColor: themes === 'light' ? '#fff' : '#1f4e79',
                padding: 0,
            }}>
                <View style={{
                    height: checkYesterday ? '100%' : (!hideList ? '100%' : '50%'),
                    display: !hideListYester ? 'none' : 'flex'
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <View style={{
                            marginTop: 30,
                            marginBottom: 20,
                            paddingHorizontal: 20
                        }}>
                            <Text style={{
                                fontSize: 18,
                                color: themes === 'light' ? "#000" : "#fff"
                            }}>
                                {lang.notification_lists}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            if (hideList) {
                                setDataDocListSelect(getDocListToday);
                                setHideList(false);
                            } else {
                                setDataDocListSelect(getDocListToday.slice(0, 5));
                                setHideList(true);
                            }
                        }}>
                            <View style={{
                                marginTop: 38,
                                marginBottom: 20,
                                paddingHorizontal: 20
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: themes === 'light' ? "#000" : "#fff",
                                    textDecorationLine: "underline"
                                }}>
                                    {hideList ? lang.notification_showAll : lang.notification_Hide}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        paddingBottom: checkYesterday ? 75 : (!hideList ? 75 : 60)
                    }}>
                        <FlatList
                            data={dataDocListSelect}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>

                <View style={{
                    height: !hideListYester ? '100%' : '50%',
                    display: checkYesterday ? 'none' : (!hideList ? 'none' : 'flex')
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <View style={{
                            marginTop: 30,
                            marginBottom: 20,
                            paddingHorizontal: 20
                        }}>
                            <Text style={{
                                fontSize: 18,
                                color: themes === 'light' ? "#000" : "#fff"
                            }}>
                                {lang.notification_yesterday}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            if (hideListYester) {
                                setDataDocListSelectYester(getDocListYester);
                                setHideListYester(false);
                            } else {
                                setDataDocListSelectYester(getDocListYester.slice(0, 5));
                                setHideListYester(true);
                            }
                        }}>
                            <View style={{
                                marginTop: 38,
                                marginBottom: 20,
                                paddingHorizontal: 20
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: themes === 'light' ? "#000" : "#fff",
                                    textDecorationLine: "underline"
                                }}>
                                    {hideListYester ? lang.notification_showAll : lang.notification_Hide}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: 130 }}>
                        <FlatList
                            data={dataDocListSelectYester}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </View>
        </>
    );

}

const menuStyles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    menuText: {
        marginLeft: 10,
        fontSize: 16
    }
});