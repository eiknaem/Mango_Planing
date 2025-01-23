import React, { useLayoutEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { colors, styles } from "../stylesheet/styles";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import Moment from "moment-timezone";
export default function Alert2({ onConfirm, onClose, visible, docno, type, message }) {
  const [isTheme, setTheme] = useState({});
  useLayoutEffect(() => {
    async function fetchData() {
      let theme = JSON.parse(
        await AsyncStorage.getItem("theme")
      );
      setTheme(theme)
    }
    fetchData()
  }, []);
  const renderItem = () => {
    if (type == 'submit') {
      return (
        <View style={styles.alert}>
          <AntDesign name="checkcircle" size={40} color="#2DA722" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>{message || "ส่งอนุมัติเรียบร้อยกลับสู่เมนูหลัก" }</Text>
          </View>
          <View style={[styles.rows, { paddingTop: 20, width: '100%' }]}>
            <Ripple
              rippleColor={colors.white}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: isTheme.head || colors.red, borderColor: colors.bluesea, width: '100%', marginHorizontal: 0 }]}
              onPress={() => onConfirm()}
            >
              <Text style={[styles.h5_bold, styles.text]}>ตกลง</Text>
            </Ripple>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.alert}>
          <AntDesign name="checkcircle" size={40} color="#2DA722" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>บันทึกเอกสารเรียบร้อยแล้ว</Text>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>เอกสารเลขที่ : {docno}</Text>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>วันที่/เวลา : {Moment(new Date()).format("DD-MM-YYYY HH:mm")}</Text>
          </View>
          <View style={[styles.rows, { paddingTop: 20, width: '100%' }]}>
            <Ripple
              rippleColor={colors.white}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: isTheme.head || colors.bluesea, borderColor: isTheme.head || colors.bluesea, width: '100%', marginHorizontal: 0 }]}
              onPress={() => onConfirm()}
            >
              <Text style={[styles.h5_bold, styles.text]}>ตกลง</Text>
            </Ripple>
          </View>
        </View>
      )
    }
  }
  return (
    <Modal isVisible={visible} style={styles.alertContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => type != 'submit' ?onClose() : null}
        style={{
          flex: 1,
          width: '100%',
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderItem()}
      </TouchableOpacity>

      <View></View>
    </Modal>
  );
}
