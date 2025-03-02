import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import LoadingRows from "../../components/loadingRows";
import NoRows from "../../components/noRows";

const { width, height } = Dimensions.get("window");

export default function IncidenceScreen({ route, navigation }) {
    const [lang, setLang] = useState({});
    const [themes, setthemes] = useState("");

    const { width, height } = Dimensions.get('window');
    const [dataIncidents, setDataIncidents] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const headerLeft = () => (
        <View style={{ flexDirection: 'row', width: width * 0.2, height: height * 0.04, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
                style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={24} color={colors.black} />
            </TouchableOpacity>
        </View>
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Update Progress",
            headerStyle: {
                backgroundColor: themes === 'light' ? colors.white : colors.back_bg,
                shadowColor: "transparent",
                elevation: 0,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerTintColor: themes === 'light' ? colors.black : colors.white, // แก้ไขตรงนี้

            headerLeft: () => headerLeft(),
        });
    }, [navigation, themes]);

    const onItemPress = (item) => {
        setDataStorage('incidence_key', item.desc_name);
        setDataStorage('incidence_code_key', item.desc_code);
        setDataStorage('incidence_select_key', "Y");
        navigation.goBack();
    };

    const loadIncidents = async () => {
        setIsLoading(true);
        try {
            let url = "Planning/Planning/onLoadMasterIncident";
            let res = await xt.getServer(url);

            if (res.data && res.data.length > 0) {
                setDataIncidents(res.data);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error("Error loading incidents:", error);
            setIsEmpty(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);

        let themes_key = await getDataStorage("themes_ppn") || "light";
        setthemes(themes_key)
    };

    useFocusEffect(
        React.useCallback(() => {
            getLangDF();
            loadIncidents();
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={localStyles.itemContainer}
            onPress={() => onItemPress(item)}
        >
            <View style={localStyles.itemContent}>
                <Text
                    style={localStyles.itemText}
                    numberOfLines={2}
                >
                    {item.desc_name}
                </Text>
                <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.grey_t}
                />
            </View>
            <View style={localStyles.separator} />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={localStyles.loadingContainer}>
                <LoadingRows />
            </View>
        );
    }

    return (
        <SafeAreaView style={localStyles.container}>
            {isEmpty ? (
                <View style={localStyles.emptyContainer}>
                    <NoRows />
                    <Text style={localStyles.emptyText}>
                        {lang.not_data || "ไม่พบข้อมูล"}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={dataIncidents}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.desc_code.toString()}
                    contentContainerStyle={localStyles.listContent}
                />
            )}
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        marginTop: 20,
        color: colors.grey_t,
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 24,
    },
    itemContainer: {
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: colors.white,
        overflow: "hidden",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
    itemText: {
        fontSize: 16,
        flex: 1,
        marginRight: 10,
        color: colors.black,
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        marginHorizontal: 16,
    },
});