import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { color } from '../../stylesheet/colors';
import { xt, getDataStorage, setDataStorage } from '../../api/service';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

export default function SearchScreen({ route, navigation }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [themes, setThemes] = useState('');
    const [lang, setLang] = useState({});

    // สถานะการค้นหา
    const [isSearch, setIsSearch] = useState(true);
    const [isDate, setIsDate] = useState(false);

    // สถานะของงาน
    const [inprogress, setInprogress] = useState(true);
    const [complete, setComplete] = useState(false);
    const [notstart, setNotstart] = useState(true);
    const [delay, setDelay] = useState(true);
    const [overdue, setOverdue] = useState(true);

    // Modal และ DatePicker
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTimeStartShow, setTimeStartShow] = useState(false);
    const [modalTimeEndShow, setTimeEndShow] = useState(false);

    // วันที่
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [isFirstTimeStart, setFirstTimeStart] = useState(true);
    const [isFirstTimeEnd, setFirstTimeEnd] = useState(true);

    const [searchDataTask, setSearchDataTask] = useState([]);
    const [searchDataAge, setSearchDataAge] = useState(null);
    const [searchPreEvent, setSearchPreEvent] = useState('');
    const [searchPreEvent2, setSearchPreEvent2] = useState('');
    const [searchPlanCode, setSearchPlanCode] = useState('');
    const [searchManager, setSearchManager] = useState(null);

    const routeName = route.params?.routeName;



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
            let historyKey = '';

            switch (routeName) {
                case 'Plans':
                    historyKey = 'Plan_history';
                    break;
                case 'Tasks':
                    historyKey = 'Tasks_history';
                    break;
                default:
                    break;
            }

            const history = await getDataStorage(historyKey);
            if (history) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.log("Error loading history:", error);
        }
    };

    const handleSearch = async (value) => {
        const searchText = value || searchValue;

        switch (routeName) {
            case 'Plans':
                // บันทึกค่าค้นหา
                await setDataStorage("plansearchValue", searchText);
                await setDataStorage("planfilter", "Y");

                // บันทึกสถานะที่เลือก
                const planStatusArr = [];
                if (inprogress) planStatusArr.push("inprogress");
                if (complete) planStatusArr.push("complete");
                if (notstart) planStatusArr.push("notstart");
                if (overdue) planStatusArr.push("overdue");
                if (delay) planStatusArr.push("delay");

                await setDataStorage('statusValue', planStatusArr.join(","));

                // บันทึกวันที่ที่เลือก (ถ้ามี)
                if (!isFirstTimeStart && !isFirstTimeEnd) {
                    const timeObj = {
                        time_start: dateStart.toISOString(),
                        time_end: dateEnd.toISOString()
                    };
                    await setDataStorage('searchTime', JSON.stringify(timeObj));
                } else {
                    await setDataStorage('searchTime', "");
                }

                // บันทึกประวัติ
                if (searchText.trim()) {
                    const planHistory = await getDataStorage('Plan_history') || '[]';
                    const searchHistory = JSON.parse(planHistory);
                    const newHistory = [searchText, ...searchHistory.filter(h => h !== searchText)];
                    await setDataStorage('Plan_history', JSON.stringify(newHistory));
                }
                navigation.goBack();
                break;

            case 'Tasks':
                // บันทึกค่าค้นหา
                await setDataStorage("tasksearchValue", searchText);
                await setDataStorage("taskfilter", "Y");

                // บันทึกสถานะที่เลือก
                const taskStatusArr = [];
                if (inprogress) taskStatusArr.push("inprogress");
                if (complete) taskStatusArr.push("complete");
                if (notstart) taskStatusArr.push("notstart");
                if (overdue) taskStatusArr.push("overdue");
                if (delay) taskStatusArr.push("delay");

                await setDataStorage('taskstatusValue', taskStatusArr.join(","));

                // บันทึกวันที่ที่เลือก (ถ้ามี)
                if (!isFirstTimeStart && !isFirstTimeEnd) {
                    const timeObj = {
                        time_start: dateStart.toISOString(),
                        time_end: dateEnd.toISOString()
                    };
                    await setDataStorage('TasksearchTime', JSON.stringify(timeObj));
                } else {
                    await setDataStorage('TasksearchTime', "");
                }

                // บันทึกประวัติ
                if (searchText.trim()) {
                    const taskHistory = await getDataStorage('Tasks_history') || '[]';
                    const searchHistory = JSON.parse(taskHistory);
                    const newHistory = [searchText, ...searchHistory.filter(h => h !== searchText)];
                    await setDataStorage('Tasks_history', JSON.stringify(newHistory));
                }

                // ส่งค่ากลับไปหน้า Tasks
                navigation.navigate('Tasks', {
                    dataTaskSearch: searchDataTask,
                    dataAgeSearch: searchDataAge,
                    pre_event: searchPreEvent,
                    pre_event2: searchPreEvent2,
                    plan_code: searchPlanCode,
                    managerplan: searchManager,
                    taskid_h: route.params.taskid_h,
                    point: "search"
                });


                break;

            default:
                break;
        }


    };

    // ฟังก์ชันจัดการกับ DatePicker
    const handleStartDate = (date) => {
        try {
            if (!isFirstTimeEnd && moment(date).isAfter(moment(dateEnd))) {
                throw new Error();
            }
            setDateStart(date);
            setFirstTimeStart(false);
        } catch {
            Alert.alert("แจ้งเตือน", "ช่วงเวลาที่คุณเลือกไม่ถูกต้อง");
        } finally {
            setTimeStartShow(false);
        }
    };

    const handleEndDate = (date) => {
        try {
            if (!isFirstTimeStart && moment(dateStart).isAfter(moment(date))) {
                throw new Error();
            }
            setDateEnd(date);
            setFirstTimeEnd(false);
        } catch {
            Alert.alert("แจ้งเตือน", "ช่วงเวลาที่คุณเลือกไม่ถูกต้อง");
        } finally {
            setTimeEndShow(false);
        }
    };

    const toggleStatus = (status) => {
        switch (status) {
            case 'inprogress': setInprogress(!inprogress); break;
            case 'complete': setComplete(!complete); break;
            case 'notstart': setNotstart(!notstart); break;
            case 'overdue': setOverdue(!overdue); break;
            case 'delay': setDelay(!delay); break;

        }
    };

    const selectSearchType = (type) => {
        setIsSearch(type === 'status');
        setIsDate(type === 'date');
        setModalVisible(false);
    };

    const clearHistory = async () => {
        Alert.alert(
            'ยืนยันการลบ',
            'คุณต้องการลบประวัติการค้นหาทั้งหมดหรือไม่?',
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ยืนยัน',
                    onPress: async () => {
                        setSearchHistory([]);
                        switch (routeName) {
                            case 'Plans':
                                await setDataStorage('Plan_history', JSON.stringify([]));
                                break;
                            case 'Tasks':
                                await setDataStorage('Tasks_history', JSON.stringify([]));
                                break;
                            default:
                                break;
                        }

                    }
                }
            ]
        );
    };

    const goBack = async () => {
        switch (routeName) {
            case 'Plans':
                await setDataStorage("planfilter", "N");
                navigation.goBack();
                break;
            case 'Tasks':
                setDataStorage('taskfilter', "N");
                navigation.navigate('Tasks', {
                    dataTaskSearch: searchDataTask,
                    dataAgeSearch: searchDataAge,
                    pre_event: searchPreEvent,
                    pre_event2: searchPreEvent2,
                    plan_code: searchPlanCode,
                    managerplan: searchManager,
                    taskid_h: route.params.taskid_h,
                    point: "search"
                });
                break;
            default:
                break;
        }

    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        getLangDF();
        loadTheme();
        getSearchHistory();
    }, [navigation]);

    useEffect(() => {
        if (routeName === "Tasks") {
            const {
                dataTask,
                dataAge,
                pre_event,
                pre_event2,
                plan_code,
                manager
            } = route.params;

            setSearchDataTask(dataTask);
            setSearchDataAge(dataAge);
            setSearchPreEvent(pre_event);
            setSearchPreEvent2(pre_event2);
            setSearchPlanCode(plan_code);
            setSearchManager(manager);
        }
    }, [route.params]);


    return (
        <View style={[styles.container, {
            backgroundColor: themes === 'light' ? color.white : color.back_bg
        }]}>
            <View style={styles.boxsort}>
                <TouchableOpacity
                    style={{ height: 50, width: 50, justifyContent: 'center' }}
                    onPress={goBack}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={themes === 'light' ? color.black : color.white}
                    />
                </TouchableOpacity>

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
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => handleSearch()}
                >
                    <Text style={{ color: color.white }}>{lang.searchtext}</Text>
                </TouchableOpacity>
            </View>



            {/* วันที่ - สถานะ */}
            <View style={styles.searchTypeContainer}>
                <TouchableOpacity
                    style={styles.searchTypeButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Foundation name="page-search" size={24} color={color.black} />
                </TouchableOpacity>

                {isSearch ? (
                    <View style={styles.statusButtons}>
                        <TouchableOpacity
                            style={[styles.statusButton, {
                                backgroundColor: inprogress ? color.green : color.white
                            }]}
                            onPress={() => toggleStatus('inprogress')}
                        >
                            <Text style={{
                                color: inprogress ? color.white : color.black
                            }}>{lang.inprogress}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusButton, {
                                backgroundColor: complete ? color.green : color.white
                            }]}
                            onPress={() => toggleStatus('complete')}
                        >
                            <Text style={{
                                color: complete ? color.white : color.black
                            }}>{lang.complete}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusButton, {
                                backgroundColor: notstart ? color.green : color.white
                            }]}
                            onPress={() => toggleStatus('notstart')}
                        >
                            <Text style={{
                                color: notstart ? color.white : color.black
                            }}>{lang.notstart}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusButton, {
                                backgroundColor: overdue ? color.green : color.white
                            }]}
                            onPress={() => toggleStatus('overdue')}
                        >
                            <Text style={{
                                color: overdue ? color.white : color.black
                            }}>{lang.overdue}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.statusButton, {
                                backgroundColor: delay ? color.green : color.white
                            }]}
                            onPress={() => toggleStatus('delay')}
                        >
                            <Text style={{
                                color: delay ? color.white : color.black
                            }}>{lang.delay}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.datePickerContainer}>
                        {/* ส่วนเลือกวันที่ */}
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setTimeStartShow(true)}
                        >
                            <Text>{isFirstTimeStart ?
                                "DD/MM/YYYY" :
                                moment(dateStart).format("DD/MM/YYYY")}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.dateSeperator}>{lang.todate}</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setTimeEndShow(true)}
                        >
                            <Text>{isFirstTimeEnd ?
                                "DD/MM/YYYY" :
                                moment(dateEnd).format("DD/MM/YYYY")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>



            {/* DateTimePicker */}
            <DateTimePickerModal
                isVisible={modalTimeStartShow}
                mode="date"
                onConfirm={handleStartDate}
                onCancel={() => setTimeStartShow(false)}
                date={dateStart}
            />
            <DateTimePickerModal
                isVisible={modalTimeEndShow}
                mode="date"
                onConfirm={handleEndDate}
                onCancel={() => setTimeEndShow(false)}
                date={dateEnd}
            />

            {/* ประวัติการค้นหา */}
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
                            onPress={clearHistory}
                        >
                            <Ionicons name="trash" size={20} color={color.grey_pr} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={[styles.modalButton,
                            isSearch && styles.modalButtonSelected
                            ]}
                            onPress={() => selectSearchType('status')}
                        >
                            <Text style={styles.modalButtonText}>Status</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton,
                            isDate && styles.modalButtonSelected
                            ]}
                            onPress={() => selectSearchType('date')}
                        >
                            <Text style={styles.modalButtonText}>Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        marginTop: 35,
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
    searchTypeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 15,
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
    },
    searchTypeButton: {
        padding: 5,
        marginRight: 15,
        backgroundColor: color.white,
        borderRadius: 5,

    },

    // ส่วนของ Status Buttons
    statusButtons: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    statusButton: {
        margin: 2,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: color.border2,
    },

    // ส่วนของ Date Picker
    datePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10,
    },
    dateButton: {
        flex: 4,
        height: 35,
        backgroundColor: color.white,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateSeperator: {
        flex: 2,
        textAlign: 'center',
    },

    // ส่วนของ Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: color.white,
        borderRadius: 10,
        overflow: 'hidden',
    },
    modalButton: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: color.border2,
    },
    modalButtonSelected: {
        backgroundColor: '#d6d6d6',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#6488c9',
    },
});