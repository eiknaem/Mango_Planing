import React, { useState, useEffect, useRef } from "react";
import { BackHandler, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as mapping } from "./src/mapping.json"; // <-- import Customize mapping
import * as Updates from "expo-updates";
import * as Location from "expo-location";
import {
  Inter_300Light,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import {
  useFonts,
  Prompt_300Light,
  Prompt_500Medium
} from "@expo-google-fonts/prompt";
import styles from "./src/stylesheet/styles";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { colors } from "./src/stylesheet/styles";
import { apiAuth, loginOtherApplication } from "./src/api/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageBox from "./src/api/msg";
import UpdateVersion from "./src/components/UpdateVersion";
import { xt, getDataStorage } from "./src/api/service";
import $xt from "./src/api/xtools";
import Passcode from "./src/auth/passcode";
import Login from "./src/auth/login";
import OtpAuth from "./src/auth/otp"
import PinCode from "./src/auth/pincode";
import HeaderRight from "./src/components/headerRight";
import HeaderLeft from "./src/components/headerLeft";
import ProjectScreen from "./src/scenes/transition/project.component";
import PlansScreen from "./src/scenes/transition/plans.component";
// transitons
import HomeLayout from "./src/template/home_layout";
import SettingScreen from "./src/scenes/transition/setting.component";
////Potho////
// import PassLogin from "./src/auth/passlogin";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const Stack = createStackNavigator();
export default function App({ navigation }) {
  let [fontsLoaded] = useFonts({
    Prompt_300Light,
    Inter_300Light,
    Inter_700Bold,
    Prompt_500Medium,
  });
  const [isReady, setReady] = useState(false);
  const [isInitialScreen, setInitialScreen] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);
  const [lang, setLang] = useState({});
  const [themes, setthemes] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      getLangDF();
      // await versionUpdate();
      // global.loadeData = false;
      try {
        global.is_api = "Y" // เช็คการนับ user เข้าใช้งาน
        // global.app_name = "APPQCM" // ชื่อของแอพ
        global.home_page = "Project" // ชื่อหน้าแรก
        global.theme = { head: "#0F1E43", body: colors.white }; // theme default

        let url = await Linking.getInitialURL();
        console.log("url", url);
        let newURL = Linking.parse(url || "*");
        let newBaseUrl = newURL?.queryParams?.baseUrl;
        let newMangoAuth = newURL?.queryParams.mango_auth;
        let newPasscode = newURL?.queryParams?.passcode;
        let newBasePath = newURL?.queryParams?.webview;
        let newSession = newURL?.queryParams?.session;
        let newAuth = JSON.stringify(newURL?.queryParams?.auth);
        if (!$xt.isEmpty(newMangoAuth)) {
          await AsyncStorage.multiSet([["baseUrl", newBaseUrl] || "", ["passcode", newPasscode || ""], ["basePath", newBasePath || ""], ["session", newSession || ""], ["auth", newAuth || ""]]);
          let newLogin = await loginOtherApplication(newMangoAuth, global.app_name);
          // console.log("new token:", newLogin.token);
          await AsyncStorage.setItem("mango_auth", newLogin.token || "");
          // await AsyncStorage.setItem("Times", SleepTime);
        }
        let passcode = (await AsyncStorage.getItem("passcode")) || "";
        let baseUrl = (await AsyncStorage.getItem("baseUrl")) || "";
        console.log("passcode", passcode, "baseUrl", baseUrl);
        let pincode_menu = (await AsyncStorage.getItem("pincode_menu")) || "N";
        let configSinOn = await AsyncStorage.getItem("configSinOn") || "N";
        let pincodeLink = (pincode_menu == "Y" && configSinOn != "Y")
        console.log("pincodeLink", pincodeLink ? "PinCode" : global.home_page);

        if (!$xt.isEmpty(passcode)) {
          try {
            var auth = (await apiAuth.getAuth()).data.auth;
          } catch (ex) {
            let messageBox = MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
            messageBox ? setInitialScreen("Passcode") : null;
          }
          console.log("auth", auth);
          if (auth?.is_authen) {
            // setInitialScreen(pincode_menu == "Y" ? "PinCode" : global.home_page);
            console.log("pincodeLink PAGE-------");
            setInitialScreen(pincodeLink ? "PinCode" : global.home_page);
          } else {
            console.log("Login PAGE-------");

            setInitialScreen("Login");
          }
        } else {
          setInitialScreen("Passcode");
        }
        await getPermissionAsync();
        setReady(true);
      } catch (ex) {
        let messageBox = MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
        if (messageBox) {
          setInitialScreen("Passcode");
        }
      }
    };
    const getLangDF = async () => {
      let lang_ = await xt.getLang();
      setLang(lang_);

      let themes_key = await getDataStorage("themes_ppn") || "light";
      setthemes(themes_key)

    };
    const getPermissionAsync = async () => {
      var { status } = await Location.requestForegroundPermissionsAsync();
      // setStatus(status)
      // this.setState({ isStatus: status });
      console.log("status", status);
      if (status !== "granted") {
        let _ms = await MessageBox.Confirm("โปรดยืนยัน", `สิทธิ์ในการเข้าถึงตำแหน่งถูกปฏิเสธ \n ต้องการไปที่ตั้งค่าหรือไม่?`, "ไม่ใช่", "ใช่");
        console.log("_ms", _ms);
        if (_ms) {
          openSetting();
        }
        return;
      } else {
        let _getlocation = [];
        if (status === "granted") {
          //write code for the app to handle GPS changes
          _getlocation = Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 10000,
              distanceInterval: 1,
            },
            async (location) => {
              // const { latitude, longitude } = location.coords;
              const latitude = location.coords.latitude;
              const longitude = location.coords.longitude;
              let gps_location_coordinate = `${latitude},${longitude}`;
              // console.log("latitude", latitude);
              // console.log("longitude", longitude);
              // console.log("gps_location_coordinate", gps_location_coordinate);
              await AsyncStorage.setItem("gps_location_coordinate", gps_location_coordinate || "");

              await AsyncStorage.setItem("gps_latitude", latitude.toString() || "");
              await AsyncStorage.setItem("gps_longitude", longitude.toString() || "");
              global.latitude = latitude;
              global.longitude = longitude;
            }
          );
        }
      }
    };
    const openSetting = async () => {
      await Linking.openSettings();
      await $xt.sleep(200);
      await Updates.reloadAsync();
    };

    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    registerForPushNotificationsAsync().then(async (token) => {
      console.log("token_push", token);
      await AsyncStorage.setItem("token_push", token || "");
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    fetchData();
    return () => {
      backHandler.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);

    };
  }, []);
  if (!isReady) {
    return (
      <View></View>
    )
  }
  const renderProject = () => {
    return (
      <>
        <Stack.Screen name='Project' component={ProjectScreen} />
      </>
    )
  }
  const renderPlan = () => {
    return (
      <>
        <Stack.Screen name='Plans' component={PlansScreen} />
      </>
    )
  }

  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...eva.light }}
      customMapping={mapping}
    >
      <NavigationContainer>
        {isReady ? (
          <HomeLayout
            props={
              <>
                <Stack.Navigator
                  initialRouteName={isInitialScreen}
                  screenOptions={({ route, navigation }) => ({
                    headerRight: () => <HeaderRight navigation={navigation} showScan={false} showIcon={false} />,
                    headerLeft: () => <HeaderLeft navigation={navigation} />,
                    headerStyle: {
                      backgroundColor: themes == 'light' ? colors.white : colors.back_bg,
                      shadowColor: "transparent",
                      elevation: 0,
                    },
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    headerTintColor: themes == 'light' ? colors.black : colors.white,

                  })}
                >
                  <Stack.Screen name="Passcode" component={Passcode} options={{ headerShown: false }} />
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name='Setting' component={SettingScreen} />
                  {/* // component */}
                  {renderProject()}
                  {renderPlan()}
                </Stack.Navigator>
                <UpdateVersion />
              </>
            }>
          </HomeLayout>
        ) : null}
      </NavigationContainer>
    </ApplicationProvider>
  );
}
async function registerForPushNotificationsAsync() {
  console.log("Platform.OS", Platform.OS);
  if (Platform.OS === 'android') {
    console.log("android");
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  let token;
  // console.log("Device.isDevice", Device.isDevice);
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      // return;
      // await AsyncStorage.setItem("token_push", "");
      token = ""
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
  } else {
    // alert('Must use physical device for Push Notifications');
  }
  return token;
}
