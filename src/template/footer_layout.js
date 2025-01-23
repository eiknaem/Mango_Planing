//React Native
import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import wave from "../../assets/wave.png";
import footerImage from "../../assets/images/petty_cash/bg-footer.png";

export default function FooterLayout() {
  const { width, height } = Dimensions.get("window");
  const { searchText, setsearchText } = useState("");
  console.log("module", global.module);

  const renderFooter = () => {
    if (global.module == 'PC') {
      switch (global.module) {
        case "PC":
          return (
            // <View style={{ zIndex: -2 }}>
            <Image source={footerImage} style={{
              width: '100%',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1
            }} />
            // </View>
          )
          break;
        default:
          <View style={{ zIndex: -2 }}>
            <Image
              style={{
                width: "100%",
                minHeight: width <= 720 ? 120 : 250,
                position: "relative",
                // flexDirection: 'column',
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginBottom: -20,
                marginTop: -70,
                left: 0,
                right: 0,
                bottom: 0,
                aspectRatio: 768 / 225,
                // backgroundColor: 'red',
              }}
              source={wave}
            />
          </View>
      }

    }
  }
  return (
    // global.module == 'PC' 
    renderFooter()

  );
}
