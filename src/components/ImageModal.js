import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BOX, TEXT, SHADOW } from "../../src/stylesheet/style_pc";
import { Circle } from 'react-native-animated-spinkit';
function ImageModal({ modalVisible, onModalClose, pathImage, pathLocation }) {
  const [isLoading, setIsLoading] = useState(true)
  return (
    // https://reactnative.dev/docs/modal
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
    >
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 4,
            top: 30,
            right: 15,
            padding: 15,
          }}
          onPress={onModalClose}
        >
          <AntDesign name="close" size={32} color="white" />
        </TouchableOpacity>
        {isLoading && (
          <View style={{ width: '100%', height: '100%', zIndex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Circle size={48} color="#DD6D4B" />
          </View>
        )}
        <Image
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="contain"
          source={{ uri: pathImage }}
          onLoadEnd={() => setIsLoading(false)}
        ></Image>
       { pathLocation && <View
          style={{
            position: "absolute",
            bottom: 50,
            textAlign: "center",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            padding: 15,
            width: "96%",
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        >
          <Text style={{}}>รายละเอียด: {pathLocation.remark || ""}</Text>
          <Text>
            ที่อยู่:{" "}
            {pathLocation.location_name != "undefined"
              ? pathLocation.location_name
              : "-"}
          </Text>
        </View>}
      </View> 
    </Modal>
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

export default React.memo(ImageModal);
