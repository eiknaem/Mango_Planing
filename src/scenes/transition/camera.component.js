import React, { useEffect, useState } from "react";
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraScreen({ route, navigation }) {
  const windowDimensions = Dimensions.get('window');
  const theme = useTheme();
  const [lang, setLang] = useState({});
  const [isSizeImage, setSizeImage] = useState({});
  const [dataServer, setDataServer] = useState(null);
  const [camera, setCamera] = useState(null);
  // แก้ไขจาก Camera.Constants.Type.back เป็นเพียงแค่ "back"
  const [type, setType] = useState("back");
  const [takingPic, setTakingPic] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadfile, setLoadfile] = useState(false);
  const [sizecon, setSizecon] = useState(route.params?.sizefile || 0);
  const [sizepg, setSizepg] = useState(route.params?.pgsizefile || 0);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isGpsLocation, setGpsLocation] = useState("");
  const [isGpsLocationCoordinate, setGpsLocationCoordinate] = useState("");
  const [isAccessMedia, setAccessMedia] = useState("N");
  const [isDimensions, setDimensions] = useState({
    window: windowDimensions
  });
  const [isConfigSizeImg, setConfigSizeImg] = useState("");

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }) => {
        console.log("window", window);
        setDimensions({window});
      },
    );

    return () => subscription?.remove();
  }, []);

  const snapPhoto = async () => {
    if (loadfile === true) return;
    setLoadfile(true);
    if (camera) {
      const options = { quality: 0.5, base64: true };
      try {
        const photo = await camera.takePictureAsync(options);
        let item = {};
        let name = Math.floor(100000000 + Math.random() * 900000000);
        let extension = xt.getFileExtension(photo.uri).toLowerCase();
        item["localUri"] = photo.uri;
        item["filename"] = name + "." + extension;
        item["base64"] = photo.base64;
        console.log("photo", item);

        let scale = isDimensions.window.width > isDimensions.window.height;
        console.log("isDimensions snapPhoto", isDimensions);
        console.log("scale: ", scale);

        if (isAccessMedia === "Y") {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
        
        if (route.params?.control_sizefile === "Y") {
          const fileInfo = await getFileInfo(item['localUri']);
          let sizeW = (sizepg + (fileInfo?.size || 0))
          if (sizeW > sizecon) {
            setLoadfile(false);
            navigation && navigation.navigate('Infocontact', route.params);
          } else {
            await onUpdate(item);
          }
        } else {
          await onUpdate(item);
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("ERROR", error.toString());
        setLoadfile(false);
      }
    } else {
      setLoadfile(false);
    }
  };

  const onCloseCamara = () => {
    setTakingPic(false);
    setVisible(false);
    navigation.goBack();
  };

  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);
    var dataServer = await getDataStorage("sitevalue_key");
    setDataServer(dataServer);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
  };

  const getFileInfo = async (fileURI) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      return fileInfo;
    } catch (error) {
      console.error("Error getting file info:", error);
      return { size: 0 };
    }
  };

  const Base64File = async (data, file, form) => {
    console.log("data", data);
    console.log("file", file);

    let server_data = (await apiAuth.getAuth()).data;
    let auth = server_data.auth;
    let filesize = auth.base64_filesize || null;
    console.log("filesize...", filesize);
    let ext = (file.name.split(".").pop() || "").toLowerCase();
    console.log("ext..", ext);
    
    if (filesize != null) {
      console.log("2");
      let configsize = 1024 * 1024 * filesize;

      console.log("configsize", configsize);
      console.log("data.pgsizefile", file);
      console.log("_file 1...", file.size > configsize);
      let _currentSize = file.size / 1000000;
      console.log("_currentSize", _currentSize);

      let currentSize = xt.dec(_currentSize, 2);
      if (parseInt(file.size) > configsize) {
        console.log("3");
        Alert.alert("Warning", `File size more than ${filesize}MB is the current size of ${currentSize}MB.`, "OK");
        return false;
      }
    }
    
    if (["xls", "xlsx"].includes(ext)) {
      let configsize = 1024 * 1024 * 15;
      console.log("_file 2...", data.pgsizefile > configsize);
      if (parseInt(data.pgsizefile) > configsize) {
        console.log("4");
        Alert.alert("Warning", `File size more than 15MB`, "OK");
        return false;
      }
    }
    
    if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx", "heic", "heif"].includes(ext)) {
      console.log("5");
      Alert.alert(
        "Warning",
        `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx, heic, heif)`,
        "OK"
      );
      return false;
    }
    
    form.append("base64_file", file.base64);
    form.append("base64_filename", file.name);
    form.append("base64_content_type", file.type);
    return true;
  };

  const onUpdate = async (item) => {
    try {
      let server_data = (await apiAuth.getAuth()).data;
      let auth = server_data.auth;
      let base64 = auth?.base64_file || "N";
      console.log("itemitem", item);
      
      let scale = isDimensions.window.width > isDimensions.window.height;
      console.log("isDimensions", scale);
      console.log("isDimensionsssss ", isDimensions);
      console.log("isSizeImage ", isSizeImage);

      let formData = new FormData();
      let file = {};
      let fileInfo;

      if (isConfigSizeImg === "Y") {
        const manipResult = await manipulateAsync(item.localUri,
          [{
            resize: {
              height: scale ? isSizeImage.width : isSizeImage.height,
              width: scale ? isSizeImage.height : isSizeImage.width,
            }
          }]
        );
        console.log("manipResult", manipResult);
        fileInfo = await getFileInfo(manipResult.uri);
        console.log("fileinfooo: ", fileInfo);
        file = {
          uri: manipResult.uri,
          type: "*/*",
          name: item.filename,
          size: fileInfo?.size,
          base64: item.base64
        };
      } else {
        fileInfo = await getFileInfo(item.localUri);
        console.log("fileInfo else", fileInfo);
        file = {
          uri: item.localUri,
          type: "*/*",
          name: item.filename,
          size: fileInfo?.size,
          base64: item.base64
        };
      }

      formData.append("file", file);
      formData.append("sizefile", fileInfo?.size.toString());
      formData.append("pre_event2", route.params.pre_event2);
      formData.append("pre_event", route.params.pre_event);
      formData.append("plancode", route.params.plan_code);
      formData.append("doctype", "TASK");
      formData.append("taskid", route.params.taskid);
      formData.append("refitemno", route.params.itemno);
      formData.append("gps_location", isGpsLocationCoordinate);
      formData.append("gps_location_coordinates", isGpsLocation);
      
      let data = route.params;
      console.log("before change base64", formData);
      
      if (base64 === 'Y') {
        let _Base64 = await Base64File(data, file, formData);
        if (!_Base64) {
          console.log("1>>");
          setLoadfile(false);
          return {
            success: true,
          };
        }
      }
      
      console.log("2>>", formData);
      var url = "Planning/Plan/Planning_Attachfile";
      var rsp = await xt.postServerForm(url, formData);
      console.log("rsp", rsp);
      
      if (rsp.success) {
        let size = (sizepg + (fileInfo?.size || 0));
        setSizepg(size);
      }
      
      setLoadfile(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error during upload:", error);
      Alert.alert("ERROR", error.toString());
      setLoadfile(false);
    }
  };

  const onLoadSize = async () => {
    try {
      var rsp2 = await getSyscode();
      console.log("rsp2: ", rsp2);

      if (rsp2.resize_img === "Y") {
        let _size = {
          width: rsp2.img_width,
          height: rsp2.img_height
        };
        setSizeImage(_size);
      }
      setConfigSizeImg(rsp2.resize_img);
    } catch (error) {
      console.error("Error loading size config:", error);
    }
  };

  const onloadLocation = async () => {
    try {
      var accessMedia = await getDataStorage("accessMedia");
      var latitude = global.latitude;
      var longitude = global.longitude;
      const mangoLoc = await xt.getLocation(latitude, longitude);

      var gps_location =
        ((mangoLoc || []).data[0] || {}).geo_data?.location_fullname || "";
      let gps_location_coordinate = await getDataStorage("gps_location_coordinate");
      console.log("gps_location_coordinate", gps_location);
      setGpsLocation(gps_location);
      setGpsLocationCoordinate(gps_location_coordinate);
      setAccessMedia(accessMedia || "N");
    } catch (error) {
      console.error("Error loading location:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getLangDF();
      onLoadSize();
      onloadLocation();
      setLoadfile(false);
    }, [])
  );

  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return (
      <View style={localStyles.permissionContainer}>
        <Text style={localStyles.permissionText}>ไม่ได้รับอนุญาตให้เข้าถึงกล้อง</Text>
        <TouchableOpacity 
          style={localStyles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={localStyles.permissionButtonText}>กลับ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={localStyles.container}>
      <CameraView
        style={localStyles.camera}
        facing={type}
        ref={ref => {
          setCamera(ref);
        }}
        ratio="16:9"
      >
        <View style={localStyles.controlsContainer}>
          <TouchableOpacity
            style={[localStyles.controlButton, localStyles.backButton, loadfile && localStyles.disabledButton]}
            disabled={loadfile}
            onPress={onCloseCamara}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[localStyles.captureButton, loadfile && localStyles.disabledButton]}
            disabled={loadfile}
            onPress={snapPhoto}
          >
            {loadfile ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={localStyles.captureButtonText}>
                {lang.take_photo || "ถ่ายรูป"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.controlButton}
            onPress={() => {
              setType(
                type === "back"
                  ? "front"
                  : "back"
              );
            }}
          >
            <Ionicons name="camera-reverse" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#83c985',
  },
  backButton: {
    backgroundColor: '#cc0000',
    borderColor: '#cc0000',
  },
  captureButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#95d097',
  },
  captureButtonText: {
    color: "#FFF",
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});