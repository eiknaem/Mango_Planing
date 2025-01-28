import React, { useEffect, useState, useLayoutEffect, useFocusEffect } from "react";
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
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import { KeyboardAvoidingView } from "../../scenes/auth/extra/3rd-party";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiAuth } from "../../api/authentication";
import MessageBox from "../../api/msg";
import { getSysconfig } from "../../api/sysconfig";
import { CheckViewPPN } from "../../components/variousRights";
import { NoRowsImg } from "../../components/noRowsImg";
import HomeLayout from "../../template/home_layout";

export default function PlansScreen({ route, navigation }) {
    const [lang, setLang] = useState({});
    const [isSizeImage, setSizeImage] = useState({});
    const [isBase64, setBase64] = useState("");
    const [dataServer, setDataServer] = useState(null);
    const [dataloadding, setDataloadding] = useState(true);
    const [data, setData] = useState({});
    const [progress_qty, setProgress_qty] = useState(null);
    const [progress_per, setProgress_per] = useState(null);
    const [progress_qty_old, setProgress_qty_old] = useState(0);
    const [progress_per_old, setProgress_per_old] = useState(0);
    const [incidence, setIncidence] = useState(null);
    const [incidence_code, setIncidence_code] = useState(null);
    const [remark, setRemark] = useState(null);
    const [itemno, setItemno] = useState(null);
    const [qclist, setQclist] = useState([]);
    const [wbsarr, setWbsarr] = useState([]);

    const [datapgimg, setSatapgimg] = useState([]);

    const [pgsizefile, setPgsizefile] = useState(null);

    const multilineInputState = useInputState();
    ///// new /////
    const [image, setImage] = useState(null);
    const [sizecon, setSizecon] = useState(route.params.sizefile || 0);
    const [sizepg, setSizepg] = useState(route.params.pgsizefile || 0);

    const [isGpsLocation, setGpsLocation] = useState("");
    const [isGpsLocationCoordinate, setGpsLocationCoordinate] = useState("");

    const useInputState = (initialValue = "") => {
        const [value, setValue] = useState(initialValue);
        return { value, onChangeText: setValue };

    };
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
            setLang([]);
            getLangDF();
            onloadData();
            onLoadConfig();
            onloadLocation();
            //onloadPhoto();
        }, [itemno])
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
    const onFilesAdd = () => {
        let item = route.params;
        navigation && navigation.navigate("Filesadd", item);
    };

    const onHeadertask = () => {
        let item = route.params;
        navigation && navigation.navigate("Headertask", item);
    };
    const onhistory = () => {
        let item = route.params;
        navigation && navigation.navigate("Progresshistory", item);
    };

    const onIncidence = () => {
        let item = route.params;
        navigation && navigation.navigate("Incidence", item);
    };
    const onFilesSelect = () => {
        if (!itemno) return;
        let item = route.params;
        item.itemno = itemno;
        item.sizefile = data.sizefile;
        item.control_sizefile = data.control_sizefile;
        item.pgsizefile = pgsizefile;
        navigation && navigation.navigate("Filesaddprogress", item);
    };
    const getFileInfo = async (fileURI) => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI)
        return fileInfo
    };
    const Base64File = async (data, file, form) => {
        // console.log("data", data);
        // console.log("file", file);

        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        // let base64 = auth?.base64_file || "N";
        let filesize = auth.base64_filesize || null;
        // console.log("filesize...", filesize);
        let ext = (file.name.split(".").pop() || "").toLowerCase();
        // console.log("ext..", ext);
        if (filesize != null) {
            console.log("2");
            let configsize = 1024 * 1024 * filesize;

            console.log("configsize", configsize);
            console.log("data.pgsizefile", file);
            console.log("_file 1...", file.size > configsize);
            let _currentSize = file.size / 1000000
            console.log("_currentSize", _currentSize);

            let currentSize = $xt.reformatNumber(_currentSize, 2)
            if (parseInt(file.size) > configsize) {
                console.log("3");
                MessageBox.Alert("Warning", `File size more than ${filesize}MB is the current size of ${currentSize}MB. `, "OK");
                return false;
            }
        }
        // let ext = _file.name.split(".").pop();
        if (["xls", "xlsx"].includes(ext)) {
            let configsize = 1024 * 1024 * 15;
            // console.log("_file 2...", data.pgsizefile > configsize);
            if (parseInt(data.pgsizefile) > configsize) {
                console.log("4");
                MessageBox.Alert("Warning", `File size more than 15MB`, "OK");
                return false;
            }
        }

        if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx", "heic", "heif"].includes(ext)) {
            console.log("5");
            MessageBox.Alert(
                "Warning",
                `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx, heic, heif)`,
                "OK"
            );
            return false;
        }
        console.log("file.uri", file.uri);

        // let base64 = await FileSystem.readAsStringAsync("file:///data/user/0/host.exp.exponent/cache/ImagePicker/85687701-5ac7-4545-bf0e-83d54c4fd60f.jpg");
        // console.log("base64", base64);

        // let bas64 = base64.split(",");
        // console.log("base64_Split...", bas64);
        form.append("base64_file", file.base64);
        form.append("base64_filename", file.name);
        form.append("base64_content_type", file.type);
        return true;
    };
    const pickImage = async () => {
        if (!itemno) return;
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            base64: true,
            // allowsEditing: true,
            // aspect: [4, 3],
            // quality:  Platform.OS == 'ios' ? 0.67 : 1,
        });

        console.log("result", result);

        if (!result.canceled) {
            console.log("result แนบรูป: ", result);

            // setImage(result.uri ? [result.uri] : result.selected);
            onSuccess(result.assets)
        }
    };
    const onSuccess = async (data) => {
        console.log("onsuccess : ", data);

        let item = route.params;
        setSizepg(item.pgsizefile);
        // console.log("control_sizefile", item.control_sizefile);

        if (item.control_sizefile == "Y") {
            for (const i of data) {
                const fileInfo = await getFileInfo(i['localUri']);
                let size = (sizepg + (fileInfo?.size || 0))
                setSizepg(size);
            }
            console.log("sizepg", sizepg, ">", "sizecon", sizecon);

            if (sizepg > sizecon) {
                navigation && navigation.navigate('Infocontact', route.params);
            } else {
                for (const i of data) {
                    await onUpdateMedia(i);
                }
                // navigation.goBack();
            }
        } else {
            console.log("no control");

            for (const i of data) {
                await onUpdateMedia(i);
            }
            // navigation.goBack();
            // onloadPhoto(dataServer);
            setDataloadding(false)
            // console.log("end");
        }
        // setVisible(false);
        onloadPhoto(dataServer);
        setDataloadding(false)


        //navigation.goBack();

    };
    const onUpdateMedia = async (item) => {
        console.log("onUpload", item);
        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        let base64 = auth?.base64_file || "N";
        console.log("server_data", base64);
        console.log("item", item);

        const manipResult = await manipulateAsync(item.uri,
            [{
                resize: {
                    height: isSizeImage.height,
                    width: isSizeImage.width
                }
            }]
        );
        console.log("manipResult", manipResult);
        const fileInfo = await getFileInfo(manipResult.uri);
        // console.log("filex", filex);

        console.log("fileInfo", fileInfo);
        const split = fileInfo.uri.split("-");
        const fileName = split[split.length - 1] || "";
        const file = {
            uri: manipResult.uri,
            type: "*/*",
            name: item.fileName || fileName,
            size: fileInfo.size,
            base64: item.base64
        };
        console.log("file ii: ", file);
        var items = route.params;
        let formData = new FormData();
        formData.append("file", file);
        formData.append("pre_event2", items.pre_event2);
        formData.append("pre_event", items.pre_event);
        formData.append("plancode", items.plan_code);
        formData.append("doctype", "TASK");
        formData.append("taskid", items.taskid);
        formData.append("sizefile", fileInfo?.size.toString()); //fileInfo?.size
        formData.append("refitemno", itemno);
        formData.append("gps_location", isGpsLocationCoordinate);
        formData.append("gps_location_coordinates", isGpsLocation);
        // console.log("before change base64");
        ///////////////////////////////////////base64////////////////
        if (base64 == 'Y') {
            let _Base64 = await Base64File(items, file, formData);
            if (!_Base64) {
                console.log("1>>");
                return {
                    success: true,
                };
            }
        }
        // console.log("2>>", formData);
        try {
            setDataloadding(true)
            var url = "Planning/Plan/Planning_Attachfile";
            var rsp = await xt.postServerForm(url, formData);
            console.log("rsp แนบรูป: ", rsp);
        } catch (error) {
            MessageBox.Alert("ERROR", error.toString())
        }
        if (rsp.success) {
            let size = (sizepg + (fileInfo?.size || 0))
            setSizepg(size);
        }
    };
    const onCamara = () => {
        console.log(itemno, 'itemno');

        if (!itemno) return;
        console.log("CAMERA");
        let item = route.params;
        item.itemno = itemno;
        item.sizefile = data.sizefile;
        item.control_sizefile = data.control_sizefile;
        item.pgsizefile = pgsizefile;
        navigation && navigation.navigate("Camera", item);
    };
    const onCamaravideo = () => {
        if (!itemno) return;
        let item = route.params;
        item.itemno = itemno;
        item.sizefile = data.sizefile;
        item.control_sizefile = data.control_sizefile;
        item.pgsizefile = pgsizefile;
        navigation && navigation.navigate("Camaravideo", item);
    };
    const onSetRemark = (item, index) => {
        navigation && navigation.navigate("Remarkimg", item);
    };
    const onKeyboard = (val, key) => {
        let item = route.params;
        item.progress_per = progress_per;
        item.progress_qty = progress_qty;
        item.data = data;
        item.key = key;
        navigation && navigation.navigate("Keyboard", item);
    };
    const onloadData = async () => {

        // let url = `Planning/Plans/update_summary_planByProject?pre_event=${this.plandata.pre_event}&plan_code=${this.plandata.plan_code}`;
        // let rsp = await xt.getServer(url);
        var incidence_select_ =
            (await getDataStorage("incidence_select_key")) || "N";
        var PGBack = (await getDataStorage("PGBack")) || "N";
        console.log("=> ", incidence_select_, PGBack);
        if (PGBack == "GOBack") {
            let _qty = (await getDataStorage("progress_qty")) || "N";
            let _per = (await getDataStorage("progress_per")) || "N";
            setProgress_qty(_qty);
            setProgress_per(_per);
            console.log("PGBack == GOBack");

        }
        if (incidence_select_ == "Y") {
            var incidence_ = (await getDataStorage("incidence_key")) || "";
            var incidence_code_ = (await getDataStorage("incidence_code_key")) || "";
            setIncidence_code(incidence_code_);
            setIncidence(incidence_);
            setDataStorage("incidence_select_key", "N");
            console.log("incidence_select_ == Y");

        } else {
            console.log("else สิครับ");
            setData({});
            setDataloadding(true);
            let url = `Planning/Planning/onLoadTaskprogress?pre_event2=${route.params.pre_event2}&pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code}&taskid=${route.params.taskid}`;
            let rsp = await xt.getServer(url);
            console.log("url : ", url);
            // console.log("onloadData rsp LINE 402 Progress: ", rsp.data);
            let data = rsp.data;
            console.log('======================================================================================> :', data);

            setData(data);
            setPgsizefile(rsp.size);
            setDataloadding(false);
            onUpdatetask(data);
            if (data.qc_code) {
                Planning_Qc_list(data.percomp);
            }
            if (wbsarr.length == 0) {
                onLoadHeadtask();
            }
        }
        console.log("on load data");

    };
    const onLoadConfig = async () => {
        var rsp2 = await getSyscode();
        let server_data = (await apiAuth.getAuth()).data;
        let auth = server_data.auth;
        console.log("auth progress: ", auth);

        let base64 = auth?.base64_file || "N";
        console.log("base64", base64);

        let _size = {
            width: rsp2.img_width,
            height: rsp2.img_height
        }
        setSizeImage(_size)
        setBase64(base64)
    };
    const onupdateProgressH = async (obj) => {
        let d = {
            datah: {
                pre_event2: route.params.pre_event2,
                pre_event: route.params.pre_event,
                plan_code: route.params.plan_code,
                wbs_id: obj.wbs_id,
                taskid: obj.taskid,
            },
        };
        // console.log("dddd", d);
        try {
            var url = "Planning/Plan/updateProgressH";
            let rsp = await xt.postServerJson(url, d);
            return rsp
        } catch (error) {
            throw error.toString();
        }

    };
    const onUpdateItem = async () => {
        let prom = []

        wbsarr.forEach((v, i) => {

            if (v.wbs_id) {
                prom.push(onupdateProgressH(v));
            }
        });
        await Promise.all(prom)

        // for (let v of wbsarr) {
        //   let r = await onupdateProgressH(v)
        //   console.log("onupdateProgressH", r);s

        // }
    };
    const onLoadHeadtask = async () => {
        let wbs_number = xt.getWbs(route.params.wbs_id);
        let formData = new FormData();
        formData.append("pre_event", route.params.pre_event);
        formData.append("plan_code", route.params.plan_code);
        formData.append("taskid", route.params.taskid);
        formData.append("wbsid_number", wbs_number.string);

        // let url = "Planning/Plan/onloadHeaderTasks";
        // let rsp = await xt.postServerJson(url, formData).then((res) => {
        //   setWbsarr(res.data || []);
        // });

        try {
            let rsp = await xt.postServerJson("Planning/Plan/onloadHeaderTasks", formData).then((res) => {
                setWbsarr(res.data || []);
            });
        } catch (err) {
            setWbsarr([]);
        }
    };
    const Planning_Qc_list = async (percomp) => {
        var url =
            "Planning/Planning/Planning_Qc_list?pre_event=" +
            route.params.pre_event +
            "&plancode=" +
            route.params.plan_code +
            "&taskid=" +
            route.params.taskid;
        let rsp = await xt.getServer(url);
        setQclist(rsp.data);
        var qc_milestoneArr = data.qc_milestone
            ? data.qc_milestone.split(",")
            : ["100"];
        qc_milestoneArr.forEach((v, i) => {
            if (v <= percomp) {
                var qc_check =
                    rsp.data.filter(function (el) {
                        return el.planning_progress_per == v;
                    }) || [];
                if (qc_check.length == 0) {
                    onloadQCCreact(v);
                }
            }
        });
    };
    const onloadQCCreact = async (v) => {
        if (data.qc_code == null) return;
        let d = {
            header: {
                pre_event: route.params.pre_event,
                pre_event2: route.params.pre_event2,
                form_code: data.qc_code,
                form_type: "P",
                check_times: 0,
                doc_date: moment().toDate(), //today
                wo_no: "",
                vendor_code: "", //Vendor,
                loccode: route.params.taskid,
                planning_progress_per: v,
                qc_group_emp: data.qc_id,
            },
        };
        var url = "qcc/transaction/QcTransaction_QcCreate";
        let rsp = await xt.postServerJson(url, d).then((res) => { });
    };
    const onCopy = () => {
        setProgress_per((data.per_bal || "0").toString());
        setProgress_qty((data.qty_bal || "0").toString());
    };
    const onUpdatetask = async (item) => {
        var amt_ = item.price == 0 ? item.qty : item.amount;
        var pg_amt = item.price == 0 ? item.qty_pg : item.qty_pg * item.price;

        var dataSave = {
            data: {
                qty_progress: item.qty_pg,
                progress_amt: item.price == 0 ? 0 : pg_amt,
                progress_qty: item.qty_pg,
                progress_per: (pg_amt / amt_) * 100,
                progress_w_per: 0,
                pre_event: route.params.pre_event,
                pre_event2: route.params.pre_event2,
                plan_code: route.params.plan_code,
                taskid: route.params.taskid,
            },
        };
        var url = "Planning/Planning/Planning_onUpdateProgressSum";
        let rsp = await xt
            .postServerJson(url, dataSave)
            .then((res) => {
                if (res.success) {
                }
            })
            .catch((err) => {
                xt.Alert(err.response);
            });
    };
    const onCheckSave = async () => {

        if (parseFloat(progress_qty) > parseFloat(data.qty_bal)) {
            xt.Alert(
                "ไม่สามารถ Update Progress ได้ เนื่องจาก Progress(Q'ty)  เกิน Balance(Q'ty) กรุณาเเก้ไข้ Progress(Q'ty) ใหม่"
            );
            return;
        }

        if (parseFloat(progress_per) > parseFloat(data.per_bal)) {
            xt.Alert(
                "ไม่สามารถ Update Progress ได้ เนื่องจาก Progress(%)  เกิน Progress Balance(%) กรุณาเเก้ไข้ Progress Progress(%) ใหม่"
            );
            return;
        }

        var url =
            "Planning/Planning/onLoadTaskprogress?pre_event2=" +
            route.params.pre_event2 +
            "&pre_event=" +
            route.params.pre_event +
            "&plan_code=" +
            route.params.plan_code +
            "&taskid=" +
            route.params.taskid;

        let rsp = await xt.getServer(url);

        if (parseFloat(rsp.data.per_bal) < parseFloat(progress_per)) {
            xt.Alert(
                "ไม่สามารถ Update progress ได้ progress จะต้องไม่เกิน " +
                rsp.data.per_bal +
                "%"
            );
            return;
        }

        //alert(rsp.data.per_bal);
        setProgress_qty_old(
            (parseFloat(progress_qty_old) || 0) + (parseFloat(progress_qty) || 0)
        );
        setProgress_per_old(
            (parseFloat(progress_per_old) || 0) + (parseFloat(progress_per) || 0)
        );
        onSave();
    };
    const onSave = async () => {
        if (
            !remark &&
            !parseFloat(progress_qty) &&
            !parseFloat(progress_qty_old) &&
            !incidence_code
        ) {
            xt.Alert("กรุณากรอก progress , Incidence หรือ Remark");
            return;
        }
        setDataloadding(true);
        var dataSave = {
            data: {
                itemno: itemno,
                progress_date: new Date(),
                qty: parseFloat(progress_qty) || 0,
                desc_code: incidence_code,
                pre_event: route.params.pre_event,
                pre_event2: route.params.pre_event2,
                plan_code: route.params.plan_code,
                wbsid: route.params.taskid,
                areacode: "001",
                remark: remark,
                empno: "",
                pg_type: "1",
            },
        };
        console.log("dataSave", dataSave);

        var url = "Planning/Planning/Planning_onUpdateProgress";
        let res = await xt.postServerJson(url, dataSave)
        // .then(async (res) => {
        //   console.log("Planning_onUpdateProgress", res);

        //   if (res.success) {
        //     // console.log("route.params", route.params);

        //     setItemno(res.data.itemno);
        //     xt.Alert("Data update progress Successfully");

        //     //  console.log("rsp_summary", rsp_summary);

        //     await onloadData();
        //     await onUpdateItem();
        //     console.log("update_summary_planByProject");
        //     let url = `Planning/Plans/update_summary_planByProject?pre_event=${route.params.pre_event}& plan_code=${route.params.plan_code}`;
        //     await xt.getServer(url);
        //     setDataloadding(false);
        //   }
        // })
        // .catch((err) => {
        //   xt.Alert(err.response);
        // });

        console.log("Planning_onUpdateProgress", res);
        if (res.success) {
            // console.log("route.params", route.params);
            setItemno(res.data.itemno);
            xt.Alert("Data update progress Successfully");
            //  console.log("rsp_summary", rsp_summary);
            await onloadData();
            await onUpdateItem();
            // console.log("update_summary_planByProject");
            let url = `Planning/Plans/update_summary_planByProject?pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code}`;
            let getSum = await xt.getServer(url);
            // console.log("update_summary_planByProject", getSum);
            // console.log("route.params", route.params);
            setDataloadding(false);
        }
    };
    const onRemoveImgConf = async (item, index) => {
        Alert.alert(
            "",
            "คุณต้องการลบรูปภาพ",
            [
                {
                    text: "ไม่ใช่",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: "ใช่", onPress: () => onRemoveImg(item, index) },
            ],
            { cancelable: false }
        );
    };
    const onRemoveImg = async (item, index) => {
        var url =
            "Planning/Planning/onPicDelete?del=" +
            item.itemno +
            "&pre_event=" +
            route.params.pre_event +
            "&plancode=" +
            route.params.plan_code +
            "&doctype=TASK&taskid=" +
            route.params.taskid;
        let rsp = await xt.getServer(url);
        onloadPhoto(dataServer);
    };
    const onloadPhoto = async (dataServer) => {
        // console.log("itemno", itemno);
        if (!itemno) return;
        let url = `Planning/Planning/Planning_task_history_Photo?pre_event2=${route.params.pre_event2
            }&pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code
            }&taskid=${route.params.taskid}&refitemno=${itemno}&date=${moment(
                new Date()
            ).format("DD-MM-YYYY")}`;
        // console.log("uri", url);

        let rsp = await xt.getServer(url);
        // console.log("ggg", dataServer + "api/file/download/?download=false&id=" + "762045590926210cb0efbcc805ea23e63a92d7a782a4578c84a1bc7d7a5e4a39e443f1b55809073cb6e8025d7b49beb12b06b46019481a074fb8cf2558dedafa7535d7019c88678e64dc403a825e9a08c19402977ab7d0f27f9dd030f1f239728c7cf31562b5152e662e758d2d6faaf45bf0ea996709632470231e65cd0b7b96d9dfe12186ce75a3dd8a06e19a9a62a9.ec6be52bc8b392b28f83a3dc417423ea3e9f1bb4");

        let dataR = rsp.data;
        console.log("dataR", dataR);

        let extension_ = [
            "mp4",
            "m4a",
            "m4v",
            "f4v",
            "f4a",
            "m4b",
            "m4r",
            "f4b",
            "mov",
            "3gp",
            "3gp2",
            "3g2",
            "3gpp",
            "3gpp2",
            "flv",
        ];

        dataR.forEach((v, i) => {
            let extension = xt.getFileExtension(v.docdesc).toLowerCase();
            (v.site = dataServer),
                (v.type = extension_.includes(extension) ? 1 : 2),
                (v.video_ph = require("../../assets/images/20200605141056.gif"));
            (v.fullsite =
                dataServer + "api/file/download/?download=false&id=" + v.pathto),
                (v.extension = extension);
        });
        console.log("fff", rsp.data);

        setSatapgimg([...rsp.data]);
        //setSatapgimg(rsp.data);
    };
    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
        var dataServer = await getDataStorage("sitevalue_key");
        setDataServer(dataServer);
        onloadPhoto(dataServer);
    };
    const onloadLocation = async () => {
        var latitude = global.latitude;
        var longitude = global.longitude;
        const mangoLoc = await xt.getLocation(latitude, longitude);

        var gps_location =
            ((mangoLoc || []).data[0] || {}).geo_data?.location_fullname || "";
        let gps_location_coordinate = await getDataStorage("gps_location_coordinate")
        // console.log("gps_location_coordinate", gps_location_coordinate);
        setGpsLocation(gps_location)
        setGpsLocationCoordinate(gps_location_coordinate)
    };
    const rendercloseAction = () => (
        <>
            <Icon
                style={{ width: 22, height: 22 }}
                fill="#d63939"
                name="close-outline"
            />
        </>
    );
    const renderCopyAction = () => (
        <>
            <Icon
                style={{ width: 16, height: 16 }}
                fill="#8F9BB3"
                name="copy-outline"
            />
            <Text style={{ marginLeft: 5 }} >
                {lang.copy}
            </Text>
        </>
    );
    const renderImageItem = (info) => (
        <HomeLayout style={{ padding: 5, borderRadius: 0, marginRight: 5 }}>
            <Image
                style={{}}
                source={
                    item.type == 1
                        ? item.video_ph
                        : xt.getimg(dataServer, false, item.pathto)
                }
            />
            <TouchableOpacity
                style={{ backgroundColor: 'red' }}
                onPress={() => onRemoveImgConf(item, index)}
            />
            <TouchableOpacity
                style={{ backgroundColor: 'green' }}
                onPress={() => onSetRemark(item, index)}
            />

            <View style={{}}>
                <Text style={{}}>
                    {lang.img_location} :
                    <Text >{item.gps_location_coordinates}</Text>
                </Text>
                <Text style={{}} numberOfLines={2}>
                    <Text>
                        {lang.remark} :
                    </Text>
                    <Text>
                        {item.remark}
                    </Text>
                </Text>
                <Text style={{}} numberOfLines={2}>
                    <Text  >
                        Date :
                    </Text>
                    <Text>
                        {moment(item.add_dt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                </Text>
            </View>
        </HomeLayout>
    );
    return (
        // < View style={{ flex: 1, backgroundColor: themes == 'light' ? colors.white : colors.back_bg, padding: 10 }} >
        //     {dataemty == false ? (
        //         <>
        //             {/* Status */}
        //             <View style={{ flexDirection: 'row', backgroundColor: themes == 'light' ? colors.white : colors.back_dark }}>
        //                 <Text style={[styles.h5_bold, { marginLeft: 5, fontSize: 16, color: themes == 'light' ? colors.black : colors.white }]}>Status :</Text>
        //                 <View style={{ flexDirection: 'row', width: width * 2 }}>
        //                     <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
        //                         <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>In progress </Text>
        //                     </TouchableOpacity>
        //                     <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
        //                         <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Not Start </Text>
        //                     </TouchableOpacity>
        //                     <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
        //                         <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Delay </Text>
        //                     </TouchableOpacity>
        //                     <TouchableOpacity style={{ backgroundColor: '#8F9BB3', marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
        //                         <Text style={[styles.h5, { marginLeft: 5, fontSize: 14, color: themes == 'light' ? colors.black : colors.white }]}>Overdue </Text>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //             <View style={{ top: '1%', paddingBottom: '5%' }}>
        //                 <FlatList
        //                     data={dataArr}
        //                     renderItem={renderItem}
        //                     initialNumToRender={5}
        //                     maxToRenderPerBatch={5}
        //                     windowSize={10}
        //                 />
        //             </View>
        //         </>
        //     ) : (
        //         <>
        //             {dataloadding == false ? (
        //                 <NoRows />
        //             ) : (
        //                 <LoadingRows />
        //             )}
        //         </>
        //     )}
        // </View>
        <>
        </>
    );
}

