import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import wavePR from "../../assets/wavePR.png";

export default function FooterLayoutPR() {
  const { width, height } = Dimensions.get("window");
 
  return (
    <View style={{ zIndex: 0 }}>
      <Image
        style={{
          width: "110%",
          minHeight: width <= 720 ? 120 : 250,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          marginHorizontal: "-5%",
          marginBottom:"-10%",
        }}
        source={wavePR}
      />
    </View>
  );
}
