import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ImageBackground, Image, Platform } from "react-native";
import Modal from "react-native-modal";
import { colors, styles } from "../../src/stylesheet/styles";
import * as Linking from "expo-linking";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
//checkversion
import checkVersion from 'react-native-store-version';
import { expo } from '../../app.json';

import $xt from "../api/xtools";
import AlertImage from '../../assets/banner-alert.png'
import BannerAlert from "../../assets/bg-alert.png"
function UpdateVersion({ }) {

  //checkversion
  const [modalAlertVersion, setModalAlertVersion] = useState(false);
  const [iosDevice, setIosDevice] = useState("");
  const [andDroidDevice, setAndroidDevice] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      console.log("severVersion...");
      try {
        let currentVer = expo.version
        console.log("currentVer: ", currentVer);
        let ios_link = 'https://apps.apple.com/th/app/'
        let ios_name = 'mango-qcm/';
        let ios_id = 'id1534971022';
        let android_link = 'https://play.google.com/store/apps/'
        let android_package = expo.android.package;
        console.log("${ios_link}${ios_name}${ios_id}: ", `${ios_link}${ios_name}${ios_id}`)
        const check = await checkVersion({
          version: currentVer, // app local version
          iosStoreURL: `${ios_link}${ios_name}${ios_id}`,
          androidStoreURL: `${android_link}details?id=${android_package}`,
          country: 'th'
          // country: 'jp', // default value is 'jp'
        });
        // console.log("check: ", check);
        if (check.result === 'new') { // ถ้าของ store ใหม่กว่า
          let ios = `${ios_link}${ios_name}${ios_id}`;
          let android = `${android_link}details?id=${android_package}`;
          setIosDevice(ios)
          setAndroidDevice(android)
          setModalAlertVersion(true);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData()
  }, []);
  const goUpdateApp = async () => {
    console.log("update ios: ", iosDevice);
    console.log("update android: ", andDroidDevice);
    Platform.OS == "ios"
      ? await Linking.openURL(
        `${iosDevice}`
      )
      : await Linking.openURL(
        `${andDroidDevice}`
      );
  }
  return (
    // <Modal
    //   style={{ margin: 0 }}
    //   transparent={true}
    //   animationType="fade"
    //   visible={modalAlertVersion}>
    //   <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
    //     <View style={{ alignItems: "center", backgroundColor: "white", borderRadius: 24, overflow: "hidden" }}>
    //       <ImageBackground
    //         style={{
    //           position: 'absolute',
    //           width: 541,
    //           height: 370,
    //           top: -160,
    //           left: -90,
    //         }}
    //         source={BannerAlert}
    //       // resizeMode="cover"
    //       >
    //       </ImageBackground>
    //       <View style={{ alignSelf: "flex-start" }}>
    //         <Image
    //           style={{ width: 304, height: 172 }}
    //           // resizeMode="contain"
    //           source={AlertImage}
    //         />
    //       </View>
    //       <View style={{ paddingHorizontal: 20 }}>
    //         <Text style={[styles.h2, { paddingVertical: 0 }]}>
    //           App Update Required!
    //         </Text>
    //         <Text style={[styles.h5, { marginTop: 5, fontSize: 13 }]}>
    //           We have added new features and fix some bugs
    //         </Text>
    //         <Text style={[styles.h5, { marginTop: 5, fontSize: 13 }]}>
    //           to make your experience seamless.
    //         </Text>
    //       </View>
    //       <View style={{ marginTop: 18, flexDirection: 'row' }}>
    //         <TouchableOpacity onPress={() => setModalAlertVersion(false)}
    //           style={{
    //             backgroundColor: "#808080",
    //             width: '30%',
    //             borderRadius: 15,
    //             marginBottom: 21,
    //             marginHorizontal: 7.5,
    //             paddingVertical: 12,
    //             paddingHorizontal: 10
    //           }}>
    //           <Text style={[styles.h5_bold, { color: "#FFFFFF", textAlign: "center" }]}>
    //             Maybe Later
    //           </Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => goUpdateApp()}
    //           style={{
    //             backgroundColor: "#02D667",
    //             width: '30%',
    //             borderRadius: 15,
    //             marginBottom: 21,
    //             marginHorizontal: 7.5,
    //             paddingVertical: 12,
    //             paddingHorizontal: 10
    //           }}>
    //           <Text style={[styles.h5_bold, { color: "#FFFFFF", textAlign: "center" }]}>
    //             Update
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // </Modal>
    <></>
  );
}
export default React.memo(UpdateVersion);
