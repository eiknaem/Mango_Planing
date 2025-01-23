import React, { useEffect, useState } from "react";
import {
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
import $xt from "../../../api/xtools";
import { getVendor } from "../../../api/bind_api";
import LoaddingLayout from "../../../layouts/loadding_layout";
export default function Vendor({ route, navigation }) {
  const $linq = (arr) => new linq(arr);

  const [isFilterList, setFilterList] = useState([]);
  const [isDataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectPage = route.name;
  const isPage = route.params.page;
  const docList = route.params.docList;
  const isIndex = route.params.isIndex;
  // console.log("docList.detail", docList.detail);
  const checkCust = route.params.check_cust;
  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        let rsp = await url;
        // console.log("data", rsp.data);
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
    fetchData(getVendor(checkCust));
  }, []);
  const __beforeNext = async (item) => {
    console.log("Vendor", item);

    if (isPage == "PettyCash" || isPage == "Advance") {
      docList.header.acct_no = item.acct_no || "";
      docList.header.cust_name = item.cust_name;
    } else if (isPage == "PettyCashList") {
      let data = $linq(docList.detail)
        .where((w) => w.itemno == isIndex)
        .firstOrDefault();
      data.vendor_wh = item.cust_name || "";
      data.v_branch_wh = item.v_branch || "";
      data.addr1_wh = item.cust_addr1;
      data.addr2_wh = item.cust_addr2;
      data.taxid = item.taxcode;
      // data.cc_taxid = item.taxid_vat;
      data.idcode = item.idcode;
      data.taxtype = item.prnform;
      data.prnform = item.prnform;
    } else {
      let address1 = !$xt.isEmpty(item.cust_addr1) ? item.cust_addr1 : "";
      let address2 = !$xt.isEmpty(item.cust_addr2) ? item.cust_addr2 : "";
      // console.log("data", data);
      let data = $linq(docList.detail)
        .where((w) => w.itemno == isIndex) 
        .firstOrDefault();
      data.acct_no = item.acct_no || null;
      data.cust_name = item.cust_name;
      data.v_branch = item.v_branch || "";
      data.branch_comp = item.v_branch || "";
      data.addr = `${address1} ${address2}` || "";
      data.addr1_comp = item.cust_addr1;
      data.addr2_comp = item.cust_addr2;
      data.idcode_comp = item.idcode;
      data.taxid_comp = item.taxcode;
      data.remark = item.cust_name || "";
      ////////////////////////////////
      // data.cc_idcode = item.idcode;
      // data.cc_idcode_vat = item.idcode;
      // data.cc_taxid = item.taxcode;
      // data.cc_taxid_vat = item.taxcode;
      // data.cc_prnform = item.prnform;
      data.taxtype_comp = item.prnform;
      // data.cc_addr1_wh = item.cust_addr1;
      // data.cc_addr2_wh = item.cust_addr2;
      // data.idcode = "";
      // data.idcode_vat = ""; 
      // data.taxid = "";
      // data.taxid_vat = "";
      ////////////////////////////////
    
    }

    console.log("selectPage", docList.detail);
    navigation.navigate(isPage, { docList, selectPage });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.blockcard}>
        <TouchableOpacity onPress={() => __beforeNext(item)}>
          <View style={styles.ROW}>
            <Text
              style={[
                styles.label,
                { color: item.backlist == "Y" ? "red" : "#000" },
              ]}
            >
              Code :
            </Text>
            <Text style={{ color: item.backlist == "Y" ? "red" : "#000" }}>
              {item.acct_no}
            </Text>
          </View>
          <View style={styles.ROW_TOP}>
            <Text
              style={[
                styles.label,
                { color: item.backlist == "Y" ? "red" : "#000" },
              ]}
            >
              Vendor Name :
            </Text>
            <Text
              style={[
                styles.description,
                { color: item.backlist == "Y" ? "red" : "#000" },
              ]}
            >
              {item.cust_name}
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
            style={{
              color: "#10321F",
              flex: 1,
              height: 40,
            }}
            onChangeText={(text) => searchUpdated(text)}
            // value={""}
            placeholder="Select Vendor"
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
      createFilter(text, ["acct_no", "cust_name"])
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
