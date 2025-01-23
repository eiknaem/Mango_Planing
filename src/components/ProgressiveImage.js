import React, { useState } from "react";
import { View, StyleSheet, Animated, Text, Image } from "react-native";
import { Circle } from "react-native-animated-spinkit";
function ProgressiveImage({ thumbnailSource, source, style }) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loading}>
          <Circle size={48} color="#DD6D4B" />
        </View>
      )}
      <Image
        source={source}
        style={[style]}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 0.2
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default React.memo(ProgressiveImage);
