import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import { styles, colors, smallTextStyle } from "../stylesheet/styles";
export default function HeaderCenter({ navigation, title, badge }) {
   // console.log("props", props);
   return (
      <View style={styles.rows}>
         <Text style={[styles.text_white, styles.h4, { paddingRight: 5 }]}>{title}</Text>
         {badge && <View style={styles.badge}>
            <Text style={styles.text_white}>{badge}</Text>
         </View>}
      </View>
   )
}