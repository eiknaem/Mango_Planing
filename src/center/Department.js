import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createFilter } from "react-native-search-filter";
//custom link
import FooterLayout from "../../../layouts/footer_layout";
import { styles } from "../style";
import MessageBox from "../../../api/msg";
import { getDepartMent } from "../../../api/bind_api";
import LoaddingLayout from "../../../layouts/loadding_layout";
export default function Department({ route, navigation }) {
  // const filterList = [];
  const [isFilterList, setFilterList] = useState([]);
  const [isDataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const isPage = route.params.page;
  const docList = route.params.docList;
  const setDisable = route.params.setDisable;
  console.log("PettyCash", isPage);
  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        let rsp = await url;

        console.log("data", rsp);
        if (rsp.error) {
          throw rsp.error;
        } else {
          setFilterList(rsp.data);
          setDataList(rsp.data);
        }
      } catch (ex) {
        MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
      } finally {
        setLoading(false);
      }
    };
    fetchData(getDepartMent());
  }, []);

  const __beforeNext = async (item) => {
    // console.log("item", item);
    await AsyncStorage.setItem("dpt_code", item.dpt_code);
    await AsyncStorage.setItem("dpt_name", item.dpt_name);
    docList.header.dpt_code = item.dpt_code;
    docList.header.dpt_name = item.dpt_name;
    docList.header.budgetflag = null;
    docList.header.pre_des = null;
    docList.header.pre_event = null;
    docList.header.jobcode = null;
    docList.header.jobname = null;
    setDisable.isDisablePro = true;
    let defaultJob = {};
    navigation.navigate(isPage, { docList, setDisable, defaultJob });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.blockcard}>
        <TouchableOpacity onPress={() => __beforeNext(item)}>
          <View style={styles.ROW}>
            <Text style={styles.label}>Code :</Text>
            <Text>{item.dpt_code}</Text>
          </View>
          <View style={styles.ROW_TOP}>
            <Text style={styles.label}>Department Name :</Text>
            <Text style={styles.description}>{item.dpt_name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // const keyExtractor = (item) => item.id.toString();
  const searchBar = () => {
    return (
      <View
        style={{
          paddingHorizontal: 21,
          backgroundColor: "#E9E9E9",
          borderRadius: 30,
          zIndex: 10,
          borderWidth: 0,
          marginVertical: 25,
          marginHorizontal: 15,
        }}
      >
        <View
          style={{
            height: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Text style={{ color: "#10321F" }}>Select Vendor</Text> */}
          <TextInput
            style={{ color: "#10321F", flex: 1, height: 40 }}
            onChangeText={(text) => searchUpdated(text)}
            // value={""}
            placeholder="Select Department"
            placeholderTextColor="#10321F"
          />
          <View style={{ position: "absolute", right: 0, top: 7, bottom: 0 }}>
            <Ionicons name="search" size={24} color="black" />
          </View>
        </View>
      </View>
    );
  };
  const searchUpdated = (text) => {
    console.log(text);
    const filter = isDataList.filter(
      createFilter(text, ["dpt_code", "dpt_name"])
    );
    setFilterList(filter);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}></View>
      {loading ? <LoaddingLayout /> : null}
      {searchBar()}
      <View style={{ flex: 1 }}>
        <FlatList
          data={isFilterList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {<FooterLayout />}
    </SafeAreaView>
  );
}
