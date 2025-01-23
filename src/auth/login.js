import React, { useState, useMemo } from "react";
import {
  Text,
  TextInput,
  Platform,
  View,
  Image,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TouchableOpacity
} from "react-native";
import {
  FontAwesome5,
  Foundation,
  FontAwesome,
  Ionicons,
  Entypo
} from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as WebBrowser from 'expo-web-browser';
// import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from 'expo-secure-store';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import Ripple from "react-native-material-ripple";
import linq from "js-linq";
import { styles, colors } from "../stylesheet/styles";
import MessageBox from "../api/msg";
import LoaddingLayout from "../template/loadding_layout";
import { getSyscode } from '../api/bind_api';
import { apiPasscode, apiAuth } from "../api/authentication";
import { xt, getDataStorage, setDataStorage } from "../api/service";
import $xt from "../api/xtools";
import BannerImage from "../../assets/images/logo.png";
import { color } from "../stylesheet/colors";
export default function Login({ navigation, route }) {
  const $linq = (arr) => new linq(arr);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const video = React.useRef(null);
  const [isDatabase, setDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSite, setSite] = useState("");
  const [isUsername, setUsername] = useState("");
  const [isPassword, setPassword] = useState("");
  const [isMaincode, setMaincode] = useState("");
  const [isCompany, setCompany] = useState("");
  const [isWorkplace, setWorkplace] = useState("");
  const [isBasePath, setBasePath] = useState("");
  const [isCompanyList, setCompanyList] = useState([]);
  const [status, setStatus] = React.useState({});
  const [isReady, setReady] = useState(false);
  const [isConfigSinOn, setConfigSinOn] = useState(false);
  const [openDropdownDatabase, setOpenDropdownDatabase] = useState(false);
  const [valueDropdownDatabase, setValueDropdownDatabase] = useState(null);
  const [isLoadReady, setLoadReady] = useState(false);
  const [showpassword, setshowpassword] = useState(true);
  const [valueDropdownCompany, setValueDropdownCompany] = useState(null);
  const [isClientID, setClientID] = useState(null);
  const [isTenetID, setTenetID] = useState(null);
  const [usertype, setUsertype] = useState("");
  const [lang, setLang] = useState({});
  const [faceid, setFaceid] = useState(false);
  const [pincodeppn, setPincodeppn] = useState(false);
  const [sitevalue, setSitevalue] = useState();
  const [isSite_text, setSite_text] = useState();

  const [isMainnamecompany, setMainnameCompany] = useState("");

  const redirectUri = makeRedirectUri({
    scheme: 'mangoqcmapp',
    path: 'auth' //ต้องปิดถ้าจะเทสกับตัว local
  });
  const [isToken, setToken] = useState("")
  useFocusEffect(
    React.useCallback(() => {
      const loadConfig = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
        try {
          const storedClientID = await AsyncStorage.getItem("clientID");
          const storedTenetID = await AsyncStorage.getItem("tenetID");
          setClientID(global.clientID || storedClientID);
          setTenetID(global.tenetID || storedTenetID);
        } catch (error) {
          console.error("Error loading clientID or tenetID:", error);
        }
      };
      const fetchData = async () => {
        // try {
        let rsp = (await AsyncStorage.getItem("passcode")) || "";
        // console.log("passcode", passcode);
        let company_workplace = JSON.parse(
          (await AsyncStorage.getItem("workplaces")) || []
        );
        let newComp = $linq(company_workplace).where(x => x.path != "").toArray();
        console.log("newComp", newComp);
        for (let x of newComp) {
          x.label = x.type;
          x.value = x.path;
        }
        // console.log("newComp", newComp);
        let site =
          $linq(newComp)
            .select((x) => x.path)
            .firstOrDefault() || "";
        let type =
          $linq(newComp)
            .select((x) => x.type)
            .firstOrDefault() || "";
        let basePath =
          $linq(newComp)
            .select((x) => x.basePath)
            .firstOrDefault() || "";
        // if (rsp.error) {
        //   MessageBox.Alert(`Error`, rsp.error);
        // } else {
        // console.log("site", site, "type", type, "basePath", basePath);
        setDatabase(newComp);
        setValueDropdownDatabase(newComp[0].value);

        // set Site
        setSitevalue(newComp.length > 0 ? newComp[0]?.value : "");
        setSite_text(newComp.length > 0 ? newComp[0]?.label : "");
        setDataStorage('site_key', newComp.length > 0 ? newComp[0]?.type : "");
        setDataStorage('sitevalue_key', newComp.length > 0 ? newComp[0]?.value : "");

        setSite(site);
        setWorkplace(type);
        setBasePath(basePath);
        // setCompanyList(listCompany);

        _getCompany(newComp[0]);
        setSite_text(newComp[0].label)
        setReady(true);
      };
      loadConfig();
      fetchData();
      getLangDF();

    }, [route])
  );
  // Endpoint
  const discovery = useAutoDiscovery(
    `https://login.microsoftonline.com/${isTenetID}/v2.0`,
  );
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: isClientID,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri: makeRedirectUri({
        scheme: 'mangoqcmapp',
        path: 'auth',
      }),
    },
    discovery,
  );
  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);
    let themes_key = await getDataStorage("themes_ppn") || "light";
    // setthemes(themes_key)
    let passcode_key = (await getDataStorage("passcode") || "");
    console.log(passcode_key, "passcode_key");

    let usertype_key = (await getDataStorage("usertype")) || "";
    let pincode_key = await getDataStorage("pincode_ppn");
    let pincodeval_key = (await getDataStorage("pincodeval_ppn")) || "";
    let login_UP = (await getDataStorage("login_UP")) || "";
    let faceid_key = (await getDataStorage("faceid_ppn")) || "false";
    setFaceid(faceid_key == "false" ? false : true);
    setPincodeppn(pincode_key == "false" ? false : true);
    console.log(isConfigSinOn, 'isConfigSinOn');

    try {
      var checkConfig = await getSyscode();
      // var checkConfig = true;
    } catch (ex) {
      await $xt.sleep(200);
      let msg = await MessageBox.Alert(`Error`, ex.toString(), "OK");
      msg ? setLoading(false) : null;
    }

    if (pincode_key == "true" && pincodeval_key != "" && login_UP == "N" && checkConfig?.single_sign_ms == "N") {
      navigation && navigation.navigate("Pincode");
    } else {
      let faceid_up = (await getDataStorage("faceid_UP")) || "";
      if (faceid_up == "N") {
        onCheckVersion(lang_);
      }
    }
    if (xt.isEmpty(passcode_key)) {
      setLoading(false);
      navigation && navigation.navigate("PassCode");
    }
  };
  const getUsertype = async (type) => {
    setUsertype(type);
    await AsyncStorage.setItem('usertype', type);
  };
  const _getCompany = async (item, type) => {
    if ($xt.isEmpty(item.path)) return;
    try {
      setLoading(true);
      var rsp = await apiPasscode.getCompany(item.path);
      console.log("rsp", rsp);
    } catch (ex) {
      MessageBox.Alert(`Error`, ex);
    } finally {
      setLoading(false);
    }
    if (!rsp.success) {
      MessageBox.Alert(`Error`, rsp.error);
    } else {
      for (let x of rsp.data) {
        x.label = x.mainname;
        x.value = x.maincode;
      }
      const companies = rsp.data.map((item) => {
        return {
          label: item.mainname,
          key: item.maincode,
        }
      });
      setMaincode(valueDropdownCompany);
      setCompanyList(rsp.data);
      setValueDropdownCompany(rsp.data[0].value);
      setMainnameCompany(rsp.data[0].label)
      setDataStorage('company_key', rsp.data[0].mainname);
      setDataStorage('companyvalue_key', rsp.data[0].value);
      await AsyncStorage.setItem("baseUrl", item.path);
      await AsyncStorage.setItem("compType", item.type);
      await AsyncStorage.setItem("companies", JSON.stringify(companies));
      try {
        var checkConfig = await getSyscode();
        // var checkConfig = true;
      } catch (ex) {
        await $xt.sleep(200);
        let msg = await MessageBox.Alert(`Error`, ex.toString(), "OK");
        msg ? setLoading(false) : null;
      }
      console.log("checkConfig", checkConfig?.single_sign_ms);
      if (checkConfig?.single_sign_ms == "Y") {
        setConfigSinOn(true)
        await AsyncStorage.setItem("configSinOn", "Y");
      } else {
        setConfigSinOn(false)
        await AsyncStorage.setItem("configSinOn", "N");
      }
      setLoadReady(true)
    }
  };
  const onCheckVersion = async (lang_) => {
    try {
      const check = await checkVersion({
        version: AppInfoService.getVersion(), // app local version
        iosStoreURL: "https://apps.apple.com/us/app/mango-plan/id1528038762",
        androidStoreURL:
          "https://play.google.com/store/apps/details?id=com.mangoconsultant.mango.plan",
        country: "jp", // default value is 'jp'
      });
      if (check.result === "new") {
        let day1 = (await getDataStorage("checkVersion")) || "";
        let day2 = moment(new Date()).format("YYMD");
        if (parseInt(day2) != parseInt(day1)) {
          navigation && navigation.navigate("Version");
        } else {
          onMgAuthentication(lang_);
        }
      } else {
        onMgAuthentication(lang_);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // const _doNext = async (accessToken) => {
  //   console.log("db", valueDropdownCompany, isUsername, isPassword);

  //   if(xt.isEmpty(usertype)){
  //     MessageBox.Alert(`Error`, lang.please_select_type.toString(), "OK");
  //     return;
  //   }



  //   let theme = { head: "#0F1E43", body: colors.white };
  //   let token_push = (await AsyncStorage.getItem("token_push")) || "";
  //   console.log("isToken_", accessToken);
  //   await AsyncStorage.setItem("theme", JSON.stringify(theme));
  //   try {
  //     setLoading(true);
  //     console.log("valueDropdownCompany:", valueDropdownCompany,);
  //     console.log("$xt.isEmpty(accessToken) ? isUsername : null", $xt.isEmpty(accessToken) ? isUsername : null);
  //     console.log(" $xt.isEmpty(accessToken) ? isPassword : null", $xt.isEmpty(accessToken) ? isPassword : null);
  //     console.log("token_push", token_push);
  //     console.log("accessToken",);
  //     var rsp = await apiAuth.login(
  //       valueDropdownCompany,
  //       $xt.isEmpty(accessToken) ? isUsername : null,
  //       $xt.isEmpty(accessToken) ? isPassword : null,
  //       token_push,
  //       accessToken
  //     );
  //     console.log("rsp", rsp);
  //     console.log("token_push", token_push);
  //   } catch (ex) {
  //     await $xt.sleep(200);
  //     MessageBox.Alert(`Error`, ex.toString());
  //   } finally {
  //     setLoading(false);
  //   }
  //   if (!rsp.success) {
  //     if (rsp.error?.indexOf('Request OTP;') === 0) {
  //       // console.log("if (resp.error?.indexOf('Request OTP;') === 0) {");
  //       let email = rsp.error.split(';')[1]?.toLowerCase() || "";
  //       if ($xt.isEmpty(email)) {
  //         MessageBox.Alert(`User ไม่ได้ระบุ E-mail`, `กรุณาติดต่อ System Admin\n เพื่อทำการเพิ่มข้อมูล E-mail`);
  //       } else {
  //         await SecureStore.setItemAsync("username", isUsername);
  //         await SecureStore.setItemAsync("password", isPassword);
  //         await AsyncStorage.multiSet([
  //           ["maincode", valueDropdownCompany] || "",
  //           ["workplace", isWorkplace || "Production"],
  //         ]);
  //         let authData = {
  //           maincode: valueDropdownCompany,
  //           userid: isUsername,
  //           password: isPassword,
  //           email,
  //           signature: Math.random().toString()
  //         }
  //         navigation.push("OtpAuth", { authData })
  //       }
  //     } else {
  //       MessageBox.Alert(`Error`, rsp?.error);
  //     }
  //   } else {
  //     await AsyncStorage.setItem("fromAuth", "Y");
  //     await SecureStore.setItemAsync("username", isUsername);
  //     await SecureStore.setItemAsync("password", isPassword);
  //     await AsyncStorage.multiSet([
  //       ["maincode", valueDropdownCompany] || "",
  //       ["workplace", isWorkplace || "Production"],
  //     ]);
  //     let mainName = $linq(isCompanyList)
  //       .where((x) => x.maincode == valueDropdownCompany)
  //       .select((y) => y.mainname)
  //       .firstOrDefault(); // cashFlow
  //     await AsyncStorage.setItem("mango_auth", rsp.data);
  //     await AsyncStorage.setItem("mainname", mainName); // cashFlow
  //     navigation.reset({
  //       index: 1,
  //       routes: [{ name: global.home_page }],
  //     });
  //   }
  // };
  const onLogin = async (faceid_wh, login_param, accessToken) => {
    console.log(usertype, "usertype****");
    console.log(isUsername, 'username');
    console.log(isPassword, 'password');
    console.log(valueDropdownCompany, 'companyvalue');
    console.log(sitevalue, "sitevalue");


    if ($xt.isEmpty(usertype)) {
      MessageBox.Alert(`Error`, lang.please_select_type.toString(), "OK");
      console.log(usertype, 'usertype');
      return;
    }

    if (!faceid_wh && ($xt.isEmpty(valueDropdownCompany) || $xt.isEmpty(isUsername) || $xt.isEmpty(isPassword)) && !isConfigSinOn) {
      // xt.Alert(lang.please_login);
      MessageBox.Alert(`Error`, lang.please_login.toString(), "OK");
      return;
    }
    setLoading(true);
    const loginhistory = await getDataStorage("loginhistory");
    // const site_text = await getDataStorage("site_key");
    const isToken_ = (await getDataStorage("token_push") || "");
    console.log(isToken_, "isToken_");

    const url =
      usertype != "Outsource"
        ? "api/public/Login?is_api=Y&app_name=APP"
        : "api/public/LoginOutsource?is_api=Y&app_name=APP";
    const param = faceid_wh
      ? login_param
      : {
        maincode: valueDropdownCompany,
        userid: $xt.isEmpty(accessToken) ? isUsername : null,
        userpass: $xt.isEmpty(accessToken) ? isPassword : null,
        checked: true,
        token_push: isToken_,
        ms_access_token: accessToken || "",
        oauth2: accessToken ? "Y" : "N"
      };
    console.log(param, "param");

    let res = await $xt
      .postServerJson(url, param)
      .then((res) => {
        var token = res.data;
        if (res.success) {
          AsyncStorage.setItem("fromAuth", "Y");
          setDataStorage("token_key", token);
          setDataStorage("usertype_key", usertype);
          setDataStorage("maincode_key", valueDropdownCompany);
          setDataStorage("username_key", isPassword);
          setDataStorage("password_key", isUsername);
          setDataStorage("login_UP", "N");
          setDataStorage("faceid_UP", "N");
          console.log(sitevalue, 'sitevalue');

          let obj = {
            usertype: usertype,
            site: sitevalue,
            site_text: isSite_text,
            maincode: valueDropdownCompany,
            mainname: isMainnamecompany,
            username: isUsername,
            password: isPassword,
            pincode: faceid,
            faceid: faceid,
            pincodeppn: pincodeppn,
          };
          console.log("obj", obj);
          let lg_historyArr = JSON.parse(loginhistory) || [];
          let dataobj = lg_historyArr.filter(function (v) {
            return (
              v.usertype == usertype &&
              v.site == sitevalue &&
              v.maincode == valueDropdownCompany &&
              v.username == isUsername &&
              v.password == isPassword
            );
          }).length;
          console.log("lg_historyArr", lg_historyArr, dataobj);
          if (dataobj == 0) {
            lg_historyArr.push(obj);
            setDataStorage("pincode_ppn", "false");
            setDataStorage("faceid_ppn", "false");
            setDataStorage("pincodeval_ppn", "");
            setDataStorage("loginhistory", JSON.stringify(lg_historyArr));
          }
          setLoading(false);
          navigation &&
            navigation.navigate("Project", {
              site: isSite,
            });
        } else {
          setLoading(false);
          // xt.Alert(res.error);
          MessageBox.Alert(`Error`, res.error.toString(), "OK");
        }
      })
      .catch((err) => {
        setLoading(false);
        // xt.Alert(err.response);
        MessageBox.Alert(`Error`, err.response.toString(), "OK");
      });
  };
  const _logoutPasscode = async () => {
    await AsyncStorage.setItem("fromAuth", "N");
    navigation.reset({
      index: 1,
      routes: [{ name: "Passcode" }],
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 30}
        style={{ flex: 1, backgroundColor: colors.white }}
      >
        {loading ? <LoaddingLayout /> : null}
        <View style={styles.container_full}>
          <StatusBar barStyle={'dark-content'} />
          {isReady && <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  paddingHorizontal: 30,
                  marginTop: "0%",
                  marginBottom: 30,
                  zIndex: 11,
                  ...(Platform.OS !== "android" && {
                    zIndex: 11,
                  }),
                }}
              >
                <Image
                  source={BannerImage}
                  style={[styles.banner, { marginVertical: 0 }]}
                />
                <View style={{ alignItems: "center", marginBottom: 50 }}>
                  <Text style={[styles.h3]}>เข้าสู่ระบบ</Text>
                  <Text style={[styles.h5, { color: colors.red_t }]}>
                    โปรดป้อนข้อมูลให้ครบทุกช่อง
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, height: 40, }}>
                  <TouchableOpacity
                    style={{
                      borderRadius: 30,
                      borderWidth: 1.5,
                      width: 100,
                      justifyContent: 'center',
                      marginRight: 10,
                      backgroundColor: usertype == 'Employee' ? colors.black : colors.white,
                    }}
                    onPress={() => getUsertype('Employee')}
                  >
                    <Text style={[styles.h5_bold, { textAlign: 'center', color: usertype == 'Employee' ? colors.white : colors.black }]}>
                      Employee
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 30,
                      borderWidth: 1.5,
                      width: 100,
                      justifyContent: 'center',
                      backgroundColor: usertype == 'Outsource' ? colors.black : colors.white,
                    }}
                    onPress={() => getUsertype('Outsource')}
                  >
                    <Text style={[styles.h5_bold, { textAlign: 'center', color: usertype == 'Outsource' ? colors.white : colors.black }]}>
                      Outsource
                    </Text>
                  </TouchableOpacity>
                </View>

                <Dropdown
                  style={[styles.dropdown, { marginBottom: 7.5 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={isDatabase}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  // placeholder="Select item"
                  searchPlaceholder="Search..."
                  value={valueDropdownDatabase}
                  onChange={item => {
                    _getCompany(item, "Y");
                    setValueDropdownDatabase(item.value)
                  }}
                  renderLeftIcon={() => (
                    <Ionicons name="layers" size={24} color={colors.black} style={{ paddingRight: 7.5 }} />
                  )}
                />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={isCompanyList}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={valueDropdownCompany}
                  onChange={item => {
                    setValueDropdownCompany(item.value);
                    setMainnameCompany(item.label);
                  }}
                  renderLeftIcon={() => (
                    <FontAwesome name="building-o" size={24} color={colors.black} style={{ paddingRight: 7.5 }} />
                  )}
                />
                {(!isConfigSinOn && isLoadReady) && <>
                  <View style={styles.input}>
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 35,
                        marginVertical: 5,
                        paddingLeft: 8,
                        justifyContent: "center",
                        zIndex: 2,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <FontAwesome5
                        name="user-tie"
                        size={22}
                        color={colors.black}
                      />
                    </View>
                    <TextInput
                      autoCorrect={false}
                      style={[styles.h5, { textAlign: "left" }]}
                      placeholder="ผู้ใช้งาน"
                      placeholderTextColor="#4A556880"
                      onChangeText={(userpass) => setUsername(userpass)}
                    />
                  </View>
                  <View style={[styles.input, { justifyContent: "center" }]}>
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 35,
                        marginVertical: 5,
                        paddingHorizontal: 5,
                        justifyContent: "center",
                        paddingLeft: 8,
                        zIndex: 2,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <Foundation name="key" size={22} color={colors.black} />
                    </View>
                    <TextInput
                      style={[styles.h5, { textAlign: "left" }]}
                      secureTextEntry={showpassword}
                      placeholder="รหัสผ่าน"
                      placeholderTextColor="#4A556880"
                      onChangeText={(userpass) => setPassword(userpass)}
                    />
                    <TouchableOpacity
                      onPress={() => setshowpassword(!showpassword)}
                      style={{
                        alignSelf: "center",
                        position: "absolute",
                        right: 8,
                      }}
                    >{showpassword ? (
                      <Entypo name="eye-with-line" size={20} color={colors.grey} />
                    ) : (
                      <Entypo name="eye" size={20} color={colors.grey} />
                    )}
                    </TouchableOpacity>
                  </View>
                </>
                }
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.footer_login}>
                {isConfigSinOn ? <Ripple
                  rippleColor="#76ff03"
                  rippleOpacity={0.87}
                  rippleDuration={1000}
                  style={[
                    styles.button,
                    {
                      width: "90%",
                      alignItems: "center",
                      backgroundColor: "#38B34A",
                      shadowOpacity: 0,
                    },
                  ]}
                  // onPress={() => {
                  //   console.log('request:', request);
                  //   console.log('discovery:', discovery);
                  //   promptAsync().then((codeResponse) => {
                  //     if (request && codeResponse?.type === 'success' && discovery) {
                  //       exchangeCodeAsync(
                  //         {
                  //           clientId,
                  //           code: codeResponse.params.code,
                  //           extraParams: request.codeVerifier
                  //             ? { code_verifier: request.codeVerifier }
                  //             : undefined,
                  //           redirectUri,
                  //         },
                  //         discovery,
                  //       ).then((res) => {
                  //         console.log("respon", res);
                  //         setToken(res.accessToken);
                  //         _doNext(res.accessToken)
                  //       });
                  //     }
                  //   });
                  // }}
                  onPress={() => {
                    // ตรวจสอบว่า Client ID และ Tenant ID ได้รับการกำหนดค่าหรือไม่
                    if (!isClientID || !isTenetID) {
                      console.error("Client ID หรือ Tenant ID ยังไม่ได้รับการกำหนดค่า");
                      let messageBox = MessageBox.Alert(
                        `Warning`,
                        `เข้าสู่ระบบผิดพลาด กรุณาระบุ Passcode ใหม่อีกครั้ง`,
                        false
                      );
                      if (messageBox) {
                        navigation.navigation("Passcode");
                      }
                      return;
                    }

                    // ตรวจสอบ request และ discovery ว่าถูกต้องหรือไม่
                    if (!request || !discovery) {
                      console.error("Required data is missing. Cannot proceed.");
                      let messageBox = MessageBox.Alert(
                        `Warning`,
                        `เข้าสู่ระบบผิดพลาด กรุณาระบุ Passcode ใหม่อีกครั้ง`,
                        false
                      );
                      if (messageBox) {
                        navigation.navigation("Passcode");
                      }
                      return;
                    }

                    // เริ่มการดำเนินการเข้าสู่ระบบ
                    promptAsync()
                      .then((codeResponse) => {
                        console.log("codeResponse", codeResponse);

                        if (codeResponse?.type === "success") {
                          console.log("Authentication success");

                          // เรียก exchangeCodeAsync พร้อมตรวจสอบค่าที่จำเป็น
                          return exchangeCodeAsync(
                            {
                              clientId: isClientID, // ตรวจสอบให้แน่ใจว่ามีค่าถูกต้อง
                              code: codeResponse.params.code,
                              extraParams: request.codeVerifier
                                ? { code_verifier: request.codeVerifier }
                                : undefined,
                              redirectUri,
                            },
                            discovery
                          );
                        } else {
                          // throw new Error("Authentication was not successful.");
                          // let messageBox = MessageBox.Alert(
                          //   `Error`,
                          //   `Authentication was not successful.`,
                          //   false
                          // );
                          // if (messageBox) {
                          // }
                        }
                      })
                      .then((res) => {
                        console.log("Response:", res);
                        setToken(res.accessToken); // ตั้งค่าทำงานกับ Token ที่ได้รับ
                        _doNext(res.accessToken);
                      })
                      .catch((error) => {
                        // แสดงข้อผิดพลาดเพิ่มเติมที่เกี่ยวข้อง
                        // console.error("An error occurred during authentication:", error);

                        // let messageBox = MessageBox.Alert(
                        //   `Error`,
                        //   `มีข้อผิดพลาดในการเข้าสู่ระบบ: ${error.message}`,
                        //   false
                        // );
                        // if (messageBox) {
                        //   navigation.navigation("Passcode");
                        // }
                      });
                  }}
                >
                  <Text style={[styles.h5, { color: colors.white }]}>
                    {isToken ? "Get User Data" : "Sign in Microsoft"}
                  </Text>
                </Ripple>
                  :
                  <Ripple
                    rippleColor="#76ff03"
                    rippleOpacity={0.87}
                    rippleDuration={1000}
                    style={[
                      styles.button,
                      {
                        width: "90%",
                        alignItems: "center",
                        backgroundColor: "#38B34A",
                        shadowOpacity: 0,
                      },
                    ]}
                    onPress={() => onLogin(false, {}, null)}
                  >
                    <Text style={[styles.h5, { color: colors.white }]}>
                      เข้าสู่ระบบ
                    </Text>
                  </Ripple>
                }
                {/* </TouchableOpacity> */}
                {/* </View> */}
                <Ripple
                  rippleColor="#76ff03"
                  rippleOpacity={0.87}
                  rippleDuration={1000}
                  style={[
                    styles.button,
                    {
                      width: "90%",
                      alignItems: "center",
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: "#38B34A",
                      shadowOpacity: 0,
                    },
                  ]}
                  onPress={() => _logoutPasscode()}
                >
                  <Text style={[styles.h5, { color: "#38B34A" }]}>
                    เปลี่ยนรหัสบริษัท
                  </Text>
                </Ripple>
              </View>
            </TouchableWithoutFeedback>
          </>}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
