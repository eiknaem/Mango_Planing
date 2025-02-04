import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { useTheme } from '../../components/themeProvider';
import { styles as globalStyles, colors } from "../../stylesheet/styles";

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const [lang, setLang] = useState({});
    const [userType, setUserType] = useState(null);
    const [dataServer, setDataServer] = useState(null);
    const [modelShow, setModelShow] = useState(null);
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const [mainname, setMainname] = useState(null);
    const [empname, setEmpname] = useState(null);
    const [dataoutsource, setDataoutsource] = useState({});
    const [themes, setThemes] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: themes === 'light' ? colors.white : colors.back_bg,
                shadowColor: "transparent",
                elevation: 0,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerTintColor: themes === 'light' ? colors.black : colors.white,
            headerLeft: () => headerLeft(),
            title: lang.profile || 'โปรไฟล์'
        });
    }, [navigation, themes, lang]);

    const headerLeft = () => {
        return (
            <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={themes === 'light' ? colors.black : colors.white}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const ongetimg = (download, file) => {
        if (file) {
            const imgUrl = dataServer + "api/file/download/?download=" + download + "&id=" + file;
            return { uri: imgUrl };
        } else {
            // return require("../../assets/images/user.png");
        }
    };

    const onloadinfo = async () => {
        setModelShow('load');
        setVisible(true);
        const userType = await getDataStorage("usertype");
        setUserType(userType);

        const serverData = await getDataStorage("sitevalue_key");
        setDataServer(serverData);

        let res = await xt.getServer('api/public/ViewInitData2?menu_name=&lang_code=');

        setProfile(res.data.appinfo.profile);
        setMainname(res.data.auth.mainname);
        setEmpname(res.data.auth.empname);

        if (userType !== "Outsource") {
            await onloademp(res.data.auth.empno);
        } else {
            await onloadoutsource(res.data.auth.empcode);
        }

    };

    const onloademp = async (empno) => {
        let res = await xt.getServer(`Anywhere/Management/EmployeeRead?empno=${empno}`);
        setDataoutsource({
            dc_phone: res.data.data.empmob,
            dc_email: res.data.data.email,
            status: 1
        });
        setVisible(false);
    };

    const onloadoutsource = async (empcode) => {
        let res = await xt.getServer(`Planning/Planning/outsource_Read?dc_code=${empcode}`);
        setDataoutsource(res.data);
        setVisible(false);
    };

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
        let themes_key = await getDataStorage("themes_ppn") || "light";
        setThemes(themes_key);
    };

    useFocusEffect(
        useCallback(() => {
            getLangDF();
            onloadinfo();
        }, [])
    );

    return (
        <View style={[styles.container, { backgroundColor: themes === 'light' ? colors.white : colors.back_bg }]}>
            <ScrollView>
                <View style={[styles.header, { backgroundColor: themes === 'light' ? colors.white : colors.font_dark }]}>
                    <Image
                        style={styles.profileAvatar}
                        source={ongetimg(false, profile)}
                    />
                    <Text style={[styles.welcomeText, { color: colors.green }]}>
                        {lang.hello || 'สวัสดี'}
                    </Text>
                    <Text style={[styles.nameText, { color: themes === 'light' ? colors.grey_t : colors.grey_pr }]}>
                        {empname}
                    </Text>

                    <View style={styles.infoContainer}>
                        <Text style={[styles.infoLabel, { color: themes === 'light' ? colors.grey : colors.grey_pr }]}>
                            เบอร์โทร : {' '}
                            <Text style={{ color: themes === 'light' ? colors.black : colors.white }}>
                                {dataoutsource.dc_phone || "ไม่พบเบอร์โทรศัพท์"}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={[styles.infoLabel, { color: themes === 'light' ? colors.grey : colors.grey_pr }]}>
                            E-mail : {' '}
                            <Text style={{ color: themes === 'light' ? colors.black : colors.white }}>
                                {dataoutsource.dc_email || "ไม่พบอีเมล"}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={[styles.mainName, { color: themes === 'light' ? colors.grey : colors.grey_pr }]}>

                            {mainname}
                        </Text>
                    </View>

                    <View style={styles.messageContainer}>
                        <Text style={[styles.messageText, { color: themes === 'light' ? colors.black : colors.white }]}>
                            ขณะนี้การลงทะเบียนของท่านได้อยู่ระหว่างการตรวจสอบจากทาง {' '}
                            <Text style={{ color: '#FFA500' }}>
                                {mainname}
                            </Text>
                            {' '}ท่านจะสามารถใช้งานระบบ Mango Planning ได้หลังผ่านการตรวจสอบ
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {dataoutsource.status === 0 && (
                            <View style={[styles.statusButton, { backgroundColor: '#FFA500' }]}>
                                <Text style={styles.statusButtonText}>รอการตรวจสอบจากระบบ</Text>
                            </View>
                        )}
                        {dataoutsource.status === 1 && (
                            <View style={[styles.statusButton, { backgroundColor: colors.green }]}>
                                <Text style={styles.statusButtonText}>ผ่านการตรวจสอบจากระบบ</Text>
                            </View>
                        )}
                        {dataoutsource.status === 2 && (
                            <View style={[styles.statusButton, { backgroundColor: colors.red }]}>
                                <Text style={styles.statusButtonText}>ไม่ผ่านการตรวจสอบจากระบบ</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 24,
        alignItems: 'center',
        minHeight: height,
    },
    profileAvatar: {
        width: 124,
        height: 124,
        borderRadius: 62,
        marginVertical: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    nameText: {
        fontSize: 18,
        marginBottom: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
    },
    mainName: {
        fontSize: 16,
        textAlign: 'center',
    },
    messageContainer: {
        padding: 20,
    },
    messageText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 32,
        width: '60%',
    },
    statusButton: {
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
    },
});

export default ProfileScreen;