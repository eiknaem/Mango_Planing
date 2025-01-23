import { StyleSheet, Dimensions, } from "react-native";
import Constants from "expo-constants";
import { color } from "./colors"
import { font } from "./fonts"
const windowWidth = Dimensions.get("window").width;
const widthScreen = 767;
export const colors = color;
export const fonts = font;

export const normalText = 16;
export const borderGrey = "#D3D3D3";
export const smallText = 14;
export const fontSize = {
  small: 10,
  normal: 14,
  large: 18,
};
export const h3 = {
  fontSize: 18,
};

export const fontFamily = {
  Prompt: "Prompt_300Light",
  Prompt_bold: "Prompt_500Medium",
  Inter_bold: "Inter_700Bold",
};
export const smallTextStyle = {
  fontSize: smallText,
};
export const inputStyle = {
  color: "#fff",
  fontSize: normalText,
};
export const styles = StyleSheet.create({
  // container: {
  //   paddingTop: 50,
  // },

  bg_header: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "transparent",
  },
  smallInputStyle: {
    color: "#fff",
    fontSize: smallText,
  },
  standaloneRowFront: {
    flex: 1,
    padding: 5,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderColor: borderGrey,
  },
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
  },
  h5_14: {
    fontFamily: fontFamily.Prompt,
    fontSize: 14,
    paddingVertical: 0,
  },
  title_left: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    width: "35%",
  },
  title_right: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingRight: 5,
  },
  bg_text: {
    fontFamily: fontFamily.Inter_bold,
    color: "rgba(255, 255, 255, 0.25)",
    fontSize: 150,
    transform: [{ rotate: "-28.27deg" }],
    position: "absolute",
    right: -10,
    top: -50,
    zIndex: 3,
    // backgroundColor:'green'
  },
  bg_icon: {
    color: "rgba(217, 38, 68, 0.5)",
    flex: 1,
  },
  main_block: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border3,
    padding: 8,
    // marginTop: 13,
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 40,
    marginBottom: 10,
  },
  header_block: {
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 14,
    // position: 'relative',
    // zIndex: 3,
    backgroundColor: colors.red,
  },
  shadow_block: {
    zIndex: 10,
    // position: 'absolute',
    // width: '100%',
    // height: 10,
    // bottom: -10,
    // //  top: 0,

    marginTop: 15,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 5,
  },
  shadow_text: {
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
  },
  text_white: {
    color: colors.white,
  },
  content: {
    // paddingTop: 20
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginVertical: 5,
  },
  line_red: {
    width: "100%",
    height: 2,
    backgroundColor: colors.red,
  },
  line_gray: {
    width: "100%",
    height: 2,
    backgroundColor: colors.grey,
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
    flex: 1
  },
  rows_end: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  stretch: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inputPasscode: {
    fontFamily: fontFamily.Prompt,
    paddingTop: 10,
    paddingBottom: 5,
    color: colors.black,
    borderBottomColor: "#565660",
    borderBottomWidth: 2,
  },
  testFont: {
    fontFamily: fontFamily.Prompt,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  backTextWhite: {
    color: "#4F4F4F",
    fontSize: 12,
  },
  standaloneRowBack: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    marginVertical: 8,
  },
  menuLeft: {
    // flex: 1,
    marginLeft: -8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  menuRight: {
    // flex: 1,
    marginRight: -8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  itemMenuContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "stretch",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 5,
    position: "relative",
  },
  backIcon: {
    color: "#4F4F4F",
    fontSize: 35,
    marginBottom: -5,
  },
  space: {
    paddingVertical: 0,
  },
  input: {
    borderBottomColor: colors.border2,
    borderBottomWidth: 2,
    // width: '100%',
    paddingVertical: 10,
    marginVertical: 7,
    paddingLeft: 45,
  },
  button: {
    backgroundColor: "#41b17a",
    padding: 10,
    borderRadius: 3,
    shadowColor: "#000",
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  button2: {
    // backgroundColor: ,
    width: "30%",
    marginHorizontal: 8,
    padding: 7.5,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "rgb(0,0,0)",
    marginTop: 5,
    borderWidth: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,

    elevation: 5,
  },
  buttonLogin: {
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 50,
    fontSize: 18,
  },
  buttonLoginText: {
    color: colors.white,
    textAlign: "center",
  },
  banner: {
    resizeMode: "contain",
    width: "60%",
    height: null,
    right: 0,
    marginHorizontal: "20%",
    marginTop: "10%",
    // flex:1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 16 / 9, // Image ratio
    // borderRadius: 120,
  },
  text: {
    color: "#fff",
  },
  text_input: {
    color: "white",
    fontSize: 16,
  },
  input_block: {
    position: "relative",
    padding: 20,
    margin: 15,
  },
  blur: {
    backgroundColor: "#000",
    opacity: 0.5,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 30,
  },
  dropbox: {
    // flex: 1,
    position: "absolute",
    // backgroundColor:"red",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // opacity: 0.8
  },
  video: {
    position: "absolute",
    backgroundColor: "red",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },

  container: {
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 90,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  block_app: {
    width: "48%",
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  block_menu: {
    paddingRight: 7,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    // height: 100,

    // borderRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  btn_menu: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "2.5%",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  footer_login: {
    alignItems: "center",
    padding: 22,
    paddingBottom: 0,
    width: "100%",
    justifyContent: "center",
    // flex: 1,
  },
  footer: {
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "center",
    width: windowWidth,
    // marginBottom: -33,
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
  footer2: {
    position: 'absolute',
    bottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    width: windowWidth,
    // marginBottom: -33,
    paddingBottom: 25,
    zIndex: 2,
    paddingTop: 15,

  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginBottom: 10,
  },
  dividerLine: {
    // flex: 1,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  dividerText: {
    width: 50,
    textAlign: "center",
    color: colors.warning,
  },
  buttonRegister: {
    width: "100%",
    // backgroundColor: "#e7f3ff",
  },
  buttonRegisterText: {
    color: colors.warning,
  },
  badge: {
    backgroundColor: colors.red,
    padding: 5,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badge2: {
    backgroundColor: colors.red,
    padding: 3,
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -7,
    right: 15,
  },
  badge3: {
    position: "absolute",
    right: -10,
    top: -10,
    flex: 1,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 35 / 2,
    backgroundColor: "#FD646F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerContainer: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  container_layout: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,

  },
  container_full: {
    // backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ////////////////// pincode //////////
  containerCenter: {
    // marginTop: '0%',
    // justifyContent: "center",
    alignItems: "center",
  },
  pinBox: {
    backgroundColor: "transparent",
    height: 60,
    width: 60,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    margin: 13,
  },
  pinBoxZero: {
    backgroundColor: "transparent",
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    margin: 12,
    marginLeft: 118,
  },
  pinDelete: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
  },
  faceId: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
  },
  pinBoxText: {
    fontFamily: fontFamily.Prompt,
    fontSize: 25,
    color: colors.black,
  },
  pinContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: "10%",
    // maxWidth: 392,
    flex: 1
  },
  titleText: {
    fontSize: 30,
  },
  putListContainer: {
    margin: 16,
    display: "flex",
    flexDirection: "row",
  },
  putCode: {
    marginHorizontal: 8,
    borderRadius: 50,
    borderWidth: 1,
    height: 16,
    width: 16,
    borderColor: colors.green,
  },
  fill: {
    backgroundColor: "#29658A",
  },
  outFill: {
    backgroundColor: "#000",
  },
  checkinButton: {
    width: 340,
    height: 340,
    borderRadius: 170,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  blockSearch1: {
    minHeight: 40,
    borderRadius: 10,
    paddingVertical: 10,
  },
  blockSearch: {
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.border2,
    borderWidth: 1,
    paddingVertical: 10,
    flexDirection: "row",
    minHeight: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
  blockText: {
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.border2,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 15,
  },
  text_left: {
    fontSize: 14,
    color: "#000",
    textAlign: "left",
    paddingLeft: 40,
    flex: 1,
    paddingRight: 10,
    width: "100%",
  },
  iconLeft: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 5,
    top: 0,
    bottom: 0,
    width: 30,
  },
  iconRight: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 5,
    top: 0,
    bottom: 0,
    width: 30,
  },
  block_disable: {
    backgroundColor: colors.disable,
  },
  blockcard: {
    flex: 1,
    marginVertical: 7.5,
    justifyContent: 'center',
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
  blockcard2: {
    paddingVertical: 7,
  },
  blockcard3: {
    // flex: 1,
    marginVertical: 7.5,
    padding: 7.5,
    // borderWidth: 1,
    borderRadius: 10,
    // borderColor: "#D0D0D0",
    backgroundColor: "rgb(247, 247, 250)",
    opacity: 0.96,
  },
  title_red: {
    backgroundColor: colors.red,
    marginTop: -8,
    marginHorizontal: -8,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    padding: 7,
  },
  input_qty: {
    backgroundColor: colors.white,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    // padding: 10
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(203, 213, 224)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 5,
  },
  closeMenuButton: {
    backgroundColor: colors.danger,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    justifyContent: "center",
    alignItems: "center",
    // width: '100%'
  },
  alert: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 26,
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
  },
  alert2: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    alignItems: "flex-start",
    width: "100%",
    justifyContent: "center",
  },
  alertText: {
    textAlign: "center",
    // marginTop: 15,
  },
  block_title: {
    padding: 5,
    paddingBottom: 15,
  },
  block_dropdown: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: colors.border2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
  block_dropdown2: {
    // paddingLeft: 45,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E7F0FD",
    shadowColor: "rgb(90, 91, 106)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 4,
  },
  not_ready: {
    opacity: 0.5,
  },
  detail_label: {
    fontWeight: "600",
    fontSize: 16,
    paddingVertical: 7.5,
  },
  detail_value: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  header_label: {
    fontWeight: "600",
    fontSize: 18,
    paddingLeft: 10,
    paddingVertical: 0,
    fontWeight: "600",
    color: "#fff",
  },
  logo: {
    justifyContent: "center",
    alignContent: "center",
    padding: 30,
    width: "90%",
    height: 130,
    marginTop: 2,
  },
  OpacityButton: {
    justifyContent: "center",
    margin: 10,
    borderRadius: 10,
    height: 180,
    backgroundColor: "#fff",
    width: "45%",
  },
  buttonText: {
    color: "#4051b3",
    textAlign: "center",
    textAlignVertical: "bottom",
    paddingVertical: 15,
  },
  smallInputStyle: {
    color: "white",
    fontSize: smallText,
  },
  buttonTextPR: {
    color: "#000306",
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "bottom",
    paddingVertical: 15,
  },
  customTitle: {
    color: "#000",
    fontSize: 16,
    textAlign: "left",
    width: "60%",
    // fontFamily: "KanitLight",
  },
  row_duo: {
    flexDirection: "row",
    paddingVertical: 9,
    justifyContent: "space-between"
  },
  block_item: {
    width: "48%",
    height: 75,
    borderRadius: 7,
  },
  block_item2: {
    width: 100,
    marginHorizontal: 7.5,
    height: 75,
    borderRadius: 7,
  },
  block_other: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,

  },
  block_otherapp: {
    width: 100,
    marginHorizontal: 7.5,
    height: 75,
    borderRadius: 7,
    shadowColor: "rgb(00, 00, 00)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 2,
  },
  block_item3: {
    width: "20%",
    marginHorizontal: 10,
    height: 75,
    borderRadius: 7,
    alignSelf: "center",
  },
  icon_app: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  //new home
  NH_h1: {
    fontFamily: fontFamily.Prompt,
    fontSize: 28
  },

  NH_h2: {
    fontFamily: fontFamily.Prompt,
    fontSize: 24
  },

  NH_h3: {
    fontFamily: fontFamily.Prompt,
    fontSize: 20
  },

  NH_h4: {
    fontFamily: fontFamily.Prompt,
    fontSize: 16
  },

  NH_h4_bold: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 16
  },
  projecttitle: {
    color: "white",
    paddingLeft: 14,
    paddingTop: 8
  },
  ///
  /* Mango IC */
  BtnRed: {
    backgroundColor: colors.red,
    borderRadius: 20,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
  },
  BtnWhite: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
  },
  Textbtn_red: {
    color: colors.red,
    fontSize: windowWidth > widthScreen ? 20 : 14,
  },
  Textbtn_white: {
    color: "white",
    fontSize: windowWidth > widthScreen ? 20 : 14,
  },
  block_menuIC: {
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 20,
    marginTop: 15,
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    paddingRight: 7,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  block_cardIC: {
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 7,
    marginTop: 15,
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    borderWidth: 1,
    borderColor: "#E7F0FD"



  },
  TextBlockIC: {
    color: colors.grey_t,
    fontSize: windowWidth > widthScreen ? 25 : 14
  },
  TextMenuIC_Sec: {
    color: colors.red,
    padding: 5,
    fontSize: windowWidth > widthScreen ? 25 : 14
  },
  TextMenu: {
    color: colors.grey_t,
    padding: 5,
    fontSize: windowWidth > widthScreen ? 25 : 14
  },
  /*QC */
  TextQC_other: {
    fontFamily: fontFamily.Prompt,
    fontSize: 14,
    fontWeight: "500",
  },
  Text_QC: {
    fontFamily: fontFamily.Prompt,
    fontSize: 14,
    fontWeight: "500",
    color: "#001B7A"
  },
  customCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.05,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    padding: 0,
    backgroundColor: color.white
  },
  TextHead: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
    width: 80,
    color: colors.black_t,
    alignSelf: "center"
  },
  TextMid: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
    color: colors.black_t,
    width: 10,
    marginLeft: 5,
    alignSelf: "center"
  },
  TextBot: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
    color: colors.black_t,
    alignSelf: "center",
    flex: 1,
  },
  TextBotInput: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
    color: colors.black_t,
    alignSelf: "center",
    flex: 1,
    marginLeft: 5,
  },
  TextBotProject: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    paddingVertical: 0,
    color: colors.black_t,
    flex: 1,
    marginLeft: 8,
  },
  TextDate: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    color: colors.black_t,
    marginLeft: 5,
    flex: 10,
    marginTop: 3
  },
  blockInput: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.border2,
    borderWidth: 1,
    paddingVertical: 5,
    flexDirection: "row",
    minHeight: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
  TextDateF2: {
    fontFamily: fontFamily.Prompt_bold,
    fontSize: 14,
    color: colors.black_t,
    marginLeft: 5,
    flex: 10,
    marginTop: 2
  },
  blockInputF2: {
    flex: 1,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.border2,
    borderWidth: 1,
    paddingVertical: 5,
    flexDirection: "row",
    minHeight: 40,
    shadowColor: "#000",
    opacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },

  //Drop down element picker
  dropdown: {
    height: 50,
    // width: "100%",
    left: 0,
    borderWidth: 1,
    paddingLeft: 7.5,
    borderColor: colors.border2,
    borderRadius: 10,
    padding: 5,
    shadowColor: "rgb(90, 91, 106)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: colors.white
  },
  dropdownRemark: {
    height: 50,
    width: "80%",
    left: 0,
    borderWidth: 1,
    paddingLeft: 7.5,
    borderColor: colors.border2,
    borderRadius: 10,
    padding: 5,
    shadowColor: "rgb(90, 91, 106)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: colors.white
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemTextStyle: {
    height: 20,
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  documentNumber: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkText: {
    marginLeft: 8,
    color: '#333333CC',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  radioButtonSelected: {
    borderColor: '#333333CC',
  },
  radioText: {
    marginLeft: 4,
  },
  passText: {
    color: 'green',
  },
  failText: {
    color: 'red',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  albumItem: {
    flexDirection: 'row',
    backgroundColor: colors.bluesea,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2, // Shadow effect for Android
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  albumCoverContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyCover: {
    backgroundColor: "red",
    width: '100%',
    height: '100%',
  },
  albumInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumCount: {
    fontSize: 14,
    color: '#888',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    color: '#444',
  },
  flatListContent: {
    padding: 10,
},
});
