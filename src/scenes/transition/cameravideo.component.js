import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { manipulateAsync } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { apiAuth } from "../../api/authentication";
import { getSyscode } from "../../api/bind_api";
import { useTheme } from "../../components/themeProvider";
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraVideoScreen({ route, navigation }) {
      // console.log("route", route);
  const theme = useTheme();
  const [lang, setLang] = useState({});
  const [dataServer, setDataServer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState("back");
  const [takingPic, setTakingPic] = useState(false);
  const [visible, setVisible] = useState(false);

  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [sizecon, setSizecon] = useState(route.params.sizefile || 0);
  const [sizepg, setSizepg] = useState(route.params.pgsizefile || 0);

  const [record, setRecord] = useState(null);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [statusvideo, setStatusvideo] = useState(false);
  const [loadfile, setLoadfile] = useState(false);
  const [isGpsLocation, setGpsLocation] = useState("");
  const [isGpsLocationCoordinate, setGpsLocationCoordinate] = useState("");
  
  // Timer
  const [isTimerStart, setTimerStart] = useState(false);
  const [isTimerReset, setTimerReset] = useState(false);

  const [isUpLoaded, SetUpLoaded] = useState(false);

  const cameraRef = useRef(null); // Create a ref for CameraView


  const renderBackAction = () => (
    <TouchableOpacity onPress={onCloseCamara}>
        <Ionicons name="close" size={30} color={colors.white} />
    </TouchableOpacity>
  );

  const onCloseCamara = () => {
    setTakingPic(false)
    setVisible(false);
    navigation.goBack();
  };

  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);
    var dataServer = await getDataStorage("sitevalue_key");
    setDataServer(dataServer);

    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === 'granted');

    const audioStatus = await Camera.requestMicrophonePermissionsAsync();
    setHasAudioPermission(audioStatus.status === 'granted');
  }

  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI)
    return fileInfo
  }

  const Base64File = async (data, file, form) => {
    console.log("data", data);
    console.log("file", file);

    let server_data = (await apiAuth.getAuth()).data;
    let auth = server_data.auth;
    // let base64 = auth?.base64_file || "N";
    let filesize = auth.base64_filesize || null;
    console.log("filesize...", filesize);
    // console.log("base64...", base64);
    // let _file = data.file;
    let ext = (file.name.split(".").pop() || "").toLowerCase();
    console.log("ext..", ext);
    if (filesize != null) {
      console.log("2");
      let configsize = 1024 * 1024 * filesize;

      console.log("configsize", configsize);
      console.log("data.pgsizefile", file);
      console.log("_file 1...", file.size > configsize);
      if (parseInt(file.size) > configsize) {
        console.log("3");
        MessageBox.Alert("Warning", `File Size More Than ${filesize}MB`, "OK");
        return false;
      }
    }
    // let ext = _file.name.split(".").pop();
    if (["xls", "xlsx"].includes(ext)) {
      let configsize = 1024 * 1024 * 15;
      console.log("_file 2...", data.pgsizefile > configsize);
      if (parseInt(data.pgsizefile) > configsize) {
        console.log("4");
        MessageBox.Alert("Warning", `File Size More Than 15MB`, "OK");
        return false;
      }
    }

    // if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx", "heic", "heif"].includes(ext)) {
    //   console.log("5");
    //   MessageBox.Alert(
    //     "Warning",
    //     `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx, heic, heif)`,
    //     "OK"
    //   );
    //   return false;
    // }
    let base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let bas64 = base64.split(",");
    console.log("base64_Split...", bas64);
    form.append("base64_file", base64);
    form.append("base64_filename", file.name);
    form.append("base64_content_type", file.type);
    return true;

  }
  const onUpdate = async (item) => {
    console.log("PASSSSSSSSS");
    
    let server_data = (await apiAuth.getAuth()).data;
    let auth = server_data.auth;
    let base64 = auth?.base64_file || "N";
    const fileInfo = await getFileInfo(item.localUri)
    const file = {
      uri: item.localUri,
      type: "*/*",
      name: item.filename,
    };
    let formData = new FormData();
    formData.append("file", file);
    formData.append("pre_event2", route.params.pre_event2);
    formData.append("pre_event", route.params.pre_event);
    formData.append("plancode", route.params.plan_code);
    formData.append("doctype", "TASK");
    formData.append("taskid", route.params.taskid);
    formData.append("sizefile", fileInfo?.size.toString()); //fileInfo?.size
    formData.append("refitemno", route.params.itemno);
    formData.append("gps_location", isGpsLocationCoordinate);
    formData.append("gps_location_coordinates", isGpsLocation);
    let data = route.params
    console.log("before change base64");
    ///////////////////////////////////////base64////////////////
    console.log("2>>");
    try {
      var url = "Planning/Plan/Planning_Attachfile";
      var rsp = await xt.postServerForm(url, formData);
      console.log("rsp", rsp);
      if(rsp.success){
        SetUpLoaded(false)
      }
    } catch (error) {
      MessageBox.Alert("ERROR", error.toString())
    }
    if (rsp.success) {
      let size = (sizepg + (fileInfo?.size || 0))
      setSizepg(size);
    }
    setLoadfile(false);
    setStatusvideo(false);
  }
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
      getLangDF();
      onloadLocation();
    }, [])
  );

  const takeVideo = async () => {
    setLoadfile(false);
    setStatusvideo(true);
    if (cameraRef.current) { // 
      // console.log('data');
      // const data = await camera.recordAsync({
      //   maxDuration: 10
      // })
      
      // set Timer
      setTimerStart(true);
      setTimerReset(false);

      console.log(cameraRef.current,'cameraRef.current');
      
      const data = await cameraRef.current.recordAsync();

      console.log('data',data);
      
      setRecord(data.uri);
      let item = {};
      let name = Math.floor(100000000 + Math.random() * 900000000);
      let extension = xt.getFileExtension(data.uri).toLowerCase();
      item["localUri"] = data.uri;
      item["filename"] = name + "." + extension;

      if (route.params.control_sizefile == "Y") {
        const fileInfo = await getFileInfo(item['localUri']);
        let sizeW = (sizepg + (fileInfo?.size || 0))
        if (sizeW > sizecon) {
          setLoadfile(false);
          setStatusvideo(false);
          navigation && navigation.navigate('Infocontact', route.params);
        } else {
          await onUpdate(item);
        }
      } else {
        await onUpdate(item);
      }
      //await onUpdate(item);
    }
  }

  const stopVideo = async () => {
    // set Timer
    setTimerStart(false);
    setTimerReset(true);

    // if(loadfile==true)return;
    setLoadfile(true);
    setStatusvideo(false);
    cameraRef.current.stopRecording();
    SetUpLoaded(true);
    console.log(isUpLoaded,"isUpLoaded");
    
  }

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={thisStyles.safeArea}>
      <View style={{ flex: 1, height: windowHeight, width: windowWidth, justifyContent: "center", alignItems: "center" }}>
        <CameraView
          style={{ flex: 1, width: windowWidth, justifyContent: "center", flexDirection: 'row' }} 
          ref={cameraRef}
          facing={type}
          ratio={'4:3'}
          mode={'video'}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingHorizontal: 15,
              marginBottom: 40,
            }}
          >
            <View style={{ position:'absolute', top: 0 }}>
              <Stopwatch
                laps msecs
                start={isTimerStart}
                reset={isTimerReset}
                options={options}
              />
            </View>
            
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: (statusvideo) ? '#e1dede38' : '#cc0000',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                backgroundColor: (statusvideo) ? '#e1dede38' : '#cc0000',
                borderRadius: 100
              }}
              disabled={statusvideo}
              onPress={onCloseCamara}
            >
              <Ionicons name="arrow-back" size={25} color="#FFF" />
            </TouchableOpacity>

            <Text>
              &nbsp;&nbsp;
            </Text>
            
            {statusvideo === false ? (
              <TouchableOpacity
                style={{
                  borderWidth: 5,
                  borderColor: '#95d097',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: '#4CAF50',
                  borderRadius: 100,
                }}
                onPress={takeVideo}
              >
                <Text style={{ color: "#FFF" }}>{lang.start_video}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 5,
                  borderColor: '#ff4d4d',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: '#cc0000',
                  borderRadius: 100,
                }}
                disabled={loadfile}
                onPress={stopVideo}
              >
                <Text style={{ color: "#FFF" }}>
                  {loadfile === false ? (
                    lang.stop_video
                  ) : (
                    <ActivityIndicator color="#FFF" />
                  )}
                </Text>
              </TouchableOpacity>
            )}

            <Text>
              &nbsp;&nbsp;
            </Text>
            
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#83c985',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                backgroundColor: '#4CAF50',
                borderRadius: 100,
              }}
              onPress={() => {
                setType(
                  type === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                );
              }}
            >
              <Ionicons name="camera-reverse" size={25} color="#FFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
        
        {isUpLoaded && (
          <View style={thisStyles.loadingContainer}>
            {/* {lang && <UploadedRows {...lang} />} */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const thisStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000"
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
    marginVertical: 4,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

const options = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 0,
    width: 'auto',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
    margin: 0,
  }
};