import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from './../../stylesheet/colors';
import { font } from './../../stylesheet/fonts';
import { getDataStorage, setDataStorage } from '../../api/service';


export default function SearchScreen({ route, navigation }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);



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
        // ใช้ค่าที่ส่งมาถ้ามี ถ้าไม่มีใช้ค่าจาก state
        const searchText = value || searchValue;

        if (searchText.trim()) {
            const routeName = route.params?.routeName;

            // บันทึกค่าค้นหา
            if (routeName === 'Project') {
                await setDataStorage("ProjectsearchValue", searchText);
            } else if (routeName === 'Plans') {
                await setDataStorage("plansearchValue", searchText);
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

    useEffect(() => {
        // const routeName = route.params?.routeName;
        // console.log('routeName :', routeName);
        getSearchHistory();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color={color.grey_t} style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="ค้นหา..."
                        value={searchValue}
                        onChangeText={setSearchValue}
                        returnKeyType="search"
                        onSubmitEditing={() => handleSearch()} 
                    />
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* ประวัติการค้นหาล่าสุด */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[font.h4_bold]}>ประวัติการค้นหาล่าสุด</Text>
                        <TouchableOpacity onPress={() => { clearHistory() }}>
                            <Text style={[font.h5, styles.clearButton]}>ล้างทั้งหมด</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.historyContainer}>
                        {searchHistory.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.historyItem}
                                onPress={() => {
                                    handleSearch(item);
                                }}
                            >
                                <Text style={styles.historyText}>{item}</Text>
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