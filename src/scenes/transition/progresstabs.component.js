import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    Keyboard,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    ListRenderItemInfo,
    ScrollView,
    ViewProps,
    Alert,
    StyleSheet,
    SafeAreaView,

} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";
import moment from 'moment';
import { CheckViewPPN } from "../../components/variousRights";
import { apiAuth } from "../../api/authentication";
import { UpdateProgress_UR } from "../../components/variousRights";
import $xt from "../../api/xtools";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ProgressScreen from "./progress.component";
import { useTheme } from "../../components/themeProvider";
export default function ProgresstabScreen({ route, navigation }) {

    const Params = route.params;
    console.log("Params1:", Params);
    
    const [lang, setLang] = useState({});
    const [themes, setthemes] = useState("");
    const { width, height } = Dimensions.get('window');
    const { themeObject } = useTheme();

     useLayoutEffect(() => {
        navigation.setOptions({
            title: "Update Progress",
            headerStyle: {
                backgroundColor: themeObject.colors.background,
                headerTintColor: themeObject.colors.text,
                shadowColor: "transparent",
                elevation: 0,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight(),
        });
    }, [navigation, themes]);

    const headerLeft = () => (
        <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ marginRight: '20%', justifyContent: "center", alignItems: "center", }}
                onPress={() => goBack()}
            >
                <Ionicons name="chevron-back" size={24} color={themes == 'light' ? colors.black : colors.white} />
            </TouchableOpacity>
        </View>
    );
    const headerRight = () => {
        return (
            <>
                <TouchableOpacity onPress={() => HousegoBack()}>
                    <FontAwesome name="home" size={24} color={(themes == 'light') ? "black" : "#fff"} style={{ marginRight: 10 }} />
                </TouchableOpacity>
            </>
        )
    }

    const HousegoBack = () => {
        // let nerArr = [];
        navigation.navigate("Tasks", {
            // dataTaskSearch: nerArr,
            dataAgeSearch: 1,
            pre_event: route.params.pre_event,
            pre_event2: route.params.pre_event2,
            plan_code: route.params.plan_code,
            point: "load",
            managerplan: route.params.manager,
            decimal: route.params.decimal,
        })
    }

    const goBack = () => {
        if (route.params.navfrom == 'NOTI') {
            navigation.goBack();
        } else {
            navigation.navigate('Tasks', {
                dataTaskSearch: route.params.dataTask,
                dataAgeSearch: route.params.dataAge,
                point: "search",
                pre_event: route.params.pre_event,
                pre_event2: route.params.pre_event2,
                plan_code: route.params.plan_code,
                managerplan: route.params.manager,
                decimal: route.params.decimal,
            });
        }
    }


    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)
    }

    useEffect(() => { // เริ่มต้นการทำงาน
        getLangDF();
    }, []);

    const TopTab = createMaterialTopTabNavigator();


    return (
        <SafeAreaView style={{ flex: 1 }} insets='top'>
            <TopTab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 12 },
                    tabBarItemStyle: { width: 100 },
                    tabBarStyle: { backgroundColor: (themes == "light") ? "#fff" : "rgba(52, 52, 52, 0)" },
                    tabBarScrollEnabled: true,
                    tabBarIndicatorStyle: {
                        backgroundColor: "blue",
                        height: 6,
                        width: 90,
                        marginLeft: 5,
                        marginRight: 5,
                        borderRadius: 10
                    },
                    tabBarActiveTintColor: "blue",
                    tabBarInactiveTintColor: ((themes == "light") ? "#000" : "#fff")
                }}
            // tabBar={(props) => <ProductsTabBar {...props} />}
            >
                <TopTab.Screen
                    name="Progress"
                    component={ProgressScreen}
                    initialParams={Params}
                    options={{
                        // tabBarLabel: ({ color }) => (
                        //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        //         <Ionicons name="stats-chart" size={16} color={color} />
                        //         <Text style={{ color, marginLeft: 5 }}>Progress</Text>
                        //     </View>
                        // ),
                    }}
                />

            </TopTab.Navigator>
        </SafeAreaView>
    )
}