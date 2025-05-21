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
  SafeAreaView,

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
import $xt from "../../api/xtools";
import { getSyscode } from "../../api/bind_api";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from "expo-image-manipulator";


export default function ProgressScreen({ route, navigation }) {
  const [lang, setLang] = useState({});
  const [themes, setthemes] = useState("");

  const { width, height } = Dimensions.get('window');

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


  // const multilineInputState = useInputState();
  ///// new /////
  const [image, setImage] = useState(null);
  const [sizecon, setSizecon] = useState(route.params.sizefile || 0);
  const [sizepg, setSizepg] = useState(route.params.pgsizefile || 0);

  const [isGpsLocation, setGpsLocation] = useState("");
  const [isGpsLocationCoordinate, setGpsLocationCoordinate] = useState("");


  const headerLeft = () => (
    <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", }}
        onPress={() => goBack()}
      >
        <Ionicons name="chevron-back" size={24} color={themes == 'light' ? colors.black : colors.white} />
      </TouchableOpacity>
    </View>
  );
  const headerRight = () => {
    return (
      <>
        <TouchableOpacity onPress={() => HousegoBack()}>
          <FontAwesome name="home" size={24} color={(themes == 'light') ? "black" : "#fff"} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      </>
    )
  }

  const HousegoBack = () => {
    // let nerArr = [];
    navigation.navigate("Tasks", {
      // dataTaskSearch: nerArr,
      dataAgeSearch: 1,
      pre_event: route.params.pre_event,
      pre_event2: route.params.pre_event2,
      plan_code: route.params.plan_code,
      point: "load",
      managerplan: route.params.manager,
      decimal: route.params.decimal,
    })
  }

  useEffect(() => { // เริ่มต้นการทำงาน
    getLangDF();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Progress",
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
      headerRight: () => headerRight(),
    });
  }, [navigation, themes]);

  const goBack = () => {
    if (route.params.navfrom == 'NOTI') {
      navigation.goBack();
    } else {
      navigation.navigate('Tasks', {
        dataTaskSearch: route.params.dataTask,
        dataAgeSearch: route.params.dataAge,
        point: "search",
        pre_event: route.params.pre_event,
        pre_event2: route.params.pre_event2,
        plan_code: route.params.plan_code,
        managerplan: route.params.manager,
        decimal: route.params.decimal,
      });
    }
  }

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
  }
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
  }
  const pickImage = async () => {
    if (!itemno) return;
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      // selectionLimit: 5,
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
  }
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

  const onCameraVideo = () => {
    if (!itemno) return;
    let item = route.params;
    item.itemno = itemno;
    item.sizefile = data.sizefile;
    item.control_sizefile = data.control_sizefile;
    item.pgsizefile = pgsizefile;
    navigation && navigation.navigate("CameraVideo", item);
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
  }
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
        // (v.video_ph = require("../../assets/images/20200605141056.gif"));
        (v.fullsite =
          dataServer + "api/file/download/?download=false&id=" + v.pathto),
        (v.extension = extension);
    });
    console.log("fff", rsp.data);

    setSatapgimg(rsp.data);
    //setSatapgimg(rsp.data);
  };

  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);
    var dataServer = await getDataStorage("sitevalue_key");
    setDataServer(dataServer);
    onloadPhoto(dataServer);


    let themes_key = await getDataStorage("themes_ppn") || "light";
    setthemes(themes_key)
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
  }
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

  const renderImage = ({ item, index }) => (
    <View style={localStyles.imageContainer}>
      <Image
        style={localStyles.image}
        source={
          item.type == 1
            ? { uri: 'https://via.placeholder.com/150x100' } // Placeholder for video
            : { uri: dataServer + "api/file/download/?download=false&id=" + item.pathto }
        }
      />
      <View style={localStyles.imageActions}>
        <TouchableOpacity
          style={[localStyles.imageButton, localStyles.deleteButton]}
          onPress={() => onRemoveImgConf(item, index)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[localStyles.imageButton, localStyles.remarkButton]}
          onPress={() => onSetRemark(item, index)}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={localStyles.imageInfo}>
        <Text style={localStyles.imageInfoText}>
          <Text style={{ fontWeight: 'bold' }}>
            {lang.img_location || 'Location'}:
          </Text> {item.gps_location_coordinates}
        </Text>
        <Text style={localStyles.imageInfoText} numberOfLines={2}>
          <Text style={{ fontWeight: 'bold' }}>
            {lang.remark || 'Remark'}:
          </Text> {item.remark}
        </Text>
        <Text style={localStyles.imageInfoText}>
          <Text style={{ fontWeight: 'bold' }}>
            Date:
          </Text> {moment(item.add_dt).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );

  if (dataloadding) {
    return (
      <View style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={localStyles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[localStyles.container, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>

      <ScrollView style={localStyles.scrollView}>
        {/* วันที่และปุ่มประวัติ */}
        <View style={[localStyles.dateHistoryRow, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
          <Text style={[localStyles.dateText, { color: themes == 'light' ? colors.black : colors.white }]}>
            {xt.getDate(new Date(), lang.lang_wh)}
          </Text>
          <TouchableOpacity
            style={localStyles.historyButton}
            onPress={onhistory}
          >
            <Text style={localStyles.historyButtonText}>
              {lang.history || 'ประวัติ'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ชื่องาน */}
        <View style={[localStyles.taskRow, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
          <Text style={[localStyles.taskText, { color: themes == 'light' ? colors.black : colors.white }]} numberOfLines={2}>
            {data.wbs_id} : {data.taskname} {data.unitname ? `(${data.unitname})` : ''}
          </Text>
          <TouchableOpacity onPress={onHeadertask}>
            <Ionicons name="chevron-forward" size={24} color={themes == 'light' ? colors.black : colors.white} />
          </TouchableOpacity>
        </View>

        {/* ความคืบหน้าปัจจุบัน */}
        <View style={[localStyles.progressRow, { backgroundColor: themes === 'light' ? colors.white : colors.blueGreen_light }]}>
          <View style={localStyles.progressBox}>
            <Text style={[localStyles.progressLabel, { color: themes == 'light' ? colors.black : colors.white }]} >
              {lang.actual || 'ความคืบหน้าจริง'} ({lang.qty || 'จำนวน'})
            </Text>
            <Text style={localStyles.progressValue}>
              {xt.dec(data.qty_pg, route.params?.decimal || global.decimal)}
            </Text>
          </View>
          <View style={localStyles.progressBox}>
            <Text style={[localStyles.progressLabel, { color: themes == 'light' ? colors.black : colors.white }]}>
              {lang.actual || 'ความคืบหน้าจริง'} (%)
            </Text>
            <Text style={localStyles.progressValue}>
              {xt.dec(data.percomp, route.params?.decimal || global.decimal)}
            </Text>
          </View>
        </View>

        {/* ยอดคงเหลือ */}
        <View style={[localStyles.balanceRow, { backgroundColor: themes === 'light' ? colors.white : colors.blue_light }]}>
          <View style={localStyles.balanceBox}>
            <Text style={[localStyles.balanceLabel, { color: themes == 'light' ? colors.black : colors.white }]}>
              {lang.balance || 'คงเหลือ'} ({lang.qty || 'จำนวน'})
            </Text>
            <Text style={localStyles.balanceValue}>
              {xt.dec(data.qty_bal, route.params?.decimal || global.decimal)}
            </Text>
            <TouchableOpacity
              style={localStyles.copyButton}
              onPress={onCopy}
            >
              <Feather name="copy" size={16} color={colors.grey_t} />
              <Text style={localStyles.copyText}>{lang.copy || 'คัดลอก'}</Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.balanceBox}>
            <Text style={[localStyles.balanceLabel, { color: themes == 'light' ? colors.black : colors.white }]}>
              {lang.balance || 'คงเหลือ'} (%)
            </Text>
            <Text style={localStyles.balanceValue}>
              {xt.dec(data.per_bal, route.params?.decimal || global.decimal)}
            </Text>
            <TouchableOpacity
              style={localStyles.copyButton}
              onPress={onCopy}
            >
              <Feather name="copy" size={16} color={colors.grey_t} />
              <Text style={localStyles.copyText}>{lang.copy || 'คัดลอก'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* อัพเดทความคืบหน้าใหม่ */}
        <View style={[localStyles.newProgressRow, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
          <View style={localStyles.newProgressBox}>
            <Text style={localStyles.newProgressLabel}>
              {lang.new_progress || 'ความคืบหน้าใหม่'} ({lang.qty || 'จำนวน'})
            </Text>
            <TouchableOpacity
              style={localStyles.inputContainer}
              onPress={() => onKeyboard(progress_qty, "progress_qty")}
            >
              <Text style={localStyles.progressInput}>
                {xt.dec(progress_qty, route.params?.decimal || global.decimal) || "0.00"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.newProgressBox}>
            <Text style={localStyles.newProgressLabel}>
              {lang.new_progress || 'ความคืบหน้าใหม่'} (%)
            </Text>
            <TouchableOpacity
              style={localStyles.inputContainer}
              onPress={() => onKeyboard(progress_per, "progress_per")}
            >
              <Text style={localStyles.progressInput}>
                {xt.dec(progress_per, route.params?.decimal || global.decimal) || "0.00"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ปัญหาที่พบ */}
        <View style={[localStyles.sectionContainer, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
          <Text style={[localStyles.sectionLabel,{ color: themes == 'light' ? colors.black : colors.white }]}>
            {lang.incidence || 'ปัญหาที่พบ'}
          </Text>
          <View style={[localStyles.incidenceContainer, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
            {incidence && (
              <TouchableOpacity
                style={localStyles.clearIncidence}
                onPress={() => {
                  setIncidence(null);
                  setIncidence_code(null);
                }}
              >
                <Ionicons name="close-circle" size={20} color={colors.red} />
              </TouchableOpacity>
            )}
            <Text style={[
              localStyles.incidenceText,
              !incidence && localStyles.placeholderText
            ]}>
              {incidence || `${lang.select || 'เลือก'} ${lang.incidence || 'ปัญหาที่พบ'}`}
            </Text>
            <TouchableOpacity onPress={onIncidence}>
              <Ionicons name="chevron-forward" size={24} color={colors.grey_t} />
            </TouchableOpacity>
          </View>
        </View>

        {/* หมายเหตุ */}
        <View style={[localStyles.sectionContainer, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
          <Text style={[localStyles.sectionLabel,{ color: themes == 'light' ? colors.black : colors.white }]}>
            {lang.remark || 'หมายเหตุ'}
          </Text>
          <TextInput
            style={localStyles.remarkInput}
            multiline={true}
            value={remark}
            placeholder={lang.enter_remark || "กรอกหมายเหตุที่นี่"}
            placeholderTextColor={colors.grey_t}
            onChangeText={setRemark}
          />
        </View>

        {/* แนบรูปภาพ - แสดงถ้า PPN_UN_PGI_ALLOW ไม่ใช่ N */}
        {route.params?.config?.PPN_UN_PGI_ALLOW !== "N" && (
          <View style={[localStyles.attachmentSection, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
            <View style={localStyles.attachmentHeader}>
              <Text style={[localStyles.attachmentTitle,{ color: themes == 'light' ? colors.black : colors.white }]}>{lang.text_img || 'รูปภาพ/วิดีโอ'}</Text>
              <ScrollView horizontal style={localStyles.attachmentButtons}>
                {route.params?.config?.PPN_UPLOAD_SELECT_ALLOW !== "N" && (
                  <TouchableOpacity
                    style={[localStyles.attachButton, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}
                    onPress={pickImage}
                  >
                    <Ionicons name="image-outline" size={20} color={colors.grey_t} />
                    <Text style={[localStyles.attachButtonText,{ color: themes == 'light' ? colors.black : colors.white }]}>
                      {lang.select_img || 'เลือกรูป'}
                    </Text>
                  </TouchableOpacity>
                )}

                {route.params?.config?.PPN_UPLOAD_CAMARA_ALLOW !== "N" && (
                  <TouchableOpacity
                    style={[localStyles.attachButton, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}
                    onPress={onCamara}
                  >
                    <Ionicons name="camera-outline" size={20} color={colors.grey_t} />
                    <Text style={[localStyles.attachButtonText,{ color: themes == 'light' ? colors.black : colors.white }]}>
                      {lang.camara_img || 'ถ่ายรูป'}
                    </Text>
                  </TouchableOpacity>
                )}

                {route.params?.config?.PPN_UPLOAD_VIDEO_ALLOW !== "N" && (
                  <TouchableOpacity
                    style={[localStyles.attachButton, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}
                    onPress={onCameraVideo}
                    disabled={isBase64 === "Y"}
                  >
                    <Ionicons name="videocam-outline" size={20} color={colors.grey_t} />
                    <Text style={[localStyles.attachButtonText,{ color: themes == 'light' ? colors.black : colors.white }]}>
                      {lang.take_video || 'วิดีโอ'}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            {datapgimg.length != 0 ? (
              <FlatList
                data={datapgimg}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={localStyles.imageList}
              />
            ) : (
              <View style={localStyles.noImages}>
                {/* <NoRows /> */}
                <Text style={localStyles.noImagesText}>
                  {lang.no_images || 'ไม่มีรูปภาพ'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ปุ่มบันทึก */}
      <TouchableOpacity
        style={localStyles.saveButton}
        onPress={onCheckSave}
        disabled={dataloadding}
      >
        {dataloadding ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={localStyles.saveButtonText}>
            {lang.save || 'บันทึก'}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}



const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.grey_t,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  dateHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 1,
  },
  dateText: {
    fontSize: 14,
  },
  historyButton: {
    backgroundColor: colors.orange,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  progressRow: {
    flexDirection: 'row',
    backgroundColor: '#deeaff',
    marginBottom: 1,
  },
  progressBox: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    // color: colors.black_t,
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.green,
  },
  balanceRow: {
    flexDirection: 'row',
    // backgroundColor: '#fff5e7',
    marginBottom: 1,
  },
  balanceBox: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    // color: colors.black_t,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.orange,
    marginBottom: 5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  copyText: {
    fontSize: 12,
    color: colors.grey_t,
    marginLeft: 5,
  },
  newProgressRow: {
    flexDirection: 'row',
    // backgroundColor: '#fff',
    marginBottom: 8,
  },
  newProgressBox: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newProgressLabel: {
    fontSize: 14,
    color: colors.black_t,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  progressInput: {
    fontSize: 24,
    color: colors.blue_t,
  },
  sectionContainer: {
    // backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 15,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  incidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 12,
    // backgroundColor: '#f9f9f9',
  },
  clearIncidence: {
    marginRight: 10,
  },
  incidenceText: {
    flex: 1,
    fontSize: 15,
  },
  placeholderText: {
    color: colors.grey_t,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 12,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  attachmentSection: {
    // backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 100, // Extra padding at bottom to account for save button
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  attachmentTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  attachmentButtons: {
    flexDirection: 'row',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 8,
  },
  attachButtonText: {
    fontSize: 12,
    marginLeft: 5,
  },
  imageList: {
    marginTop: 5,
  },
  imageContainer: {
    marginRight: 15,
    marginBottom: 10,
    width: 180,
  },
  image: {
    width: 180,
    height: 120,
    borderRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  imageButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: 'rgba(200, 35, 63, 0.8)',
  },
  remarkButton: {
    backgroundColor: 'rgba(56, 179, 74, 0.8)',
  },
  imageInfo: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageInfoText: {
    fontSize: 12,
    marginBottom: 3,
  },
  noImages: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noImagesText: {
    marginTop: 10,
    color: colors.grey_t,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});