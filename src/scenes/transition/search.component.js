import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from './../../stylesheet/colors';
import { font } from './../../stylesheet/fonts';
import { xt, getDataStorage, setDataStorage } from '../../api/service';


export default function SearchScreen({ route, navigation }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [themes, setThemes] = useState('');
    const [lang, setLang] = useState({});

    const loadTheme = async () => {
        const themes_key = await getDataStorage("themes_ppn") || "light";
        setThemes(themes_key);
    };

    const getLangDF = async () => {
        let lang_ = await xt.getLang();
        setLang(lang_);
    };

    const getSearchHistory = async () => {
        try {
            const history = await getDataStorage(`${route.params?.routeName}_history`);
            if (history) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.log("Error loading history:", error);
        }
    };

    const handleSearch = async (value) => {

        const searchText = value || searchValue;

        if (searchText.trim()) {
            const routeName = route.params?.routeName;

            switch (routeName) {
                case 'Project':
                    await setDataStorage("ProjectsearchValue", searchText);
                    break;
                case 'Plans':
                    await setDataStorage("plansearchValue", searchText);
                    break;
                case 'Tasks':
                    await setDataStorage("tasksearchValue", searchText);
                    // console.log('Task Search');
                    break
                default:
                    break;
            }

            // บันทึกประวัติ
            const newHistory = [searchText, ...searchHistory.filter(h => h !== searchText)];
            setSearchHistory(newHistory);
            await setDataStorage(`${routeName}_history`, JSON.stringify(newHistory));


            navigation.goBack();
        }
    };

    const clearHistory = async () => {
        const routeName = route.params?.routeName;

        Alert.alert(
            'ยืนยันการลบ',
            'คุณต้องการลบประวัติการค้นหาทั้งหมดหรือไม่?',
            [
                {
                    text: 'ยกเลิก',
                    style: 'cancel'
                },
                {
                    text: 'ยืนยัน',
                    onPress: async () => {
                        setSearchHistory([]);
                        await setDataStorage(`${routeName}_history`, JSON.stringify([]));
                    }
                }
            ]
        );
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        getLangDF();
        loadTheme();
        getSearchHistory();
        // const routeName = route.params?.routeName;
        // console.log('routeName :', routeName);
    }, []);

    return (
        <View style={[styles.container, {
            backgroundColor: themes === 'light' ? color.white : color.back_bg
        }]}>
            {/* ส่วน Search */}
            <View style={styles.boxsort}>
                <TouchableOpacity
                    style={{ height: 50, width: 50, justifyContent: 'center' }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={themes === 'light' ? color.black : color.white}
                    />
                </TouchableOpacity>

                {/* Input Search */}
                <View style={[styles.searchInput, {
                    backgroundColor: themes === 'light' ? color.white : color.font_dark,
                    borderColor: color.green,
                }]}>
                    <TextInput
                        style={[styles.input, {
                            color: themes === 'light' ? color.black : color.white
                        }]}
                        placeholder={lang.search}
                        placeholderTextColor={themes === 'light' ? color.grey_t : color.white}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        returnKeyType="search"
                        autoCapitalize="none"
                    />
                </View>

                {/* ปุ่ม Search */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => handleSearch()}
                >
                    <Text style={{ color: color.white }}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* ส่วนประวัติการค้นหา */}
            {searchHistory.length > 0 && (
                <View style={styles.boxSeach}>
                    <View style={styles.itemFooter}>
                        <View style={{ width: '85%', paddingLeft: 10 }}>
                            <Text style={[styles.text, {
                                color: themes === 'light' ? color.black : color.white
                            }]}>{lang.search_history}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => clearHistory()}
                        >
                            <Ionicons name="trash" size={20} color={color.grey_pr} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* แสดงประวัติการค้นหา */}
            <View style={styles.boxhistory}>
                {searchHistory.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.historyButton, {
                            backgroundColor: themes === 'light' ? color.white : color.white,
                            borderWidth: 1,
                            borderColor: color.border2,
                        }]}
                        onPress={() => handleSearch(item)}
                    >
                        <Text style={{
                            color: themes === 'light' ? color.grey_t : color.black
                        }}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxsort: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginTop: 50,
        marginHorizontal: 5
    },
    searchInput: {
        flex: 1,
        height: 35,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 15,
        marginLeft: 0,
    },
    input: {
        flex: 1,
        fontSize: 14,
    },
    searchButton: {
        marginHorizontal: 10,
        backgroundColor: color.green,
        borderRadius: 20,
        height: 35,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    boxSeach: {
        flexDirection: 'row',
        paddingLeft: 15,
        marginTop: 15,
    },
    itemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    clearButton: {
        padding: 8,
        backgroundColor: color.white,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: color.border2
    },
    boxhistory: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        marginTop: 10,
        gap: 5
    },
    historyButton: {
        margin: 2,
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
});