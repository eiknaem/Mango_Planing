import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Button1 from "./Button1";
import Button2 from "./Button2";
import { BOX, TEXT, SHADOW  } from "../stylesheet/style_pc";

function RemoveModal({ modalVisible, onModalConfirm, onModalCencel }) {
  return (
    // https://reactnative.dev/docs/modal
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerText}>ต้องการลบรายการนี้ ?</Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button1 title="ยกเลิก" onPress={onModalCencel} />
            <View style={{ width: 7.5 }}></View>
            <Button2 title="ตกลง" onPress={onModalConfirm} />
          </View>
        </View>
      </SafeAreaView>
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

export default React.memo(RemoveModal);
