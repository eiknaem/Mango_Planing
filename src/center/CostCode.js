﻿import React, { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { createFilter } from "react-native-search-filter";
import linq from "js-linq";
//custom link
import FooterLayout from "../../../layouts/footer_layout";
import { styles } from "../style";
import MessageBox from "../../../api/msg";
import { getCostcode_Type } from "../../../api/bind_api";
import LoaddingLayout from "../../../layouts/loadding_layout";
export default function CostCode({ route, navigation }) {
  const $linq = (arr) => new linq(arr);

  const [isFilterList, setFilterList] = useState([]);
  const [isDataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPage = route.params.page;
  const docList = route.params.docList;
  const isIndex = route.params.isIndex;
  console.log("isPage", isPage);
  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        let rsp = await url;
        if (rsp.error) {
          throw rsp.error;
        } else {
          console.log("rsp.data", rsp.data_rows);
          setFilterList(rsp.data_rows);
          setDataList(rsp.data_rows);
        }
      } catch (ex) {
        MessageBox.Alert(`Error`, ex.toString(), "OK", navigation);
      } finally {
        setLoading(false);
      }
    };
    fetchData(getCostcode_Type());
  }, []);
  const __beforeNext = async (item) => {
    let data = $linq(docList.detail)
      .where((w) => w.itemno == isIndex)
      .firstOrDefault();
    data.cc_code = item.cc_code;
    data.cc_des = item.cc_des;

    // console.log("docList", docList);
    navigation.navigate("CostCode_group", { docList, isIndex, page: isPage });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.blockcard}>
        <TouchableOpacity onPress={() => __beforeNext(item)}>
          <View style={styles.ROW}>
            <Text style={styles.label}>Code :</Text>
            <Text>{item.cc_code}</Text>
          </View>
          <View style={styles.ROW_TOP}>
            <Text style={styles.label}>Cost Code Name :</Text>
            <Text style={styles.description}>{item.cc_des}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
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
            placeholder="Select Cost Code"
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
    const filter = isDataList.filter(createFilter(text, ["cc_code", "cc_des"]));
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
