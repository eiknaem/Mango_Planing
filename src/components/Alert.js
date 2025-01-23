import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { colors, styles } from "../../src/stylesheet/styles";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
export default function Alert({ onConfirm, onClose, visible, itemcode, facode, type, header, message, message2  }) {
  const renderItem = () => {
    if (type == 'warning') {
      return (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={40} color="#C8233F" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>{message || "กรอกรายการให้ครบถ้วน" }</Text>
          </View>
        </View>
      )
    } else if (type == 'selectOrder') {
      return (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={40} color="#C8233F" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>เลือกอย่างน้อย 1 รายการ</Text>
          </View>
        </View>
      )
    } else if (type == 'confirm') {
      return (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={40} color="#C8233F" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>{message2 || "ยืนยันการส่งข้อมูล"}</Text>
          </View>
          <View style={[styles.rows, { paddingTop: 20 }]}>
            <Ripple
              rippleColor={colors.bluesea}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.white, borderColor: colors.border, }]}
              onPress={() => onClose()}
            >
              <Text style={[styles.h5_bold, { color: colors.bluesea }]}>ยกเลิก</Text>
            </Ripple>
            <Ripple
              rippleColor={colors.white}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.bluesea, borderColor: colors.bluesea, }]}
              onPress={() => onConfirm()}
            >
              <Text style={[styles.h5_bold, styles.text]}>ตกลง</Text>
            </Ripple>
          </View>
        </View>
      )
    } else if (type == 'back') {
      return (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={40} color="#C8233F" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>กลับสู่หน้าเมนูรายการจะไม่ถูกบันทึก</Text>
          </View>
          <View style={[styles.rows, { paddingTop: 20 }]}>
            <Ripple
              rippleColor={colors.bluesea}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.white, borderColor: colors.border, }]}
              onPress={() => onClose()}
            >
              <Text style={[styles.h5_bold, { color: colors.bluesea }]}>ยกเลิก</Text>
            </Ripple>
            <Ripple
              rippleColor={colors.white}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.bluesea, borderColor: colors.bluesea, }]}
              onPress={() => onConfirm()}
            >
              <Text style={[styles.h5_bold, styles.text]}>ตกลง</Text>
            </Ripple>
          </View>
        </View>
      )
    } else if (type == 'submit') {
      return (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={40} color="#C8233F" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>ยืนยันการส่งอนุมัติ</Text>
          </View>
          <View style={[styles.rows, { paddingTop: 20 }]}>
            <Ripple
              rippleColor={colors.bluesea}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.white, borderColor: colors.border, }]}
              onPress={() => onClose()}
            >
              <Text style={[styles.h5_bold, { color: colors.bluesea }]}>ยกเลิก</Text>
            </Ripple>
            <Ripple
              rippleColor={colors.white}
              rippleOpacity={0.87}
              rippleDuration={1000}
              style={[styles.button2, { backgroundColor: colors.bluesea, borderColor: colors.bluesea, }]}
              onPress={() => onConfirm()}
            >
              <Text style={[styles.h5_bold, styles.text]}>ตกลง</Text>
            </Ripple>
          </View>
        </View>
      )
    } else if (type == 'detail') {
      return (
        <View style={styles.alert2}>
          <View style={{ width: '100%' }}>
            <Text style={[styles.h5, { color: colors.black_t }]}>งานปัจจุบัน</Text>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.bluesea }]}>Job  </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.jobname}</Text>
            </View>
            <View style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.border2,
              marginVertical: 5
            }}></View>
            <Text style={[styles.h5, { color: colors.black_t }]}>โครงการและงานที่จะโอน</Text>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.blue_t }]}>To project : </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.pre_des_to}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.blue_t }]}>Job : </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.jobname_to}</Text>
            </View>
          </View>

        </View>
      )
    } else if (type == 'detail_sale') {
      return (
        <View style={styles.alert2}>
          <View style={{ width: '100%' }}>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.bluesea }]}>Sale Order No. :</Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>{header.to_pre_des}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.black_t }]}>Project No. :</Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>{header.jobname}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.black_t }]}>Customer Code :</Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>{header.jobname}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.black_t }]}>Customer Name :</Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>{header.jobname}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.black_t }]}>Amount :</Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>{header.jobname}</Text>
            </View>
          </View>

        </View>
      )
    } else if (type == 'detail_doc') {
      return (
        <View style={styles.alert2}>
          <View style={{ width: '100%' }}>
            <Text style={[styles.h5, { color: colors.black_t }]}>งานปัจจุบัน</Text>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.bluesea }]}>Job  </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.jobname}</Text>
            </View>
            <View style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.border2,
              marginVertical: 5
            }}></View>
            <Text style={[styles.h5, { color: colors.black_t }]}>รายการเบิกตามพื้นที่</Text>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.bluesea }]}>Area Code: </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.loccode}</Text>
            </View>
            <View style={styles.rows_start}>
              <Text style={[styles.h5, { color: colors.bluesea }]}>Area Name : </Text>
              <Text style={[styles.h5, { color: colors.black_t }]}>: {header.locname}</Text>
            </View>
          </View>

        </View>
      )
    } else if (type == 'save') {
      return (
        <View style={styles.alert}>
          <AntDesign name="checkcircle" size={40} color="#2DA722" />
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>บันทึกรายการวัสดุ</Text>
            <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>Mat.Code : {itemcode}</Text>
            {facode && <Text style={[styles.alertText, styles.h5_bold, { color: colors.black_t }]}>FA Code : {facode}</Text>}
          </View>
        </View>
      )
    }

  }
  return (
    <Modal isVisible={visible} style={styles.alertContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onClose()}
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
