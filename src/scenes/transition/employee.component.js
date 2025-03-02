import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import linq from "js-linq";
import { styles, colors } from "../../stylesheet/styles";
import { xt, getDataStorage, setDataStorage } from "../../api/service";
import { useTheme } from "../../components/themeProvider";
import $xt from "../../api/xtools";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EmployeeListScreen({ route, navigation }) {
  const $linq = arr => new linq(arr);
  const [lang, setLang] = useState({});
  const [dataServer, setDataServer] = useState(route.params.site);
  const [themes, setThemes] = useState("light");
  
  const Params = route.params;
  const dataEMP = Params.dataEmp;
  const getNoti = Params?.noti;
  const isFrom = Params?.from;
  const getManager = Params?.manager;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: themes === 'light' ? colors.white : colors.back_bg,
        shadowColor: "transparent",
        elevation: 0,
      },
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: "bold",
        color: themes === 'light' ? colors.black : colors.white,
      },
      headerTintColor: themes === 'light' ? colors.black : colors.white,
      headerLeft: () => headerLeft(),
      title: lang.employee_list || "Employee List",
    });
  }, [navigation, themes, lang]);

  const headerLeft = () => {
    return (
      <View style={{ flexDirection: 'row', width: windowWidth * 0.2, height: windowHeight * 0.04, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity 
          style={{ marginRight: '20%', justifyContent: "center", alignItems: "center" }}
          onPress={goBack}
        >
          <Ionicons name="chevron-back" size={24} color={themes === 'light' ? colors.black : colors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const goBack = () => {
    if ($xt.isEmpty(getNoti)) {
      if (isFrom === "task") {
        navigation.navigate('Tasks', {
          dataTaskSearch: route.params.dataTask,
          dataAgeSearch: route.params.dataAge,
          point: "search",
          pre_event: route.params.pre_event,
          pre_event2: route.params.pre_event2,
          taskid: route.params.taskid,
          taskid_h: route.params.taskid_h,
          plan_code: route.params.plan_code,
          managerplan: getManager,
          viewppn: route.params.viewppn,
          dataAge: route.params.dataAge,
        });
      } else {
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  };

  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);

    let themes_key = await getDataStorage("themes_ppn") || "light";
    setThemes(themes_key);
  };

  useFocusEffect(
    React.useCallback(() => {
      getLangDF();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: (themes === 'light') ? "#e8e8e8" : "#2c3a4d",
          borderWidth: 1,
          borderColor: (themes === 'light') ? "#ffffff" : "#000000",
          borderRadius: 6,
          marginBottom: 5
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 20 }}>
            <View>
              <Image 
                style={{ 
                  borderColor: '#2fb344', 
                  borderWidth: 1, 
                  width: 90, 
                  height: 90, 
                  borderRadius: 45 // Make image round
                }} 
                source={
                  !$xt.isEmpty(item.img)
                    ? { uri: dataServer + "api/file/download/?download=false&id=" + item.img }
                    : require("../../../assets/images/user.png")
                }
              />
            </View> 
          </View>
          
          <View>
            <Text style={{ 
              fontSize: 16, 
              paddingBottom: 5, 
              color: (themes === 'light') ? '#000000' : '#ffffff',
              fontWeight: 'bold'
            }}>
              {item.name}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              paddingBottom: 5, 
              color: (themes === 'light') ? '#000000' : '#ffffff' 
            }}>
              ตำแหน่ง : {item.position || "-"}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              paddingBottom: 5, 
              color: (themes === 'light') ? '#000000' : '#ffffff' 
            }}>
              เบอร์โทร : {item.empmob || "-"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: themes === 'light' ? colors.white : colors.back_bg 
    }}>
      <View style={{ 
        flexDirection: 'row', 
        padding: 15, 
        justifyContent: 'space-between',
        backgroundColor: themes === 'light' ? "#f5f5f5" : "#1f2937"
      }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontSize: 13,
            color: themes === 'light' ? colors.black : colors.white 
          }}> 
            งาน : {dataEMP.planname}
          </Text>
        </View>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Text style={{ 
            fontSize: 13,
            color: themes === 'light' ? colors.black : colors.white
          }}> 
            {moment(dataEMP.start_date).format("DD/MM/YYYY")} - {moment(dataEMP.end_date).format("DD/MM/YYYY")} 
          </Text>
        </View>
      </View>
      
      <View style={{ padding: 10, paddingBottom: 110 }}>
        <FlatList
          data={dataEMP.ow_list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginTop: 50 
            }}>
              <Text style={{ 
                color: themes === 'light' ? colors.black : colors.white,
                fontSize: 16
              }}>
                ไม่พบข้อมูลพนักงาน
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}