import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    Image,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { BOX, TEXT, SHADOW } from "../stylesheet/style_pc";
import { Circle } from 'react-native-animated-spinkit';
import Swiper from "react-native-swiper";
import ImageViewer from 'react-native-image-zoom-viewer';
function GalleryModalSelect({ modalVisible, onModalClose, pathImage, indexPath }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isGotoIndex, setGotoIndex] = useState(0)
    // console.log("pathImage", pathImage);
    // console.log("modalVisible", modalVisible);
    // console.log("indexPath",indexPath);
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
                <Swiper
                    style={styles.wrapper}
                    showsButtons
                    loop={false}
                    index={indexPath}
                    dot={
                        <View
                            style={{
                                backgroundColor: "rgba(255,255,255,0.3)",
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginLeft: 5,
                                marginRight: 5,
                            }}
                        />
                    }
                    activeDot={
                        <View
                            style={{
                                backgroundColor: "#fff",
                                width: 13,
                                height: 13,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7,
                            }}
                        />
                    }
                    nextButton={
                        <Text style={styles.buttonText}>
                            <Entypo name="chevron-right" size={24} color="white" />
                        </Text>
                    }
                    prevButton={
                        <Text style={styles.buttonText}>
                            <Entypo name="chevron-left" size={24} color="white" />
                        </Text>
                    }
                >
                    {pathImage.map((item, i) => (
                        <View key={i} style={{ flexDirection: "row", flex: 1 ,alignItems:"center"}}>
                            <View style={{
                                // flex: 1,
                                width:"100%",
                                height:"70%",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#dedede", marginTop: "10%"
                            }}>
                                <ImageViewer
                                    imageUrls={[{ url: item.uri }]}
                                    enableImageZoom={true}
                                    resizeMode={'center'}
                                    renderIndicator={() => null}
                                    // renderIndicator={(currentIndex, allSize) => (
                                    //     <View
                                    //         style={{
                                    //             position: 'absolute',
                                    //             top: 20,        // ย้ายลงมาจากขอบบน ตามต้องการ
                                    //             left: 0,
                                    //             right: 0,
                                    //             alignItems: 'center',
                                    //             zIndex: 9999,   // เพิ่มหากต้องการให้ตัวอักษรอยู่หน้าสุด
                                    //         }}
                                    //     >
                                    //         <Text style={{ color: '#fff', fontSize: 16 }}>
                                    //             {`รูปที่ ${indexPath} จากทั้งหมด ${allSize}`}
                                    //         </Text>
                                    //     </View>
                                    // )}
                                    loadingRender={() => setIsLoading(false)}
                                    style={{
                                        width: "100%",
                                        // flex: 1,
                                        height: "100%",
                                        justifyContent: "center",

                                    }}
                                ></ImageViewer>
                            </View>
                        </View>
                    ))}
                </Swiper>
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

export default React.memo(GalleryModalSelect);
