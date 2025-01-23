import { StyleSheet, Platform, Dimensions } from "react-native";
import Constants from "expo-constants";
import { color } from "./colors";
import { font } from "./fonts";
export const BG_COLOR = "#323344";
export const colors = color;
export const fonts = font;

export const HIGHLIGHT_BG_COLOR = "#24263b";
const windowWidth = Dimensions.get("window").width;
export const TEXT = {
  color: "#fff",
  textAlign: "center",
};
export const TEXT_LABEL = {
  fontSize: 15,
  textAlign: "center",
  color: "#848694",
};

export const TEXT_VALUE = {
  ...TEXT,
  fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : null,
  fontSize: 35,
  lineHeight: 55,
  fontWeight: "bold",
};

export const ROW = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
};

export const CENTER = {
  justifyContent: "center",
  alignItems: "center",
};

export const BOX = {
  flex: 1,
  backgroundColor: BG_COLOR,
  padding: 15,
  borderRadius: 10,
};
export const SHADOW = {
  shadowColor: "#6D6D6D",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.45,
  shadowRadius: 10,
  elevation: 5,
};

const HEADER_BACKGROUND = "#144429";
const CONTENT_BACKGROUND = "#f9f9f9";
export const styles = StyleSheet.create({
  topSafeArea: {
    backgroundColor: HEADER_BACKGROUND,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : null,
    backgroundColor: CONTENT_BACKGROUND,
    
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: HEADER_BACKGROUND,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
  },
  content: {
    padding: 20,
    backgroundColor: CONTENT_BACKGROUND,
  },
  banner: {
    resizeMode: "contain",
    width: "40%",
    height: null,
    marginTop: 30,
    // flex:1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 50 / 50, // Image ratio
    // borderRadius: 120,
  },
  ROW: {
    flexDirection: "row",
    alignItems: "center",
  },
  ROW_TOP: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  take_photo: {
    resizeMode: "contain",
    width: "70%",
    height: null,
    // flex:1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 50 / 50, // Image ratio
    // borderRadius: 120,
  },
  home_menus: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: "#6D6D6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  block_shadow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginHorizontal: "15%",
    padding: 15,
    shadowColor: "#6D6D6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    color: "#000000",
    fontSize: 16,
    lineHeight: 30,
    paddingRight: 5,
  },
  description: {
    flex: 1,
    lineHeight: 30,
  },
  label_red: {
    fontSize: 16,
    color: "#FF0000",
    lineHeight: 30,
  },
  label_footer: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
  },
  inputForm: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    paddingVertical: 10,
  },
  space: {
    width: 15,
  },
  underline: {
    width: "100%",
    height: 1,
    backgroundColor: "red",
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "#ff7675",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  labelbox: {
    fontSize: 15,
    color: "#000",
    paddingLeft: 10,
    paddingVertical: 10,
  },
  labelred: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
    paddingBottom: 5,
  },
  blockSearch: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#57627A",
    borderWidth: 1,
    paddingVertical: 10,
    flexDirection: "row",
    // height: 40
  },
  blockText: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#57627A",
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 15,
  },
  textArea: {
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#57627A",
    borderWidth: 1,
    height: 100,
    paddingTop: 15,
    padding: 15,
    color: "#000",
  },
  btnOrange: {
    marginHorizontal: 30,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: "#DD6D4B",
    color: "#fff",
    ...SHADOW,
  },
  btnGrey: {
    marginHorizontal: 30,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: "#3A404E",
    color: "#fff",
    ...SHADOW,
  },
  line: {
    marginTop: 30,
    backgroundColor: "#57627A",
    width: "100%",
    height: 1,
  },
  line2: {
    marginTop: 15,
    backgroundColor: "#57627A",
    width: "100%",
    height: 1,
  },
  line3: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  checkbox: {
    //   position: "absolute",
    alignItems: "flex-start",
    marginTop: 20,
  },
  textinvoice: {
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
    color: "#19246D",
    paddingBottom: 5,
  },
  iconRight: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    width: 30,
  },
  iconRight2: {
    position: "absolute",
    right: 10,
    bottom: 7,
  },
  bigcard: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#FCFCFF",
    borderColor: "#D0D0D0",
    borderWidth: 1,
    // height: 540,
    // padding: 22,
  },
  card: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    // borderRadius: 10,
    backgroundColor: "#FCFCFF",
    marginVertical: 7.5,
    shadowColor: "#6D6D6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
    // height: 540,
    // padding: 22,
  },
  row_center: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text_left: {
    fontSize: 14,
    color: "#000",
    textAlign: "left",
    paddingLeft: 15,
    paddingRight: 40,
  },
  menus: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: "#6D6D6D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  blockcard: {
    flex: 1,
    // marginHorizontal: 15,
    marginVertical: 7.5,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D0D0D0",
    backgroundColor: "#FCFCFF",
  },
  blockcard2: {
    // flex: 1,
    marginVertical: 7.5,
    padding: 10,
    // width: '90%',
    // borderWidth: 1,
    borderRadius: 6,
    // borderColor: "#D0D0D0",
    marginHorizontal: 3,
    backgroundColor: colors.white,
    // opacity: 0.96,
    shadowColor: "rgb(00, 00, 00)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 2,
  },
  remove: {
    position: "absolute",
    right: -15,
    top: -15,
    // paddingLeft: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    // flexDirection: 'row'
    // backgroundColor: 'yellow',
    zIndex: 3
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    // paddingHorizontal: 8,
  },
  col_list: {
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "center",
    paddingVertical: 7.5,
    backgroundColor: "#F4F4F4",
  },
  col_list_foot: {
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "center",
    paddingVertical: 7.5,
    backgroundColor: "#5C6483",
    color: "#fff",
    height: 30
  },
  col_list_foot2: {
    height: 30
  },
  footer: {
    paddingBottom: 25,
    zIndex: 999,
    paddingTop: 15,
    shadowColor: colors.border2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    elevation: 5,
  },
  rows: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rows_top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rows_start: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
