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
import $xt from "../../api/xtools";


export default function PlansScreen({ route, navigation }) {
    const $linq = arr => new linq(arr);
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
    const [isCountNoti, setCountNoti] = useState("");

    const { width, height } = Dimensions.get('window');

    const Params = route.params;
    const dataEMP = Params.dataEmp;
    const getNoti = Params?.noti;
    const isFrom = Params?.from;
    const getManager = Params?.manager;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: themes === 'light' ? colors.white : colors.back_bg,
                shadowColor: "transparent",
                elevation: 0,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerTintColor: themes === 'light' ? colors.black : colors.white, // แก้ไขตรงนี้
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight()
        });
    }, [route, isCountNoti, loadfile, themes, colors]);
    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            onloaddata();

        }, [])
    );
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
    };
    const headerRight = () => {
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate("Search", { routeName: "Plans" })}
                >
                    <FontAwesome name="search" size={18} color={themes == 'light' ? colors.black : colors.white} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onRefresh()}
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="refresh" size={18} color={themes == 'light' ? colors.black : colors.white} />
                </TouchableOpacity>
            </View >
        )
    };
    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)

    };
    const goBack = () => {
        navigation.navigate('Project');
    };
    const onRefresh = async () => {
        setDataStorage('searchTime', "");
        setDataStorage('plansearchValue', "");
        setDataStorage('statusValue', "inprogress,notstart,overdue,delay");
        setDataStorage('planfilter', "Y");
        onloaddata();
    };
    // const onloaddata = async () => {

    //     var planfilter_ = await getDataStorage("planfilter") || "Y";
    //     var usertype_ = await getDataStorage("usertype");
    //     console.log("usertype_ plan: ", usertype_);
    //     setUsertype(usertype_)

    //     if (planfilter_ == "N") {
    //         setDataemty(false);
    //         setDataloadding(false);
    //         setDataStorage('planfilter', "Y");
    //     } else {
    //         setDataemty(true);
    //         setDataArr([]);
    //         setDataloadding(true)
    //     }
    //     var searchValue_ = await getDataStorage("plansearchValue") || "";
    //     var statusValue_ = await getDataStorage("statusValue") || "";
    //     var searchTime_ = await getDataStorage("searchTime") || "";
    //     console.log("get searchTime_ --- >", searchTime_);

    //     setSeachTime(!xt.isEmpty(searchTime_) ? JSON.parse(searchTime_) : "");
    //     setSeachValue(searchValue_);

    //     var data_ = [];
    //     var testplan = [];

    //     // Set api use version
    //     try { // For New Api Version
    //         const startAPI = Date.now();
    //         let url = `/Planning/Planning/CalculateProject?pre_event=${route.params.pre_event}`;
    //         var res = await xt.getServer(url);
    //         console.log(`API Call took: ${Date.now() - startAPI}ms`);
    //         console.log('Response Data Size:', JSON.stringify(res).length, 'bytes');

    //         // console.log(res, 'resresresresresresresresresresresresresresres');
    //         if (usertype_ == "Employee") {
    //             let viewPPN = await CheckViewPPN();
    //             setViewPPN(viewPPN)
    //         }

    //         data_ = $linq(res.data.data_array).select(y => {
    //             let dataMain = $linq(y.value).where(da => da.taskid == "MAIN1234567890").firstOrDefault();

    //             return dataMain;
    //         }
    //         ).toArray();

    //         data_ = $linq(data_).orderByDescending(o => o.add_dt || null).toArray();
    //         console.log(data_, "data_");

    //         testplan = $linq(data_).where(y => (y.pn_active == "Y" || y.pn_active == null) && y.revise_status == "N").toArray();

    //         testplan.forEach(async (v, i) => {
    //             v.status = xt.getStatus2(v.status);
    //             v.start_date_show = moment(v.start_date2).format('DD/MM/YYYY');
    //             v.end_date_show = moment(v.end_date2).format('DD/MM/YYYY');
    //             if (v.img) {
    //                 const imgUrl = dataServer + "api/file/download/?download=false&id=" + v.img;
    //                 v.img = imgUrl;
    //             }
    //         });

    //         console.log("testplan ----------------------------->", testplan);
    //         console.log("===================================== Plans use api new version =====================================");

    //     } catch (error) { // For old api Version

    //         if (usertype_ == "Employee") {
    //             let viewPPN = await CheckViewPPN();
    //             let url = "/Planning/Plan/app_plan_list3?pre_event=" + route.params.pre_event
    //             var res = await xt.getServer(url);
    //             // console.log("res v3", res);
    //             data_ = res.plan_auth || res.data;
    //             data_ = $linq(data_).orderByDescending(o => o.add_dt || null).toArray();
    //             testplan = $linq(data_).where(y => (y.pn_active == "Y" || y.pn_active == null) && y.revise_status == "N").toArray()

    //             setViewPPN(viewPPN)
    //         } else if (usertype_ == "Outsource") {
    //             // let url = "Planning/Plan/app_plan_list3?pre_event=" + route.params.pre_event
    //             let url = "/Planning/Plan/app_plan_list?pre_event=" + route.params.pre_event
    //             var res = await xt.getServer(url);
    //             console.log("res plan no view ppn: ", res);
    //             data_ = res.plan_auth || res.data;
    //             data_ = $linq(data_).orderByDescending(o => o.add_dt || null).toArray();
    //             testplan = $linq(data_).where(y => (y.pn_active == "Y" || y.pn_active == null) && y.revise_status == "N").toArray()
    //         }

    //         testplan.forEach(async (v, i) => {
    //             v.status = xt.getStatus2(v.status);
    //             v.start_date_show = moment(v.start_date2).format('DD/MM/YYYY');
    //             v.end_date_show = moment(v.end_date2).format('DD/MM/YYYY');
    //         });

    //         let urlAction = `/Planning/plan/app_plan_data3?pre_event=${route.params.pre_event}&plan_code=`;
    //         let rsp = await xt.getServer(urlAction);
    //         console.log("rsp api: ", rsp);

    //         testplan.forEach(obj => {
    //             let matchingRspObj = rsp.plan_data.find(rspObj => rspObj.plan_code === obj.plan_code);
    //             console.log("matchingRspObj : ", matchingRspObj);

    //             if (matchingRspObj) {
    //                 if (usertype == "Employee") {
    //                     Object.assign(obj, {
    //                         end_date: matchingRspObj.end_date,
    //                         start_date: matchingRspObj.start_date,
    //                         pv: matchingRspObj.pv,
    //                         total_amt: matchingRspObj.contract_amt,
    //                         plan_per: (matchingRspObj.pv_per >= 99.9999) ? xt.roundPlanPer(matchingRspObj.pv_per, route.params.decimal || global.decimal) : matchingRspObj.pv_per, //matchingRspObj.pv_per,
    //                         progress_per: matchingRspObj.progress_per,
    //                         ev_perB: matchingRspObj.progress_per_b,
    //                         status: xt.getStatus2(matchingRspObj.status)
    //                     });
    //                 } else {
    //                     Object.assign(obj, {
    //                         end_date: matchingRspObj.end_date,
    //                         start_date: matchingRspObj.start_date,
    //                         pv: matchingRspObj.pv,
    //                         total_amt: matchingRspObj.contract_amt,
    //                         plan_per: (matchingRspObj.pv_per >= 99.9999) ? xt.roundPlanPer(matchingRspObj.pv_per, route.params.decimal || global.decimal) : matchingRspObj.pv_per, //matchingRspObj.pv_per,
    //                         progress_per: matchingRspObj.progress_per,
    //                         ev_perB: matchingRspObj.progress_per_b,
    //                         status: xt.getStatus2(matchingRspObj.status)
    //                     });
    //                 }

    //             }
    //         });

    //         console.log("===================================== Plans use api old version =====================================");
    //     }

    //     // data_ = res.data_array;

    //     // testplan.forEach(async (v, i) => {
    //     //   v.status = xt.getStatus2(v.status);
    //     //   v.start_date_show = moment(v.start_date2).format('DD/MM/YYYY');
    //     //   v.end_date_show = moment(v.end_date2).format('DD/MM/YYYY'); 
    //     // });
    //     console.log("datass_", testplan);
    //     // console.log("data_", $linq(data_).where(x => x.planname == "test 03/03 v1"));

    //     setDataArr(testplan)
    //     setDataemty(false);
    //     setDataloadding(false)
    //     // onFilter(testplan, searchValue_, statusValue_, searchTime_)
    //     loadPlanData(testplan, searchValue_, statusValue_, searchTime_);
    // }
    const onloaddata = async () => {
        try {
            // Load local storage values
            const [
                planfilter_,
                usertype_,
                searchValue_,
                statusValue_,
                searchTime_
            ] = await Promise.all([
                getDataStorage("planfilter").then(val => val || "Y"),
                getDataStorage("usertype"),
                getDataStorage("plansearchValue").then(val => val || ""),
                getDataStorage("statusValue").then(val => val || ""),
                getDataStorage("searchTime").then(val => val || "")
            ]);

            console.log("usertype_ plan: ", usertype_);
            setUsertype(usertype_);
            setSeachValue(searchValue_);
            setSeachTime(!xt.isEmpty(searchTime_) ? JSON.parse(searchTime_) : "");

            if (planfilter_ === "N") {
                setDataemty(false);
                setDataloadding(false);
                setDataStorage("planfilter", "Y");
            } else {
                setDataemty(true);
                setDataArr([]);
                setDataloadding(true);
            }

            let data_ = [];
            let testplan = [];

            const useNewApi = async () => {
                const url = `/Planning/Planning/CalculateProject?pre_event=${route.params.pre_event}`;
                const startAPI = Date.now();
                const res = await xt.getServer(url);
                console.log("res useNewApi", res);
                console.log(`API Call took: ${Date.now() - startAPI}ms`);
                console.log("Response Data Size:", JSON.stringify(res).length, "bytes");

                if (usertype_ === "Employee") {
                    const viewPPN = await CheckViewPPN();
                    setViewPPN(viewPPN);
                }

                data_ = $linq(res.data.data_array)
                    .select(y => $linq(y.value).where(d => d.taskid === "MAIN1234567890").firstOrDefault())
                    .orderByDescending(o => o.add_dt || null)
                    .toArray();

                testplan = $linq(data_)
                    .where(y => (y.pn_active === "Y" || y.pn_active === null) && y.revise_status === "N")
                    .toArray();

                testplan.forEach(v => {
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date2).format("DD/MM/YYYY");
                    v.end_date_show = moment(v.end_date2).format("DD/MM/YYYY");
                    if (v.img) {
                        v.img = `${dataServer}api/file/download/?download=false&id=${v.img}`;
                    }
                });

                console.log("✅ Plans from new API:", testplan);
            };

            const useOldApi = async () => {
                let res;
                let viewPPN;
                let url;

                if (usertype_ === "Employee") {
                    viewPPN = await CheckViewPPN();
                    url = `/Planning/Plan/app_plan_list3?pre_event=${route.params.pre_event}`;
                    setViewPPN(viewPPN);
                } else {
                    url = `/Planning/Plan/app_plan_list?pre_event=${route.params.pre_event}`;
                }

                res = await xt.getServer(url);
                data_ = res.plan_auth || res.data || [];
                data_ = $linq(data_).orderByDescending(o => o.add_dt || null).toArray();
                testplan = $linq(data_)
                    .where(y => (y.pn_active === "Y" || y.pn_active === null) && y.revise_status === "N")
                    .toArray();

                testplan.forEach(v => {
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date2).format("DD/MM/YYYY");
                    v.end_date_show = moment(v.end_date2).format("DD/MM/YYYY");
                });

                const rsp = await xt.getServer(`/Planning/plan/app_plan_data3?pre_event=${route.params.pre_event}&plan_code=`);
                console.log("rsp api: ", rsp);

                testplan.forEach(obj => {
                    const match = rsp.plan_data.find(p => p.plan_code === obj.plan_code);
                    if (match) {
                        Object.assign(obj, {
                            end_date: match.end_date,
                            start_date: match.start_date,
                            pv: match.pv,
                            total_amt: match.contract_amt,
                            plan_per: (match.pv_per >= 99.9999)
                                ? xt.roundPlanPer(match.pv_per, route.params.decimal || global.decimal)
                                : match.pv_per,
                            progress_per: match.progress_per,
                            ev_perB: match.progress_per_b,
                            status: xt.getStatus2(match.status)
                        });
                    }
                });

                console.log("✅ Plans from old API:", testplan);
            };

            // Try new API, fallback to old if error
            try {
                await useNewApi();
            } catch (err) {
                console.warn("❗ Fallback to old API due to error:", err);
                await useOldApi();
            }

            setDataArr(testplan);
            setDataemty(false);
            setDataloadding(false);
            loadPlanData(testplan, searchValue_, statusValue_, searchTime_);
        } catch (e) {
            console.error("🚨 Failed to load data:", e);
            setDataloadding(false);
        }
    };

    const renderItem = ({ item, index }) => {
        // console.log("item", item);
        return (
            <>
                <TouchableOpacity style={[styles.blockcard, { flex: 1, top: '5%', width: '100%', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }]}
                    onPress={() => onItemPress(item)}
                >
                    {/* Body */}
                    <View style={{ flex: 2, flexDirection: 'row', }}>
                        <View style={{ flex: 3, }}>
                            <Text style={[styles.h4, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>{lang.planname} : {item.planname} </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingEnd: 20 }}>
                            <Text style={[styles.h5_bold, { backgroundColor: colors.red, width: 90, height: 25, borderRadius: 5, marginLeft: 5, fontSize: 14, textAlign: 'center', color: themes == 'light' ? colors.black : colors.white }]}> {item.status}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.h5,
                            { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PL :  <Text style={[styles.h5_bold, { color: colors.greentree, fontSize: 14, }]}>
                                    {Number.isInteger(item.plan_per)
                                        ? item.plan_per
                                        : Number(xt.dec(item.plan_per, 2)).toFixed(route.params.decimal || global.decimal)} %
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.h5,
                            { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PG : <Text style={[styles.h5_bold, { color: colors.red, fontSize: 14, }]}>
                                    {Number.isInteger(item.progress_per)
                                        ? item.progress_per
                                        : Number(xt.dec(item.progress_per, 2)).toFixed(route.params.decimal || global.decimal)} %
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 4, marginTop: 10, flex: 6, flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                        <View
                            style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                            {item.ow_list.map((owner, index) => (
                                <TouchableOpacity
                                    onPress={() => onAssignList(item)}
                                    key={index}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderWidth: 1,
                                        borderColor: colors.greentree,
                                        borderRadius: 30,
                                        marginLeft: index > 0 ? -10 : 0 // ให้รูปซ้อนกันเล็กน้อย
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 90,
                                        }}
                                        resizeMode="cover"
                                        source={
                                            !$xt.isEmpty(owner.img)
                                                ? { uri: dataServer + "api/file/download/?download=false&id=" + owner.img }
                                                : require("../../../assets/images/user.png")
                                        }
                                    />
                                </TouchableOpacity>
                            ))}
                            {item.ow_list.length > 3 && (
                                <View style={{
                                    marginLeft: 5,
                                    backgroundColor: colors.grey_t,
                                    borderRadius: 15,
                                    padding: 5
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        fontSize: 12
                                    }}>
                                        +{item.ow_list.length - 3}
                                    </Text>
                                </View>
                            )}
                        </View>


                        {/* เพิ่มส่วน Start Date, End Date */}
                    </View>

                </TouchableOpacity >
            </>
        );
    };
    const loadPlanData = async (fetchData, searchValue_, statusValue_, searchTime_) => {
        console.log("fetchData: ", fetchData);
        try {
            console.log("Updated fetchData: ", fetchData);
            // setDataArr([...fetchData]);
            onFilter(fetchData, searchValue_, statusValue_, searchTime_)

        } catch (error) {
            console.log("error: ", error);
        }
    };

    // const onFilter = async (data_, searchValue, statusValue, searchTime_) => {
    //     console.log("data onL ", data_.length);
    //     console.log("searchTime_searchTime_: ", searchTime_);

    //     if (searchTime_ != "") {
    //         console.log("กรอง วัน");
    //         const _searchTime = JSON.parse(searchTime_);
    //         console.log("searchTime ==================>", _searchTime);
    //         data_date = $linq(data_).where(w =>
    //             (moment(w?.start_date2).format("YYYYMMDD") >= moment(_searchTime.time_start).format("YYYYMMDD") &&
    //                 moment(w?.start_date2).format("YYYYMMDD") <= moment(_searchTime.time_end).format("YYYYMMDD")) ||
    //             (moment(_searchTime.time_start).format("YYYYMMDD") >= moment(w?.start_date2).format("YYYYMMDD") &&
    //                 moment(_searchTime.time_start).format("YYYYMMDD") <= moment(w?.end_date2).format("YYYYMMDD"))).toArray();

    //         if (data_date > 0) {
    //             data_ = data_date
    //         }else if (data_date == 0){
    //             setDataemty(false);
    //             setDataStorage("plansearchValue", "");
    //             setDataStorage('searchTime', "");
    //             setDataStorage('statusValue', "inprogress,notstart,overdue,delay");
    //             Alert.alert(
    //                 'ไม่พบข้อมูลที่ค้นหา',
    //                 'ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง',
    //                 [{ text: 'ตกลง' }]
    //             );
    //         }
    //         console.log("data_ search date: ", data_);

    //     }
    //     const status_split = (statusValue == "") ? [] : statusValue.split(",");
    //     setStatusValue(status_split);

    //     if (searchValue || status_split.length != 0) {
    //         const filterdata = data_.filter(item => status_split.includes(item.status)).filter(function filter(c) {
    //             return (
    //                 searchValue === '' ||
    //                 c.planname.toLowerCase().startsWith(searchValue.toLowerCase())
    //             );
    //         });
    //         if (filterdata.length != 0) {
    //             setDataemty(false);
    //             setDataArr(filterdata);
    //         } else {
    //             setDataArr(data_);
    //             setDataemty(false);
    //             setDataStorage("plansearchValue", "");
    //             setDataStorage('searchTime', "");
    //             setDataStorage('statusValue', "inprogress,notstart,overdue,delay");
    //             Alert.alert(
    //                 'ไม่พบข้อมูลที่ค้นหา',
    //                 'ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง',
    //                 [{ text: 'ตกลง' }]
    //             );
    //         }
    //         // loadPlanData(filterdata);

    //     } else {
    //         // loadPlanData(data_);
    //         setDataArr(data_);
    //         if (data_.length != 0) {
    //             setDataemty(false);
    //         } else {
    //             setDataemty(true);
    //         }
    //     }
    //     setDataloadding(false)

    // };

    const onFilter = async (data_, searchValue, statusValue, searchTime_) => {
        console.log("data onL ", data_.length);
        console.log("searchTime_searchTime_: ", searchTime_);

        let data_1 = data_;

        if (searchTime_ !== "") {
            console.log("กรอง วัน");
            const _searchTime = JSON.parse(searchTime_);
            console.log("searchTime ==================>", _searchTime);

            data_1 = $linq(data_1).where(w =>
                (moment(w?.start_date2).format("YYYYMMDD") >= moment(_searchTime.time_start).format("YYYYMMDD") &&
                    moment(w?.start_date2).format("YYYYMMDD") <= moment(_searchTime.time_end).format("YYYYMMDD")) ||
                (moment(_searchTime.time_start).format("YYYYMMDD") >= moment(w?.start_date2).format("YYYYMMDD") &&
                    moment(_searchTime.time_start).format("YYYYMMDD") <= moment(w?.end_date2).format("YYYYMMDD"))
            ).toArray();

            console.log("Filter by date: ", data_1);
        }

        const status_split = (statusValue === "") ? [] : statusValue.split(",");
        setStatusValue(status_split);

        if (status_split.length > 0) {
            data_1 = data_1.filter(item => status_split.includes(item.status));
        }

        let filterData = data_1;
        if (searchValue && searchValue.trim() !== '') {
            filterData = data_1.filter(item =>
                item.planname.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (filterData.length > 0) {
            setDataemty(false);
            setDataArr(filterData);
        } else {
            if (searchValue || status_split.length > 0) {
                await Promise.all([
                    setDataStorage("plansearchValue", ""),
                    setDataStorage('searchTime', ""),
                    setDataStorage('statusValue', "inprogress,notstart,overdue,delay")
                ]);

                Alert.alert(
                    'ไม่พบข้อมูลที่ค้นหา',
                    'ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองใหม่อีกครั้ง',
                    [{ text: 'ตกลง' }]
                );

                setDataArr(data_);
                setDataemty(false);
            } else {
                setDataArr(data_);
                setDataemty(data_.length === 0);
            }
        }

        setDataloadding(false);
    };

    const onAttachfilePress = (item) => {
        console.log("itemplan onAttachfilePress: ", item);
        if (isViewPPN == "Y") {
            navigation.navigate("Attachfile", {
                site: dataServer,
                pre_event2: item.pre_event2,
                pre_event: item.pre_event,
                plan_code: item.plan_code,
                taskid: item.taskid,
                from: "plan",
                manager: item.owner,
                skill: (item.IsOwnPlan == "Y") ? "Normal" : "JustWatch"
            });
        } else {
            navigation.navigate("Attachfile", {
                site: dataServer,
                pre_event2: item.pre_event2,
                pre_event: item.pre_event,
                plan_code: item.plan_code,
                taskid: item.taskid,
                from: "plan",
                manager: item.owner,
                skill: "Normal"
            });
        }
    };
    const onAssignList = (item) => {
        navigation.navigate("EmployeeList", {
            site: dataServer,
            dataEmp: item,
            skill: "Normal",
        });
    };
    const onItemPress = (item) => {
        setDataStorage('TasksearchTime', "");
        setDataStorage('tasksearchValue', "");
        setDataStorage('taskstatusValue', "inprogress,notstart,delay,overdue");
        console.log('itemitem plan: ', item);
        navigation.navigate('Tasks', {
            site: dataServer,
            pre_event2: item.pre_event2,
            pre_event: item.pre_event,
            plan_code: item.plan_code,
            decimal: route.params.decimal,
            managerplan: item.owner,
            viewppn: isViewPPN
        });
    };
    return (
        < View style={{ flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.back_bg, padding: 10 }} >
            {dataemty == false ? (
                <>
                    {/* Status */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: themes == 'light' ? colors.white : colors.back_dark }}>
                        <View>
                            <Text style={[styles.h5_bold, { marginLeft: 5, fontSize: 16, color: themes == 'light' ? colors.black : colors.white }]}>Status :</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                            {statusValue.map((status, index) => (
                                <View key={index} style={{
                                    backgroundColor: '#38B34A',
                                    marginLeft: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 5,
                                    borderRadius: 10
                                }}>
                                    <Text style={[styles.h5, {
                                        // marginLeft: 5,
                                        fontSize: 12,
                                        color: 'white'
                                    }]}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={{ top: '1%', paddingBottom: '5%' }}>
                        <FlatList
                            data={dataArr}
                            renderItem={renderItem}
                            initialNumToRender={5}
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

