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
import linq from "js-linq";
//custom link
import FooterLayout from "../../../layouts/footer_layout";
import { styles } from "../style";
import MessageBox from "../../../api/msg";
import { getProject, getProjectToJob } from "../../../api/bind_api";
import LoaddingLayout from "../../../layouts/loadding_layout";
export default function Project({ route, navigation }) {
  const $linq = (arr) => new linq(arr);

  const [isFilterList, setFilterList] = useState([]);
  const [isDataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPage = route.params.page;
  const docList = route.params.docList;
  const setDisable = route.params.setDisable;
  // console.log("PettyCash", isPage);
  console.log("PettyCash", setDisable);

  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        let rsp = await url;
        console.log("rsp", rsp);
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
    fetchData(getProject());
  }, []);
  const __beforeNext = async (item) => {
    // console.log("item", item);
    await AsyncStorage.setItem("pre_event", item.pre_event);
    let rsp = await getProjectToJob(item.pre_event);

    const jobList = rsp.data.map((item, index) => ({
      label: item.jobname || null,
      value: item.jobcode || null,
    }));
    let defaultJob = await $linq(jobList)
      .select((x) => x)
      .firstOrDefault();
    console.log("defaultJob", defaultJob);

    // const jobList = [
    //   { label: "test 1", value: "1" },
    //   { label: "test 2", value: "2" },
    //   { label: "test 3", value: "3" },
    // ];
    // const defaultJob = jobList[2];

    docList.header.pre_des = `${item.pre_des} (${item.refcode})`;
    docList.header.pre_event = item.pre_event;
    docList.header.budgetflag = item.budgetflag;
    docList.header.projno = item.projno;
    docList.header.jobcode = jobList[0].value;
    docList.header.jobname = jobList[0].label;
    docList.header.dpt_code = null;
    docList.header.dpt_name = null;
    docList.detail.pre_event_vo = item.pre_event;
    console.log("docList", docList);
    setDisable.isDisableJob = "N";
    setDisable.isDisableDep = true;
    navigation.navigate(isPage, { docList, setDisable, jobList, defaultJob });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.blockcard}>
        <TouchableOpacity onPress={() => __beforeNext(item)}>
          <View style={styles.ROW}>
            <Text style={styles.label}>Code :</Text>
            <Text>{item.pre_event}</Text>
          </View>
          <View style={styles.ROW_TOP}>
            <Text style={styles.label}>Project Name :</Text>
            <Text style={styles.description}>
              {item.pre_des} ({item.refcode})
            </Text>
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
            placeholder="Select Project"
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
      createFilter(text, ["pre_event", "pre_des", "refcode"])
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
