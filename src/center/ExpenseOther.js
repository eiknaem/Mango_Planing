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
import { Ionicons } from "@expo/vector-icons";
import { createFilter } from "react-native-search-filter";
import linq from "js-linq";
//custom link
import FooterLayout from "../../../layouts/footer_layout";
import { styles } from "../style";
import MessageBox from "../../../api/msg";
import { getExpenseList } from "../../../api/bind_api";
import LoaddingLayout from "../../../layouts/loadding_layout";
import $xt from "../../../api/xtools";
export default function ExpenseOther({ route, navigation }) {
  const $linq = (arr) => new linq(arr);

  const [isFilterList, setFilterList] = useState([]);
  const [isDataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPage = route.params.page;
  const docList = route.params.docList;
  const budgetflag = route.params.budgetflag;
  // const newDocList = route.params.newDocList;
  const isIndex = route.params.isIndex;
  // console.log("form page", isPage);
  // console.log("docList", docList, isIndex);
  console.log("isIndex", isIndex);
  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        let rsp = await url;
        console.log("data", rsp.data);
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
    fetchData(getExpenseList());
  }, []);

  const __beforeNext = async (item) => {
    let data = $linq(docList.detail)
      .where((w) => w.itemno == isIndex)
      .firstOrDefault();
    let budgetflag = docList.header.budgetflag || "";
    console.log("data", data);
    data.expens_code = item.expens_code;
    data.expens_name = item.expens_name;
    data.costcode = item.costcode;
    data.costname = item.costname;
    console.log("docList", docList);
    navigation.navigate(isPage, { docList });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.blockcard}>
        <TouchableOpacity onPress={() => __beforeNext(item)}>
          <View style={styles.ROW}>
            <Text style={styles.label}>Code :</Text>
            <Text>{item.expens_code}</Text>
          </View>
          <View style={styles.ROW_TOP}>
            <Text style={styles.label}>Expense Other Name :</Text>
            <Text style={styles.description}>{item.expens_name}</Text>
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
            placeholder="Select Expense Other"
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
      createFilter(text, ["expens_code", "expens_name"])
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
