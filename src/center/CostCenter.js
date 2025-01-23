import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { Table, Row, Rows } from "react-native-table-component";
//custom link
import FooterLayout from "../../../layouts/footer_layout";
import { styles } from "../style";
import $xt from "../../../api/xtools";
import linq from "js-linq";
import LoaddingLayout from "../../../layouts/loadding_layout";
export default function CostCenter({ route, navigation }) {
  const animatedValue = new Animated.Value(0)
  const $linq = (arr) => new linq(arr);
  const [loading, setLoading] = useState(false);
  const [isReady, setReady] = useState(false);
  const [isTableHead, SetTableHead] = useState([]);
  const [isTableFoot, SetTableFoot] = useState([]);
  const [isTableData, SetTableData] = useState([]);
  const [isWidthArr, setWidthArr] = useState([]);

  // const isPage = route.params.page;
  const docList = route?.params?.docList;
  // const setDisable = route.params.setDisable;
  console.log("docList", docList); 
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      let rsp = docList;

      console.log("data", rsp);
      let tableHead = [
        "No.",
        "Project No.",
        "Cost Code",
        "Cost Name",
        "Control",
        "This Material",
        "This Labour",
        "This Subc.",
        "This Other",
        "Total this Amt.",
        "Prev. PU Cost",
        "Total PU Cost",
        "PR Pending",
        "Full Budget",
        "% Control",
        "This Budget Control",
        "Budget Bal.",
        "Forecast",
      ];
      let widthArr = [
        100, 160, 160, 300, 100,
         160, 160, 160, 160, 160, 160, 160, 160, 160,
        160, 160, 160, 160,
      ];
      setWidthArr(widthArr);
      var tableData = [];
      // rsp.forEach((data) => {
      //   const tableX = [];
      //   let index = 1;
      //   for (const [key, value] of Object.entries(data)) {
      //     tableX.push(value);
      //     index++;
      //   }
      //   tableData.push(tableX);
      // });
      // rsp.forEach((x, idx) => {
      //   tableData.push(x);
      // });
      // console.log("tableDataxx", tableData);
      // for (let x,i of tableData) {
      //   x.index = i;
      // }
      // for (let [i, g] of tableData.entries()) {
      //   i.index = g;
      // }
      // rsp.forEach((x) => {
        var amt1 = $linq(rsp).sum(x => x.amt1);
        var amt2 = $linq(rsp).sum(x => x.amt2);
        var amt3 = $linq(rsp).sum(x => x.amt3);
        var amt4 = $linq(rsp).sum(x => x.amt4);
        var totamt = $linq(rsp).sum(x => x.totamt);
        // console.log("amt4",amt4);
        tableData ={
          amt1: $linq(rsp).sum(x => x.amt1),
          amt2: $linq(rsp).sum(x => x.amt2),
          amt3: $linq(rsp).sum(x => x.amt3),
          amt4: $linq(rsp).sum(x => x.amt4),
          totamt: $linq(rsp).sum(x => x.totamt), 
          puamt: $linq(rsp).sum(x => x.puamt),
          cf_acc: $linq(rsp).sum(x => x.cf_acc),
          cc_pr: $linq(rsp).sum(x => x.cc_pr),
          cc_budgetamt_full: $linq(rsp).sum(x => x.cc_budgetamt_full),
          controlper: $linq(rsp).sum(x => x.controlper),
          budgetamt: $linq(rsp).sum(x => x.budgetamt),
          budget_bal: $linq(rsp).sum(x => x.budget_bal),
          expectcost: $linq(rsp).sum(x => x.expectcost),
        }
      // })
    
      console.log("tableDataxx", tableData);
      SetTableHead(tableHead);
      SetTableData(rsp);
      SetTableFoot(tableData);
      // setFilterList(rsp.data);
      // setDataList(rsp.data);
      setReady(true);
    };
    fetchData();
  }, []);

  const renderItem = () => {
    return isTableData.map((item , index) => {
    return (
      <View key={index} style={{}}>
          <View style={[styles.ROW,{marginTop: -2}]}>
            <Text style={[styles.col_list, {width: 100,}]}>{index +1}</Text> 
            <Text style={[styles.col_list, { width: 160,}]}>{item.pre_event}</Text>
            <Text style={[styles.col_list, { width: 160,}]}>{item.costcode2}</Text>
            <Text style={[styles.col_list, { width: 300,}]}>{item.cc_costname}</Text>
            <Text style={[styles.col_list, { width: 100,}]}>{item.budgetflag == 'Y' ? <Feather name="check" size={16} color="black" /> : null}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.amt1, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.amt2, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.amt3, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.amt4, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.totamt, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.puamt, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.cf_acc, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.cc_pr, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.cc_budgetamt_full, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.controlper, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.budgetamt, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.budget_bal, 2) || "0.00"}</Text>
            <Text style={[styles.col_list, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(item.expectcost, 2) || "0.00"}</Text>
          </View>
      </View>
    );
  });
  };
  const handleAnimation = () => {
    console.log("handleAnimation");
    Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
    }).start()
}

  // const keyExtractor = (item) => item.id.toString();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}></View>
      {loading ? <LoaddingLayout /> : null}
      {isReady ? (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={true} >
          {/* <TouchableOpacity onPress={handleAnimation}>
                    <Text>
                       Transform Image
                    </Text>
                </TouchableOpacity> */}
            <Animated.View
              style={{
                flex: 1,
                padding: 16,
                paddingTop: 30,
                backgroundColor: "#fff",
              //   transform: [
              //     {
              //         translateX: animatedValue.interpolate({
              //             inputRange: [0, 1],
              //             outputRange: [0, 120]
              //         })
              //     },
              //     {
              //         translateY: animatedValue.interpolate({
              //             inputRange: [0, 1],
              //             outputRange: [0, 25]
              //         })
              //     },
              //     {
              //         scaleX: animatedValue.interpolate({
              //             inputRange: [0, 1],
              //             outputRange: [1, 15]
              //         })
              //     },
              //     {
              //         scaleY: animatedValue.interpolate({
              //             inputRange: [0, 1],
              //             outputRange: [1, 12.5]
              //         })
              //     }
              // ]
              }}
            >
              <Table borderStyle={{ borderWidth: 1, borderColor: "#fff" }}>
                <Row
                  data={isTableHead}
                  widthArr={isWidthArr}
                  style={{ height: 30, backgroundColor: "#5C6483" }}
                  textStyle={{ textAlign: "center", fontWeight: "100", color:'#fff' }}
                />
              </Table>
              {renderItem()}
                {/* ///// footer */}
              <View style={[styles.ROW,{marginTop: -2}]}>
                <Text style={[styles.col_list_foot2, {width: 100, backgroundColor:'#5C6483', paddingVertical: 9}]}></Text> 
                <Text style={[styles.col_list_foot2, { width: 160, backgroundColor:'#5C6483', paddingVertical: 9}]}></Text>
                <Text style={[styles.col_list_foot2, { width: 160, backgroundColor:'#5C6483', paddingVertical: 9}]}></Text>
                <Text style={[styles.col_list_foot2, { width: 250, backgroundColor:'#5C6483', paddingVertical: 9}]}></Text>
                <Text style={[styles.col_list_foot2, { width: 150, backgroundColor:'#5C6483', paddingVertical: 6.666, color: '#fff', textAlign: 'center' }]}>ยอดรวมทั้งหมด</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.amt1, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.amt2, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.amt3, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.amt4, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.totamt, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.puamt, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.cf_acc, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.cc_pr, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.cc_budgetamt_full, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}></Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.budgetamt, 2) || "0.00"}</Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}></Text>
                <Text style={[styles.col_list_foot, { width: 160, textAlign: 'right',paddingRight: 5}]}>{$xt.reformatNumber(isTableFoot.expectcost, 2) || "0.00"}</Text>      
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      ) : null}
      {<FooterLayout />}
    </SafeAreaView>
  );
}
