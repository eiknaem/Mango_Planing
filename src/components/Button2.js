import React from "react";
import { StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { CENTER, TEXT } from "../stylesheet/style_pc";

function Button2({ title, onPress }) {
  const setBG = title;
  console.log("setBG", setBG);
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: "#DD6D4B" }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    ...CENTER,
    // height: 40,
    // borderRadius: 1,
    // backgroundColor: "#e83d66",
    // marginTop: 15,
    // paddingHorizontal: 30,
    borderRadius: 8,
    // borderColor: '#57627A',
    // borderWidth: 1,
    marginTop: 15,
    height: 40,
    paddingHorizontal: 45,
    marginBottom: Platform.OS === "ios" ? 0 : 10,
  },
  buttonText: {
    // ...TEXT,
    fontSize: 14,
    // fontWeight: "bold",
    color: "#fff",
  },
});

export default React.memo(Button2);
