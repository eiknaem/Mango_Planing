import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
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

            // บันทึกค่าค้นหา
            // if (routeName === 'Project') {
            //     await setDataStorage("ProjectsearchValue", searchText);
            // } else if (routeName === 'Plans') {
            //     await setDataStorage("plansearchValue", searchText);
            // }
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

    clearHistory = async () => {
        const routeName = route.params?.routeName;
        setSearchHistory([]);
        await setDataStorage(`${routeName}_history`, JSON.stringify([]));
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: themes === 'light' ? color.white : color.back_bg,
                shadowColor: "transparent",
                elevation: 0,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerTintColor: themes === 'light' ? color.black : color.white,
            headerLeft: () => (
                <TouchableOpacity 
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons 
                        name="arrow-back" 
                        size={24} 
                        color={themes === 'light' ? color.black : color.white} 
                    />
                </TouchableOpacity>
            ),
        });
    }, [themes]);
    
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
            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, {
                    backgroundColor: themes === 'light' ? color.white : color.font_dark,
                    borderColor: themes === 'light' ? color.border2 : color.image_light,
                }]}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={themes === 'light' ? color.grey_t : color.white}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.input, {
                            color: themes === 'light' ? color.black : color.white
                        }]}
                        placeholder={lang.search}
                        placeholderTextColor={themes === 'light' ? color.grey_t : color.white}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        returnKeyType="search"
                        onSubmitEditing={() => handleSearch()}
                    />
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={[styles.section, {
                    backgroundColor: themes === 'light' ? color.white : color.back_bg
                }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[
                            font.h4_bold,
                            { color: themes === 'light' ? color.black : color.white }
                        ]}>{lang.search_history}</Text>
                        <TouchableOpacity onPress={() => { clearHistory() }}>
                            <Text style={[font.h5, styles.clearButton]}>{lang.clear_history}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.historyContainer}>
                        {searchHistory.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.historyItem, {
                                    backgroundColor: themes === 'light' ? color.white : color.font_dark,
                                    borderColor: themes === 'light' ? color.border2 : color.image_light,
                                }]}
                                onPress={() => handleSearch(item)}
                            >
                                <Text style={[styles.historyText, {
                                    color: themes === 'light' ? color.grey_t : color.white
                                }]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    searchContainer: {
        padding: 15,
        // backgroundColor: 'red',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.border2,
        paddingHorizontal: 15,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: color.black,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    section: {
        marginBottom: 20,
        backgroundColor: color.white,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        // backgroundColor: 'red'
    },
    clearButton: {
        color: color.red,
    },
    sectionTitle: {
        fontSize: 16,
    },
    historyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: 'red',
        // alignItems:'center',
        // justifyContent: 'center'
    },
    historyItem: {
        backgroundColor: color.white,
        borderWidth: 1,
        borderColor: color.border2,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 5,
    },
    historyText: {
        fontSize: 14,
        color: color.grey_t,
    },
});