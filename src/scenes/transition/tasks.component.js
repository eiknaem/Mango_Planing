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
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import moment from 'moment';
import { CheckViewPPN } from "../../components/variousRights";
import { apiAuth } from "../../api/authentication";
import { UpdateProgress_UR } from "../../components/variousRights";

export default function TasksScreen({ route, navigation }) {
    const Params = route.params;
    const getDataTaskSearch = Params.dataTaskSearch;
    const getDataAgeSearch = Params.dataAgeSearch || null;
    const getPoint = Params.point
    const getManagerPlan = Params.managerplan
    const getViewPPN = Params.viewppn
    const $linq = (arr) => new linq(arr);
    // const theme = useTheme();
    const [lang, setLang] = useState({});
    const [config, setConfig] = useState({});
    const [dataServer, setDataServer] = useState(route.params.site);
    const [dataArr, setDataArr] = useState([]);
    const [isLastTask, setLastTask] = useState("0");
    const [dataAge, setDataAge] = useState(1);
    const [taskArr, setTaskArr] = useState([]);
    const [amount, setAmount] = useState([]);
    const [isTaskAmount, setTaskAmount] = useState([]);
    const [isAllobjCheck, setAllobjCheck] = useState([]);

    const [searchValue, setSeachValue] = useState(null);
    const [statusValue, setStatusValue] = useState([]);

    const [dataloadding, setDataloadding] = useState(true);
    const [dataemty, setDataemty] = useState(false);
    const [isUserRight, setUserRight] = useState("");
    const [usertype, setUsertype] = useState("");
    const [themes, setthemes] = useState("")
    const [isViewPPN, setViewPPN] = useState("");
    const [isAuth, setAuth] = useState("");
    const [loadfile, setLoadfile] = useState(false);


    const [searchTime, setSeachTime] = useState(null);
    const { width, height } = Dimensions.get('window');


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
    }, [route, loadfile, themes, colors]);
    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            onloadAuth();
            onloadconfig();
            checkViewPPn();

            if (getViewPPN == "NOTI") {
                setDataAge(Params.dataAge);
                setLastTask(Params.taskid_h);
                onloaddata(Params.dataAge, Params.taskid_h, "next");
            } else {
                onloaddata(null, null, null);
            }

        }, [route.params.pre_event, getDataAgeSearch, getDataTaskSearch, getPoint])
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
                <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate("Search", { routeName: "Tasks" })}
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
    const onItemPress = (item, index) => {
        console.log("getDataAgeSearch: ", getDataAgeSearch);
        console.log("item goprogress: ", item);
        console.log("index goprogress: ", index);
        if (item.hasChild == "N") {
            setDataStorage("progress_per", "");
            setDataStorage("progress_qty", "");
            setDataStorage("PGBack", "");
            setDataAge(1);
            setTaskArr([]);
            let nav = config.PPN_PG_RES == "Y" ? "progressTab" : "Progress";
            navigation.navigate(nav, {
                //progressTab
                site: dataServer,
                pre_event: route.params.pre_event,
                pre_event2: route.params.pre_event2,
                plan_code: item.plan_code,
                taskid: item.taskid,
                wbs_id: item.wbs_id,
                taskid_h: item.taskid_h,
                config: config,
                decimal: route.params.decimal,
                manager: getManagerPlan,
                dataTask: taskArr,
                dataAge: dataAge,
                navfrom: "TASK"
            });
        } else {
            let goChildNext = dataAge + 1
            console.log("goChildNext: ", goChildNext);
            setDataAge(goChildNext)
            onloaddata(goChildNext, item.taskid, "next");
            setLastTask(item.taskid);
            // setTashkH(item.taskid_h);
            if (getPoint == "search") {
                const newArr = [...taskArr]
                newArr.push(item.taskid);
                console.log("newArr: ", newArr);
                setTaskArr(newArr)
            }
        }
    };
    const onAttachfilePress = (item, skill) => {
        console.log("route.params.pre_eventitemiii: ", route.params.pre_event);
        // if (getViewPPN == "Y") {
        navigation.navigate("Attachfile", {
            site: dataServer,
            pre_event: route.params.pre_event,
            pre_event2: route.params.pre_event2,
            // pre_event: item.pre_event,
            plan_code: item.plan_code,
            taskid: item.taskid,
            dataTask: taskArr,
            dataAge: dataAge,
            from: "task",
            manager: getManagerPlan,
            skill: skill,
            owner_id: item.owner_id,
            owner_id_outsource: item.owner_id_outsource,
        });
        // } 
        // else {
        //   navigation.navigate("Attachfile", {
        //     site: dataServer,
        //     pre_event2: item.pre_event2,
        //     pre_event: item.pre_event,
        //     plan_code: item.plan_code,
        //     taskid: item.taskid,
        //     dataTask: taskArr,
        //     dataAge: dataAge,
        //     from: "task",
        //     manager: getManagerPlan,
        //     skill: "Normal",
        //     owner_id: item.owner_id,
        //     owner_id_outsource: item.owner_id_outsource,
        //   });
        // }
    };
    const onMessagePress = (item) => {
        navigation.navigate("Messaging", {
            // pre_event2: item.pre_event2,
            // pre_event: item.pre_event,
            pre_event: route.params.pre_event,
            pre_event2: route.params.pre_event2,
            plan_code: item.plan_code,
            taskid: item.taskid,
            dataTask: taskArr,
            dataAge: dataAge,
            manager: getManagerPlan,
            owner_id: item.owner_id,
            owner_id_outsource: item.owner_id_outsource,
            from: "task",
        });
    };
    const onSearch = async () => {
        console.log("lasttask onsearch: ", isLastTask);
        navigation.navigate("Tasksearch", {
            routeNames: "Tasksearch",
            dataTask: taskArr,
            dataAge: dataAge,
            pre_event: route.params.pre_event,
            pre_event2: route.params.pre_event2,
            plan_code: route.params.plan_code,
            manager: getManagerPlan
        });
    };
    const onRefresh = async () => {
        console.log("dataAge onRefresh: ", dataAge);
        setDataStorage("TasksearchTime", "");
        setDataStorage("tasksearchValue", "");
        setDataStorage("taskstatusValue", "inprogress,notstart,overdue,delay");
        setDataStorage("taskfilter", "Y");
        const newArr = [...taskArr]
        let lastElement = newArr[newArr.length - 1];
        onloaddata(dataAge, lastElement, "refresh");
    };
    const onloadAuth = async () => {
        let updateProgress = await UpdateProgress_UR()
        setUserRight(updateProgress);
    };
    const onloaddata = async (age, nextTask, point) => { // EDIT / BUG

        var usertype_ = await getDataStorage("usertype");
        console.log("usertype_ task: ", usertype_);
        setUsertype(usertype_)

        console.log("age load: ", age);
        console.log("point: ", point);
        let Current_age = age || 1;
        let ThisTask = nextTask
        console.log("getPoint onload ", getPoint);

        let whatPoint = (point == "next" || point == "back" || point == "refresh") ? point : getPoint || "load"

        console.log("whatPoint: ", whatPoint);
        if ((whatPoint == "load" || whatPoint == "next")) {
            console.log("if onload..");
            Current_age = age || 1;
            ThisTask = nextTask
            setDataAge(Current_age)
        } else if (whatPoint == "search") {
            console.log("else onload..");
            Current_age = getDataAgeSearch
            const newArr = [...getDataTaskSearch]
            let lastElement = newArr[newArr.length - 1];
            ThisTask = lastElement
            console.log("lastElement onloaddata: ", lastElement);
            setTaskArr(newArr)
            setDataAge(Current_age)
        } else if (whatPoint == "refresh") {
            Current_age == age;
            ThisTask = nextTask;
            setDataAge(Current_age)
        }

        console.log("Current_age: ", Current_age);

        var taskfilter_ = (await getDataStorage("taskfilter")) || "Y";
        if (taskfilter_ == "N") {
            setDataemty(false);
            setDataloadding(false);
            setDataStorage("taskfilter", "Y");
        } else {
            setDataemty(true);
            setDataArr([]);
            setDataloadding(true);
        }
        var searchValue_ = (await getDataStorage("tasksearchValue")) || "";
        var statusValue_ = (await getDataStorage("taskstatusValue")) || "";
        var timeValue_ = (await getDataStorage("TasksearchTime")) || "";
        console.log("statusValue_: ", statusValue_);
        console.log("------->", timeValue_);

        setSeachTime(!xt.isEmpty(timeValue_) ? JSON.parse(timeValue_) : "");
        setSeachValue(searchValue_);

        // let url =
        //   "Planning/Plan/app_plan_task_list?pre_event=" +
        //   route.params.pre_event +
        //   "&plan_code=" +
        //   route.params.plan_code;
        // let res = await xt.getServer(url);
        // console.log("res v1: ",res);


        //v2 เรียกตัวแม่

        let data_ = []

        if (Current_age == 1) {

            // Set Use API version
            try { // Api For NEW version
                // let url = `/Planning/Plan/app_plan_task_list_v4?pre_event=${route.params.pre_event || ""}&plan_code=${route.params.plan_code || ""}&taskid=MAIN1234567890`; // taskid=0
                let url = `/Planning/Planning/CalculatePlan?pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code}&taskid=MAIN1234567890`;
                console.log("url task: ", url);
                let res = await xt.getServer(url);
                console.log("res task: ", res);
                data_ = $linq(res.data.data_task).where(task => task.taskid != "xxxxxxxxxx").toArray();

                data_.forEach((v, i) => {
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date).format('DD/MM/YYYY');
                    v.end_date_show = moment(v.end_date).format('DD/MM/YYYY');
                });

                console.log("===================================== Tasks use api new version =====================================");
            } catch (ex) { // Api For OLD version 
                console.log(ex, "ex");

                let url = `/Planning/Plan/app_plan_task_list_v4?pre_event=${route.params.pre_event || ""}&plan_code=${route.params.plan_code || ""}&taskid=MAIN1234567890`
                console.log("url task: ", url);
                let res = await xt.getServer(url);
                console.log("res task: ", res);
                data_ = $linq(res.plan_auth).where(task => task.taskid != "xxxxxxxxxx").toArray();

                data_.forEach((v, i) => {
                    v.progress_per = v.pg_per;
                    v.progress_per_b = v.pg_per_b;
                    v.plan_per = (v.pv_per >= 99.9999) ? xt.roundPlanPer(v.pv_per, route.params.decimal || global.decimal) : v.pv_per; //v.pv_per
                    // v.progress_per_b = v.pg_per_b
                    // v.pv_per = (v.pv_per >= 99.9999) ? xt.roundPlanPer(v.pv_per, route.params.decimal || global.decimal) : v.pv_per; //v.pv_per
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date).format('DD/MM/YYYY');
                    v.end_date_show = moment(v.end_date).format('DD/MM/YYYY');
                });

                console.log("===================================== Tasks use api old version =====================================");
            }
            console.log("111111111", data_);
            // setApiVersion(apiVersion);
            if (point != "back" && getPoint != "search") {
                const newArr = [...taskArr]
                console.log("newArr: ", newArr);
                newArr.push("0");
                setTaskArr(newArr)
            }
            await ForEachData(data_, searchValue_, statusValue_, timeValue_)
        } else if (Current_age > 1) {
            console.log("else....");
            try { // Api For NEW version 

                // let url = `/Planning/Plan/app_plan_task_list_v4?pre_event=${route.params.pre_event || ""}&plan_code=${route.params.plan_code || ""}&taskid=${ThisTask}`
                let url = `/Planning/Planning/CalculatePlan?pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code}&taskid=${ThisTask}`;
                console.log(`url next task ${age}: `, url);
                let res = await xt.getServer(url);
                console.log(`res next task ${age}: `, res);
                // data_ = res.plan_auth;
                data_ = $linq(res.data.data_task).where(task => task.taskid != "xxxxxxxxxx").toArray();

                data_.forEach((v, i) => {
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date).format('DD/MM/YYYY');
                    v.end_date_show = moment(v.end_date).format('DD/MM/YYYY');
                });

                console.log("===================================== Tasks use api new version =====================================");
            } catch (ex) { // Api For OLD version 

                let url = `/Planning/Plan/app_plan_task_list_v4?pre_event=${route.params.pre_event || ""}&plan_code=${route.params.plan_code || ""}&taskid=${ThisTask}`;
                console.log(`url next task ${age}: `, url);
                let res = await xt.getServer(url);
                console.log(`res next task ${age}: `, res);
                // data_ = res.plan_auth;
                data_ = $linq(res.plan_auth).where(task => task.taskid != "xxxxxxxxxx").toArray();

                data_.forEach((v, i) => {
                    v.progress_per = v.pg_per;
                    v.progress_per_b = v.pg_per_b;
                    v.plan_per = (v.pv_per >= 99.9999) ? xt.roundPlanPer(v.pv_per, route.params.decimal || global.decimal) : v.pv_per; //v.pv_per
                    // v.progress_per_b = v.pg_per_b
                    // v.pv_per = (v.pv_per >= 99.9999) ? xt.roundPlanPer(v.pv_per, route.params.decimal || global.decimal) : v.pv_per; //v.pv_per
                    v.status = xt.getStatus2(v.status);
                    v.start_date_show = moment(v.start_date).format('DD/MM/YYYY');
                    v.end_date_show = moment(v.end_date).format('DD/MM/YYYY');
                });

                console.log("===================================== Tasks use api old version =====================================");
            }

            if (point != "back" && getPoint != "search" && point != "refresh") {
                console.log("เข้า if หรอ");
                console.log("data_[0].taskid_h: ", data_);
                const newArr = [...taskArr]
                newArr.push(data_[0].taskid_h);
                console.log("newArr: ", newArr);
                setTaskArr(newArr)
            }
            await ForEachData(data_, searchValue_, statusValue_, timeValue_)
        }
        console.log(data_, "data_==================================================================================================================");

    };
    const ForEachData = async (data, searchValue_, statusValue_, timeValue_) => {
        console.log("data ปัจจุบัญ: ", data);
        //v3

        onFilter(data, searchValue_, statusValue_, timeValue_);
    };
    const checkViewPPn = async () => {
        var usertype_ = await getDataStorage("usertype");
        if (usertype_ == "Employee") {
            let viewPPN = await CheckViewPPN();
            setViewPPN(viewPPN)
        } else if (usertype_ == "Outsource") {
            setViewPPN("N")
        }
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

        let server_data = (await apiAuth.getAuth()).data;
        // console.log("server_data: ", server_data);

        let auth = server_data.auth;
        setAuth(auth);

    };
    const onFilter = async (data_, searchValue, statusValue, timeValue_) => {
        console.log("data_ onFilter: ", data_);
        console.log("statusValue ", statusValue);
        if (timeValue_ != "") {
            console.log("กรอง วัน");
            const Time = JSON.parse(timeValue_);
            console.log("searchTime ==================>", Time);
            data_ = $linq(data_).where(w =>
                (moment(w?.start_date).format("YYYYMMDD") >= moment(Time.start_time).format("YYYYMMDD") &&
                    moment(w?.start_date).format("YYYYMMDD") <= moment(Time.end_time).format("YYYYMMDD")) ||
                (moment(Time.start_time).format("YYYYMMDD") >= moment(w?.start_date).format("YYYYMMDD") &&
                    moment(Time.start_time).format("YYYYMMDD") <= moment(w?.end_date).format("YYYYMMDD"))).toArray();
        }
        const status_split = xt.isEmpty(statusValue) ? [] : statusValue.split(",");
        setStatusValue(status_split);
        if (searchValue || status_split.length != 0) {
            const filterdata = data_
                .filter((item) => status_split.includes(item.status))
                .filter(function filter(c) {
                    return (
                        searchValue === "" ||
                        c.taskname.toLowerCase().startsWith(searchValue.toLowerCase())
                    );
                });
            if (filterdata.length != 0) {
                setDataemty(false);
            } else {
                setDataemty(true);
            }
            // console.log("filterdata: ",filterdata);
            setDataArr(filterdata)

        } else {
            console.log("dasdasd", data_);
            setDataArr(data_);
            if (data_.length != 0) {
                setDataemty(false);
            } else {
                setDataemty(true);
            }
        }
        setDataloadding(false);
    };
    const goBack = () => {

        let goheadNext = dataAge - 1;
        console.log("goheadNext: ", goheadNext);

        const newArr = [...taskArr]
        newArr.pop()

        console.log("newArr goBack: ", newArr);


        let lastElement = newArr[newArr.length - 1];

        console.log("lastElement: ", lastElement);


        if ((goheadNext == 1) && (lastElement == "0")) {
            console.log("ifback...");
            setDataAge(goheadNext)
            onloaddata(goheadNext, lastElement, "back");
        } else if ((goheadNext > 1) && (lastElement != "0")) {
            console.log("elseifback...");
            setDataAge(goheadNext)
            onloaddata(goheadNext, lastElement, "back");
        }
        else {
            console.log("else goback สุดท้าย...");
            navigation.goBack()
        }
        setDataAge(goheadNext);
        setTaskArr(newArr)

    };
    const checkConfirmUpdate = (item) => {
        // console.log("item checkConfirmUpdate: ",item); 
        if (usertype == "Employee") {
            const thatmyTaskArray = xt.isEmpty(item.owner_id) ? [] : item.owner_id.split(',');
            console.log(thatmyTaskArray, "thatmyTaskArray");

            if (item.hasChild == "N" && isUserRight == "N") {
                return true;
            } else if (item.hasChild == "N" && isUserRight == "Y") {
                if (thatmyTaskArray.length === 1) {
                    if (thatmyTaskArray[0] == isAuth.empno) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                    if (thatMyTask) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else if (usertype == "Outsource") {
            if (xt.isEmpty(item.owner_id_outsource) && item.hasChild == "N") {
                return true;
            } else if (xt.isEmpty(item.owner_id_outsource) && item.hasChild == "Y") {
                return false;
            } else {
                const thatmyTaskArray = xt.isEmpty(item.owner_id_outsource) ? [] : item.owner_id_outsource.split(',');
                console.log("thatmyTaskArray: ", thatmyTaskArray);
                if (item.hasChild == "N") {
                    if (thatmyTaskArray.length === 1) {
                        if (thatmyTaskArray[0] == isAuth.empno) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                        if (thatMyTask) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            }
        }
    };
    const checkUpdateProgress = (item) => {
        if (usertype == "Employee") { // Employee
            const thatmyTaskArray = xt.isEmpty(item.owner_id) ? [] : item.owner_id.split(',');
            console.log("thatmyTaskArray: ", thatmyTaskArray);
            if (item.hasChild == "N" && isUserRight == "N") {
                return (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                            <EvilIcons name="lock" size={30} color="red" />
                            <Text style={{ width: "80%" }} category="p1">
                                <Text category="p1" status="basic">
                                    {item.wbs_id} :
                                </Text>{" "}
                                {item.taskname}
                            </Text>
                        </View>
                    </>
                )
            } else if (item.hasChild == "N" && isUserRight == "Y") {
                if (thatmyTaskArray.length === 1) {
                    if (thatmyTaskArray[0] == isAuth.empno) {
                        return (
                            <>
                                <Text style={{ width: "80%" }} category="p1">
                                    <Text category="p1" status="basic">
                                        {item.wbs_id} :
                                    </Text>{" "}
                                    {item.taskname}
                                </Text>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                                    <EvilIcons name="lock" size={30} color="red" />
                                    <Text style={{ width: "80%" }} category="p1">
                                        <Text category="p1" status="basic">
                                            {item.wbs_id} :
                                        </Text>{" "}
                                        {item.taskname}
                                    </Text>
                                </View>
                            </>
                        )
                    }
                } else {
                    const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                    if (thatMyTask) {
                        return (
                            <>
                                <Text style={{ width: "80%" }} category="p1">
                                    <Text category="p1" status="basic">
                                        {item.wbs_id} :
                                    </Text>{" "}
                                    {item.taskname}
                                </Text>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                                    <EvilIcons name="lock" size={30} color="red" />
                                    <Text style={{ width: "80%" }} category="p1">
                                        <Text category="p1" status="basic">
                                            {item.wbs_id} :
                                        </Text>{" "}
                                        {item.taskname}
                                    </Text>
                                </View>
                            </>
                        )
                    }
                }
            } else {
                return (
                    <>
                        <Text style={{ width: "80%" }} category="p1">
                            <Text category="p1" status="basic">
                                {item.wbs_id} :
                            </Text>{" "}
                            {item.taskname}
                        </Text>
                    </>
                )
            }
        } else { // Outsource
            if (xt.isEmpty(item.owner_id_outsource) && item.hasChild == "N") {
                return (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                            <EvilIcons name="lock" size={30} color="red" />
                            <Text style={{ width: "80%" }} category="p1">
                                <Text category="p1" status="basic">
                                    {item.wbs_id} :
                                </Text>{" "}
                                {item.taskname}
                            </Text>
                        </View>
                    </>
                )
            } else if (xt.isEmpty(item.owner_id_outsource) && item.hasChild == "Y") {
                return (
                    <>
                        <Text style={{ width: "80%" }} category="p1">
                            <Text category="p1" status="basic">
                                {item.wbs_id} :
                            </Text>{" "}
                            {item.taskname}
                        </Text>
                    </>
                )
            } else {
                const thatmyTaskArray = xt.isEmpty(item.owner_id_outsource) ? [] : item.owner_id_outsource.split(',');
                console.log("thatmyTaskArray: ", thatmyTaskArray);
                if (item.hasChild == "N") {
                    if (thatmyTaskArray.length === 1) {
                        if (thatmyTaskArray[0] == isAuth.empno) {
                            return (
                                <>
                                    <Text style={{ width: "80%" }} category="p1">
                                        <Text category="p1" status="basic">
                                            {item.wbs_id} :
                                        </Text>{" "}
                                        {item.taskname}
                                    </Text>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                                        <EvilIcons name="lock" size={30} color="red" />
                                        <Text style={{ width: "80%" }} category="p1">
                                            <Text category="p1" status="basic">
                                                {item.wbs_id} :
                                            </Text>{" "}
                                            {item.taskname}
                                        </Text>
                                    </View>
                                </>
                            )
                        }
                    } else {
                        const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                        if (thatMyTask) {
                            return (
                                <>
                                    <Text style={{ width: "80%" }} category="p1">
                                        <Text category="p1" status="basic">
                                            {item.wbs_id} :
                                        </Text>{" "}
                                        {item.taskname}
                                    </Text>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -9 }}>
                                        <EvilIcons name="lock" size={30} color="red" />
                                        <Text style={{ width: "80%" }} category="p1">
                                            <Text category="p1" status="basic">
                                                {item.wbs_id} :
                                            </Text>{" "}
                                            {item.taskname}
                                        </Text>
                                    </View>
                                </>
                            )
                        }
                    }
                } else {
                    return (
                        <>
                            <Text style={{ width: "80%" }} category="p1">
                                <Text category="p1" status="basic">
                                    {item.wbs_id} :
                                </Text>{" "}
                                {item.taskname}
                            </Text>
                        </>
                    )
                }
            }
        }
    };
    const CheckUserMessageButton = (item) => {
        if (usertype == "Employee") { // Employee
            const thatmyTaskArray = xt.isEmpty(item.owner_id) ? [] : item.owner_id.split(',');
            console.log("thatmyTaskArray: ", thatmyTaskArray);
            if (thatmyTaskArray.length === 1) {
                if (thatmyTaskArray[0] == isAuth.empno) {
                    return (
                        <>
                            <Button
                                style={{
                                    width: 40,
                                    height: 30,
                                    // marginLeft: 10,
                                    marginRight: -15,
                                    backgroundColor: "rgba(52, 52, 52, 0)",
                                    borderWidth: 0,
                                }}
                                appearance="outline"
                                status="basic"
                                accessoryLeft={MessageCircleIcon}
                                onPress={() => onMessagePress(item)}
                            />
                        </>
                    )
                }
            } else {
                const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                if (thatMyTask) {
                    return (
                        <>
                            <Button
                                style={{
                                    width: 40,
                                    height: 30,
                                    // marginLeft: 10,
                                    marginRight: -15,
                                    backgroundColor: "rgba(52, 52, 52, 0)",
                                    borderWidth: 0,
                                }}
                                appearance="outline"
                                status="basic"
                                accessoryLeft={MessageCircleIcon}
                                onPress={() => onMessagePress(item)}
                            />
                        </>
                    )
                }
            }

        } else { // Outsource
            if (!xt.isEmpty(item.owner_id_outsource)) {
                if (item.hasChild == "N") {
                    const thatmyTaskArray = xt.isEmpty(item.owner_id_outsource) ? [] : item.owner_id_outsource.split(',');
                    console.log("thatmyTaskArray: ", thatmyTaskArray);
                    if (thatmyTaskArray.length === 1) {
                        if (thatmyTaskArray[0] == isAuth.empno) {
                            return (
                                <>
                                    <Button
                                        style={{
                                            width: 40,
                                            height: 30,
                                            // marginLeft: 10,
                                            marginRight: -15,
                                            backgroundColor: "rgba(52, 52, 52, 0)",
                                            borderWidth: 0,
                                        }}
                                        appearance="outline"
                                        status="basic"
                                        accessoryLeft={MessageCircleIcon}
                                        onPress={() => onMessagePress(item)}
                                    />
                                </>
                            )
                        }
                    } else {
                        const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                        if (thatMyTask) {
                            return (
                                <>
                                    <Button
                                        style={{
                                            width: 40,
                                            height: 30,
                                            // marginLeft: 10,
                                            marginRight: -15,
                                            backgroundColor: "rgba(52, 52, 52, 0)",
                                            borderWidth: 0,
                                        }}
                                        appearance="outline"
                                        status="basic"
                                        accessoryLeft={MessageCircleIcon}
                                        onPress={() => onMessagePress(item)}
                                    />
                                </>
                            )
                        }
                    }
                }
            }
        }
    };
    const CheckUserAttachButton = (item) => {
        if (usertype == "Employee") { // Employee
            const thatmyTaskArray = xt.isEmpty(item.owner_id) ? [] : item.owner_id.split(',');
            console.log("thatmyTaskArray: ", thatmyTaskArray);
            if (thatmyTaskArray.length === 1) {
                if (thatmyTaskArray[0] == isAuth.empno) {
                    return (
                        <>
                            <View style={styles.startdate}>
                                {/* <Button
                      style={{
                        width: 40,
                        height: 30,
    
                        // marginLeft: 10,
                        marginRight: -5,
                        backgroundColor: "rgba(52, 52, 52, 0)",
                        borderWidth: 0,
                      }}
                      appearance="outline"
                      status="basic"
                      accessoryLeft={AttachIcon}
                      onPress={() => onAttachfilePress(item, "Normal")}
                    /> */}
                                <TouchableOpacity onPress={() => onAttachfilePress(item, "Normal")} style={{ marginHorizontal: 5 }} >
                                    <View style={styles.attacFile}>
                                        <Text style={{ fontSize: 8, color: "#fff" }}>
                                            {item.count_file || 0}
                                        </Text>
                                    </View>
                                    <AttachIcon
                                        width={25}
                                        height={25}
                                    ></AttachIcon>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                } else {
                    return (
                        <>
                            <View style={styles.startdate}>
                                {/* <Button
                      style={{
                        width: 40,
                        height: 30,
    
                        // marginLeft: 10,
                        marginRight: -5,
                        backgroundColor: "rgba(52, 52, 52, 0)",
                        borderWidth: 0,
                      }}
                      appearance="outline"
                      status="basic"
                      accessoryLeft={AttachIcon}
                      onPress={() => onAttachfilePress(item, "JustWatch")}
                    /> */}
                                <TouchableOpacity onPress={() => onAttachfilePress(item, "JustWatch")} style={{ marginHorizontal: 5 }} >
                                    <View style={styles.attacFile}>
                                        <Text style={{ fontSize: 8, color: "#fff" }}>
                                            {item.count_file || 0}
                                        </Text>
                                    </View>
                                    <AttachIcon
                                        width={25}
                                        height={25}
                                    ></AttachIcon>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
            } else {
                const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                if (thatMyTask) {
                    return (
                        <>
                            <View style={styles.startdate}>
                                {/* <Button
                      style={{
                        width: 40,
                        height: 30,
    
                        // marginLeft: 10,
                        marginRight: -5,
                        backgroundColor: "rgba(52, 52, 52, 0)",
                        borderWidth: 0,
                      }}
                      appearance="outline"
                      status="basic"
                      accessoryLeft={AttachIcon}
                      onPress={() => onAttachfilePress(item, "Normal")}
                    /> */}
                                <TouchableOpacity onPress={() => onAttachfilePress(item, "Normal")} style={{ marginHorizontal: 5 }} >
                                    <View style={styles.attacFile}>
                                        <Text style={{ fontSize: 8, color: "#fff" }}>
                                            {item.count_file || 0}
                                        </Text>
                                    </View>
                                    <AttachIcon
                                        width={25}
                                        height={25}
                                    ></AttachIcon>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                } else {
                    return (
                        <>
                            <View style={styles.startdate}>
                                {/* <Button
                      style={{
                        width: 40,
                        height: 30,
    
                        // marginLeft: 10,
                        marginRight: -5,
                        backgroundColor: "rgba(52, 52, 52, 0)",
                        borderWidth: 0,
                      }}
                      appearance="outline"
                      status="basic"
                      accessoryLeft={AttachIcon}
                      onPress={() => onAttachfilePress(item, "JustWatch")}
                    /> */}
                                <TouchableOpacity onPress={() => onAttachfilePress(item, "JustWatch")} style={{ marginHorizontal: 5 }} >
                                    <View style={styles.attacFile}>
                                        <Text style={{ fontSize: 8, color: "#fff" }}>
                                            {item.count_file || 0}
                                        </Text>
                                    </View>
                                    <AttachIcon
                                        width={25}
                                        height={25}
                                    ></AttachIcon>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
            }

        } else { // Outsource
            if (!xt.isEmpty(item.owner_id_outsource)) {
                if (item.hasChild == "N") {
                    const thatmyTaskArray = xt.isEmpty(item.owner_id_outsource) ? [] : item.owner_id_outsource.split(',');
                    console.log("thatmyTaskArray: ", thatmyTaskArray);
                    if (thatmyTaskArray.length === 1) {
                        if (thatmyTaskArray[0] == isAuth.empno) {
                            return (
                                <>
                                    <View style={styles.startdate}>
                                        {/* <Button
                          style={{
                            width: 40,
                            height: 30,
    
                            // marginLeft: 10,
                            marginRight: -5,
                            backgroundColor: "rgba(52, 52, 52, 0)",
                            borderWidth: 0,
                          }}
                          appearance="outline"
                          status="basic"
                          accessoryLeft={AttachIcon}
                          onPress={() => onAttachfilePress(item, "Normal")}
                        /> */}
                                        <TouchableOpacity onPress={() => onAttachfilePress(item, "Normal")} style={{ marginHorizontal: 5 }} >
                                            <View style={styles.attacFile}>
                                                <Text style={{ fontSize: 8, color: "#fff" }}>
                                                    {item.count_file || 0}
                                                </Text>
                                            </View>
                                            <AttachIcon
                                                width={25}
                                                height={25}
                                            ></AttachIcon>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        }
                    } else {
                        const thatMyTask = thatmyTaskArray.some((item) => isAuth.empno == item)
                        if (thatMyTask) {
                            return (
                                <>
                                    <View style={styles.startdate}>
                                        {/* <Button
                          style={{
                            width: 40,
                            height: 30,
    
                            // marginLeft: 10,
                            marginRight: -5,
                            backgroundColor: "rgba(52, 52, 52, 0)",
                            borderWidth: 0,
                          }}
                          appearance="outline"
                          status="basic"
                          accessoryLeft={AttachIcon}
                          onPress={() => onAttachfilePress(item, "Normal")}
                        /> */}
                                        <TouchableOpacity onPress={() => onAttachfilePress(item, "Normal")} style={{ marginHorizontal: 5 }} >
                                            <View style={styles.attacFile}>
                                                <Text style={{ fontSize: 8, color: "#fff" }}>
                                                    {item.count_file || 0}
                                                </Text>
                                            </View>
                                            <AttachIcon
                                                width={25}
                                                height={25}
                                            ></AttachIcon>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        }
                    }
                }
            }
        }
    };
    const onAssignList = (item) => {
        console.log(item, "item");

        navigation.navigate("EmployeeList", {
            site: dataServer,
            pre_event: route.params.pre_event,
            pre_event2: route.params.pre_event2,
            plan_code: item.plan_code,
            taskid: item.taskid,
            taskid_h: Params.taskid_h,
            manager: getManagerPlan,
            dataTask: taskArr,
            dataAge: dataAge,
            from: "task",
            dataEmp: item,
            skill: "Normal",
            viewppn: getViewPPN
        });
    };
    const renderFriendItem = ({ item, index }) => {
        if (index < 3) {
            return (
                <View style={styles.friendItem}>
                    <Avatar style={{ width: 38, height: 38 }} source={xt.getimg(dataServer, false, item.img)} />
                </View>
            )
        }
    };
    const renderItem = ({ item, index }) => {
        console.log("item", item);
        return (
            <>
                <TouchableOpacity style={[styles.blockcard, { flex: 1, top: '5%', width: '100%', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }]}
                    onPress={() => onItemPress(item, index)}
                    disabled={checkConfirmUpdate(item)}>
                    {/* Body */}
                    <View style={{ flex: 2, flexDirection: 'row', }}>
                        <View style={{ flex: 3, }}>
                            <Text style={[styles.h4, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>{checkUpdateProgress(item)}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingEnd: 20 }}>
                            <Text style={[styles.h5_bold, { backgroundColor: colors.red, width: 90, height: 25, borderRadius: 5, marginLeft: 5, fontSize: 14, textAlign: 'center', color: themes == 'light' ? colors.black : colors.white }]}>{item.status}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <View style={{ flex: 4 }}>
                            <Text style={[styles.h5,
                            { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PL :  <Text style={[styles.h5_bold, { color: colors.greentree, fontSize: 14, }]}>
                                    {/* {Number.isInteger(item.plan_per)
                                        ? item.plan_per
                                        : Number(xt.dec(item.plan_per, 2)).toFixed(route.params.decimal || global.decimal)} % */}
                                    {Number(xt.dec(item.plan_per, 2)).toFixed(route.params.decimal || global.decimal)} %
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 4 }}>
                            <Text style={[styles.h5,
                            { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>PG : <Text style={[styles.h5_bold, { color: colors.red, fontSize: 14, }]}>
                                    {/* {Number.isInteger(item.progress_per)
                                        ? item.progress_per
                                        : Number(xt.dec(item.progress_per, 2)).toFixed(route.params.decimal || global.decimal)} % */}
                                    {Number(xt.dec(item.progress_per, 2)).toFixed(route.params.decimal || global.decimal)} %
                                </Text>
                            </Text>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', }}>
                            <FontAwesome name="commenting-o" size={24} color="#8d99b2" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4, marginTop: 10, flex: 6, flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.font_dark }}>
                        <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 30, height: 30, backgroundColor: 'lime', borderRadius: 30, }}>
                            </View>
                        </View>
                        <View style={{ flex: 6, flexDirection: 'row', }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 4, alignItems: 'center' }}>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.start_date}</Text>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.start_date_show}</Text>
                                </View>
                                <View style={{ flex: 4, alignItems: 'center' }}>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{lang.emd_date}</Text>
                                    <Text style={[styles.h5, { marginLeft: 5, fontSize: 12, color: themes == 'light' ? colors.black : colors.white }]}>{item.end_date_show}</Text>
                                </View>
                                <TouchableOpacity style={{ flex: 2, alignItems: 'center' }}>
                                    <Feather name="paperclip" size={20} color="#8d99b2" />
                                    <View style={{ width: width * 0.05, height: height * 0.025, position: "absolute", backgroundColor: colors.black, right: width * -0.001, top: "30%", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                        {loadfile
                                            ? <ActivityIndicator size={12} color={"#fff"} />
                                            : (<Text style={[styles.h5_bold, { color: colors.white, fontSize: 10, marginLeft: 3 }]}>{"99+"} </Text>)}
                                        {/* <ActivityIndicator size={12} color={"#fff"} /> */}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity >
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

