import React, { useEffect, useState } from "react";
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import linq from "js-linq";
//custom link
import MessageBox from "../api/msg";
import $xt from "../api/xtools";
import { apiPasscode } from "../api/authentication";
import BannerImage from "../../assets/images/logo.png";
import LoaddingLayout from "../template/loadding_layout";
import { colors, styles } from "../stylesheet/styles";
import { getSyscode } from '../api/bind_api';
export default function Passcode({ navigation }) {
  const $linq = (arr) => new linq(arr);
  const [isProcess, setProcess] = useState(false);
  const [isPasscode, setPasscode] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let passcode = (await AsyncStorage.getItem("passcode")) || "";
        setPasscode(passcode);
      } catch (ex) {
        MessageBox.Alert(`Error`, ex.toString());
      }
    };
    fetchData();
  }, []);
  const _doNext = async () => {
    let passcode = (isPasscode || "").toUpperCase().trim();
    if ($xt.isEmpty(passcode)) return;

    setPasscode(passcode);
    setProcess(true);
    if ($xt.isEmpty(passcode)) {
      MessageBox.Alert(`Error`, "Please Enter Company Code.");
    }
    try {
      setLoading(true);
      var rsp = await apiPasscode.getIP(passcode);
      console.log("rsp", rsp);
    } catch (ex) {
      console.log("ex", ex);
      MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);

    } finally {
      setLoading(false);
    }
    if (!rsp.success) {
      let msg = await MessageBox.Alert(`Error`, rsp.error);
      msg ? Keyboard.dismiss() : null
    } else {
      // await AsyncStorage.setItem("fromAuth", "Y");
      let newComp = $linq(rsp.data).where(x => !$xt.isEmpty(x.path)).toArray();
      let __baseUrl =
        $linq(newComp)
          .select((x) => x.path)
          .firstOrDefault() || "";
      console.log("rsp.data", __baseUrl);
      await AsyncStorage.setItem("baseUrl", __baseUrl);
      await AsyncStorage.setItem("workplaces", JSON.stringify(newComp));
      await AsyncStorage.setItem("passcode", passcode);
      let xxx = await _getSyscode();
      console.log("xxx", xxx);
      if (xxx) {
        navigation.navigate("Login");
      } else {
        setLoading(false);
      }
    }
    setProcess(false);
  };
  const _getSyscode = async () => {
    let resp = true
    try {
      setLoading(true);
      console.log("hi");
      var checkConfig = await getSyscode();
      console.log("Dd");
      console.log("checkConfig_______", checkConfig);
      global.clientID = checkConfig?.ms_client_id || ""
      await AsyncStorage.setItem("clientID", checkConfig?.ms_client_id || "");

      global.tenetID = checkConfig?.ms_tenant_id || ""
      await AsyncStorage.setItem("tenetID", checkConfig?.ms_tenant_id || "");

    } catch (ex) {
      console.log("ex", ex);

      MessageBox.Alert(`Error`, ex.toString());
      resp = false
    } finally {
      setLoading(false);
    }
    return resp;
  }
  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      {loading ? <LoaddingLayout /> : null}
      <View style={[styles.container_full, { backgroundColor: "#ffffff" }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={{ flex: 1, paddingHorizontal: 30, marginTop: '10%' }}>
            <Image source={BannerImage} style={styles.banner} />
            <View style={{ paddingBottom: 30 }}>
              <Text
                style={[styles.h3, { color: colors.black, textAlign: 'center' }]}
              >
                ป้อนรหัสบริษัท
              </Text>
              <Text style={[styles.h5_14, { marginTop: 15, textAlign: "center", color: colors.red }]}>
                เพื่อดำเนินการต่อโปรดป้อนรหัสบริษัท(Passcode)
              </Text>
            </View>

            <View style={{ marginBottom: 30, }}>
              {/* https://docs.expo.io/guides/icons */}
              {/* <FontAwesome5 name="lock" style={styles.iconLock} /> */}

              {/* https://reactnative.dev/docs/textinput */}
              <Text style={[styles.h3, { fontSize: 17 }]}>Passcode</Text>
              <TextInput
                autoCorrect={false}
                style={[styles.inputPasscode, { fontSize: isPasscode ? 18 : 14, textAlign: isPasscode ? 'center' : 'right' }]}
                value={isPasscode}
                placeholder="กรอก Passcode"
                placeholderTextColor="#929292"
                keyboardType="default"
                onChangeText={(passcode) => setPasscode(passcode)}
              />
              <TouchableOpacity
                disabled={!isPasscode ? true : false}
                style={[styles.buttonLogin, { opacity: !isPasscode ? 0.7 : 1 }]}
                onPress={() => _doNext()}
              >
                <Text style={[styles.h5_14, styles.buttonLoginText]}>ตกลง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
}