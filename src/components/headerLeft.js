import React, { useState } from "react";
import { TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import { Feather,FontAwesome } from '@expo/vector-icons';
import { colors, styles } from "../stylesheet/styles";
import Alert from "../components/Alert"
import $xt from "../api/xtools";
import { xt,getDataStorage } from "../api/service";

export default function HeaderLeft({ navigation, checkBack, docList,themes }) {
   const [alertShow, setAlertShow] = useState(false);
   const checkMat = docList?.detail[0]?.itemcode || null;
  
   useFocusEffect(
      React.useCallback(() => {
        console.log("Current theme in HeaderLeft:", themes); // แสดงค่า themes ทุกครั้งที่หน้าจออยู่ในโฟกัส
      }, [themes])
    );
   const _beforeNext = () => {
      console.log("checkBack && checkMat", checkBack, checkMat);
      if (checkBack && !$xt.isEmpty(checkMat)) {
         setAlertShow(true)
      } else {
         navigation.goBack()
      }
   }
   const _beforeSave = () => {
      setAlertShow(!alertShow)
      $xt.sleep(500)
      navigation.navigate("Home")
   }
   return (
      <>
         <Alert
            visible={alertShow}
            onConfirm={() => { _beforeSave() }}
            onClose={() => { setAlertShow(!alertShow) }}
            type={"back"}
         />
         <TouchableOpacity style={{ paddingHorizontal: 7.5, marginLeft: 7.5,zIndex:2 }} onPress={() => _beforeNext()}>
            <Feather name="chevron-left" size={30} color={themes == 'light' ? colors.black : colors.white} />
            {/* <Feather name="command" size={30} color="black" /> */}
         </TouchableOpacity>
      
      </>

   )
}