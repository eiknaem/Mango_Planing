import { StyleSheet, Dimensions } from "react-native";
export const fontFamily = {
  Prompt: "Prompt_300Light",
  Prompt_bold: "Prompt_500Medium",
  Inter_bold: "Inter_700Bold",
};
export const font = {
  h1: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 28,
    paddingVertical: 7.5,
    fontWeight: "600",
  },
  h2: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 24,
    paddingVertical: 5,
  },
  h3: {
    fontFamily: fontFamily.Prompt,
    fontSize: 20,
    paddingVertical: 5,
  },
  h3_bold: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 20,
    // paddingVertical: 5
  },
  h4: {
    fontFamily: fontFamily.Prompt,
    fontSize: 16,
    paddingVertical: 5,
  },
  h4_bold: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 5,
  },
  h5: {
    fontFamily: fontFamily.Prompt,
    fontSize: 12,
    paddingVertical: 0,
  },
  h5_bold: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
  }
};