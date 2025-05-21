import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Alert,
    Modal,
    SafeAreaView,
    StyleSheet
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import linq from "js-linq";
import { styles as appStyles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTheme } from "../../components/themeProvider";
export default function ProgresshistoryScreen({ route, navigation }) {
    const $linq = arr => new linq(arr);
    const [lang, setLang] = useState({});
    const [dataServer, setDataServer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataprogresshistory, setDataprogresshistory] = useState([]);
    const [dataprogressimghistory, setDataprogressimghistory] = useState([]);
    const [openGallery, setGallery] = useState(false);
    const [isIndex, setIndex] = useState(0);
    const { width, height } = Dimensions.get('window');
    const { themeObject } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: lang.progress_history || 'ประวัติการอัปเดตความคืบหน้า',
            headerStyle: { backgroundColor: themeObject.colors.background },
            headerTintColor: themeObject.colors.text,
            headerTitleAlign: 'center',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", }}
                        onPress={() => goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={themeObject.colors.text} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, lang]);

    const onimghistory = (item, index) => {
        let params_ = route.params;
        params_.refitemno = item.itemno;
        params_.imglist = item.imglist;
        params_.progress_date = item.progress_date;

        let extension_ = ["mp4", "m4a", "m4v", "f4v", "f4a", "m4b", "m4r", "f4b", "mov", "3gp", "3gp2", "3g2", "3gpp", "3gpp2", "flv"];
        if (extension_.includes(item.extension)) {
            navigation && navigation.navigate('Video', item);
        } else {
            onLoadGallery(params_, index);
        }
    };

    const onLoadGallery = async (params_, index) => {
        const serverUrl = await getDataStorage("sitevalue_key");
        setDataServer(serverUrl);

        let url = `Planning/Planning/Planning_task_history_Photo?pre_event2=${params_.pre_event2}&pre_event=${params_.pre_event}&plan_code=${params_.plan_code}&taskid=${params_.taskid}&refitemno=${params_.refitemno}&date=${moment(params_.progress_date).format('DD-MM-YYYY')}`;

        let rsp = await xt.getServer(url);
        const sortedData = $linq(rsp.data).orderBy(x => x.itemno).toArray();

        setDataprogressimghistory(sortedData);
        setGallery(true);
        setIndex(index);
    };

    const renderGallery = () => {
        const images = dataprogressimghistory.map((data) => ({
            url: xt.getimg(dataServer, false, data.pathto).uri,
        }));

        return (
            <View style={localStyles.galleryContainer}>
                <ImageViewer
                    index={isIndex}
                    imageUrls={images}
                    enableImageZoom={true}
                    renderHeader={(currentIndex) => {
                        const currentData = dataprogressimghistory[currentIndex];
                        return (
                            <View style={localStyles.galleryHeader}>
                                <TouchableOpacity
                                    style={localStyles.backButton}
                                    onPress={() => setGallery(false)}
                                >
                                    {/* <Ionicons name="arrow-back" size={24} color="white" /> */}
                                    <Text style={localStyles.backText}>
                                        {lang.back || 'ย้อนกลับ'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={localStyles.imageInfo}>
                                    <Text style={localStyles.imageInfoText}>
                                        <Text style={localStyles.imageInfoLabel}>
                                            {lang.img_location || 'พิกัดภาพ'}:
                                        </Text> {currentData.gps_location_coordinates}
                                    </Text>
                                    <Text style={localStyles.imageInfoText}>
                                        <Text style={localStyles.imageInfoLabel}>
                                            {lang.remark || 'หมายเหตุ'}:
                                        </Text> {currentData.remark}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    };

    const renderImageItem = ({ item, index }) => (
        <TouchableOpacity
            style={localStyles.imageCard}
            onPress={() => onimghistory(item, index)}
        >
            <Image
                style={localStyles.imageItem}
                source={(item.type == 1) ? item.video_ph : xt.getimg(dataServer, false, item.pathto)}
            />
        </TouchableOpacity>
    );

    const renderProgressItem = ({ item }) => (
        <View style={{
            backgroundColor: themeObject.colors.card,
            borderRadius: 8,
            marginBottom: 10,
            padding: 12,
            shadowColor:themeObject.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        }}>
            <View style={localStyles.progressRow}>
                <View style={localStyles.progressInfoLeft}>
                    <Text style={localStyles.progressLabel}>
                        {lang.qty || 'จำนวน'}:
                        <Text style={localStyles.progressValue}> {xt.dec(item.qty, route.params?.decimal || 2)}</Text>
                    </Text>
                </View>
                <View style={localStyles.progressInfoRight}>
                    <Text style={localStyles.progressLabel}>
                        {lang.update_date || 'วันที่อัปเดต'}:
                        <Text style={localStyles.dateValue}> {xt.getDate(new Date(item.progress_datetime), lang.lang_wh)}</Text>
                    </Text>
                </View>
            </View>

            {item.desc_name && (
                <View style={localStyles.progressDetail}>
                    <Text style={localStyles.progressLabel}>
                        {lang.incidence || 'ปัญหาที่พบ'}:
                        <Text style={localStyles.detailValue}> {item.desc_name}</Text>
                    </Text>
                </View>
            )}

            {item.remark && (
                <View style={localStyles.progressDetail}>
                    <Text style={localStyles.progressLabel}>
                        {lang.remark || 'หมายเหตุ'}:
                        <Text style={localStyles.detailValue}> {item.remark}</Text>
                    </Text>
                </View>
            )}

            <View style={localStyles.progressDetail}>
                <Text style={localStyles.progressLabel}>
                    {lang.update_by || 'ผู้อัปเดต'}:
                    <Text style={localStyles.detailValue}> {item.progress_by || (lang.not_data || 'ไม่พบข้อมูล')}</Text>
                </Text>
            </View>

            {(item.img_count > 0) && (
                <FlatList
                    style={localStyles.imagesList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={item.imglist}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}

            <View style={localStyles.itemDivider} />
        </View>
    );

    const onloadData = async () => {
        setLoading(true);

        const serverUrl = await getDataStorage("sitevalue_key") || "";
        setDataServer(serverUrl);

        let url = `Planning/Planning/Planning_task_history?pre_event2=${route.params.pre_event2}&pre_event=${route.params.pre_event}&plan_code=${route.params.plan_code}&taskid=${route.params.taskid}&refitemno=${route.params.refitemno}&date=${moment(route.params.progress_date).format('DD-MM-YYYY')}`;

        try {
            let rsp = await xt.getServer(url);
            let dataR = rsp.data;

            let extension_ = ["mp4", "m4a", "m4v", "f4v", "f4a", "m4b", "m4r", "f4b", "mov", "3gp", "3gp2", "3g2", "3gpp", "3gpp2", "flv"];
            dataR.forEach((v, i) => {
                v.imglist.forEach((vv, ii) => {
                    let extension = xt.getFileExtension(vv.docdesc).toLowerCase();
                    vv.site = serverUrl;
                    vv.type = (extension_.includes(extension)) ? 1 : 2;
                    // vv.video_ph = require("../../assets/images/20200605141056.gif");
                    vv.fullsite = serverUrl + "api/file/download/?download=false&id=" + vv.pathto;
                    vv.extension = extension;
                });
            });

            setDataprogresshistory(dataR);
        } catch (error) {
            console.error("Error loading progress history:", error);
            Alert.alert("Error", "ไม่สามารถโหลดข้อมูลประวัติได้");
        } finally {
            setLoading(false);
        }
    };

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
    };

    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            onloadData();
        }, [])
    );

    if (loading) {
        return (
            <View style={localStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.green} />
                <Text style={localStyles.loadingText}>กำลังโหลดข้อมูล...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: themeObject.colors.background
        }}>
            {dataprogresshistory.length > 0 ? (
                <FlatList
                    data={dataprogresshistory}
                    renderItem={renderProgressItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={localStyles.listContent}
                />
            ) : (
                <NoRows />
            )}

            {openGallery && renderGallery()}
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.grey_t,
    },
    listContent: {
        padding: 10,
    },
    progressItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressInfoLeft: {
        flex: 1,
        // backgroundColor: 'red',
    },
    progressInfoRight: {
        flex: 3,
        // backgroundColor: 'red',
    },
    progressLabel: {
        fontSize: 14,
        color: colors.black_t,
    },
    progressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.green,
    },
    dateValue: {
        fontSize: 14,
        color: colors.black,
    },
    progressDetail: {
        marginBottom: 8,
        paddingVertical: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    detailValue: {
        fontSize: 14,
        color: colors.black,
    },
    imagesList: {
        marginTop: 8,
        marginBottom: 8,
        height: 140,
    },
    imageCard: {
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    imageItem: {
        width: 180,
        height: 130,
        borderRadius: 8,
    },
    itemDivider: {
        height: 8,
    },
    galleryContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,1)',
        zIndex: 1000,
        // paddingTop: 15
    },
    galleryHeader: {
        width: "100%",
        // padding: 80,
        zIndex: 9999999,
        position: "absolute",
        left: 0,
        top: 30,
    },
    backButton: {
        padding: 10,
        alignSelf: 'flex-start'
    },
    backText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
    },
    imageInfo: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 8,
    },
    imageInfoText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    imageInfoLabel: {
        fontWeight: 'bold',
    }
});