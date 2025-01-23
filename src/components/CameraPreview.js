import React from "react";
import { StyleSheet, View, ImageBackground, Dimensions,TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
// import Button from "./Button";
import { BOX, TEXT, SHADOW } from "../stylesheet/styles";

function CameraPreview({ photo, savePhoto, retakePicture }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <View
      style={{
        // width: windowWidth,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0, 
        bottom: 0,
        // height: windowHeight,
        zIndex: 9999,
        // paddingBottom: 80,
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingBottom: 15,
          zIndex: 10,
          bottom: 15,
        }}
      >
        {/* <Button title="Cencel" onPress={retakePicture} /> */}
        <TouchableOpacity onPress={retakePicture}>
          <MaterialCommunityIcons
            name="camera-retake-outline"
            size={35}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={savePhoto}>
          <SimpleLineIcons name="arrow-right-circle" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    ...SHADOW,
    position: "absolute",
    left: 0,
    right: 0,
    top: "30%",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    marginHorizontal: "5%",
    borderRadius: 10,
    // height:300,
    padding: 25,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
  },
  contentBox: {
    ...BOX,
    justifyContent: "space-evenly",
    marginVertical: 15,
  },
  bmiStatusText: {
    ...TEXT,
    fontSize: 24,
    fontWeight: "bold",
  },
  bmiPointText: {
    ...TEXT,
    fontSize: 70,
    fontWeight: "bold",
  },
  bmiInterpretationText: {
    ...TEXT,
    fontSize: 18,
    lineHeight: 30,
    fontWeight: "500",
  },
  textArea: {
    backgroundColor: "rgba(209, 211, 214,0.6);",
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginTop: 15,
    paddingTop: 15,
    padding: 15,
  },
});

export default React.memo(CameraPreview);
