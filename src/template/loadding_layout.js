import React, { useState } from "react";
import { Platform, Image, View, Text, Dimensions } from "react-native";
import { colors, styles } from "../stylesheet/styles";
//custom link
// import * as loadingData1 from "../../loadding1.json";
// import * as loadingData2 from "../../loadding2.json";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function LoaddingLayout() {
  return (
    <View style={{
      position: 'absolute',
      zIndex: 999,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: windowWidth,
      height: windowHeight,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backgroundColor: '(rgba(0,0,0,0.6))'
    }}>
      <Image
        source={require("./../../assets/loadding1.gif")}
        style={{ width: 70, height: 70, }}
      />
      <Text style={[styles.h3, { color: colors.violet, marginTop: 10 }]}>Loading..</Text>
    </View>
  );
}
