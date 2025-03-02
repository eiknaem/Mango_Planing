import React from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { xt, getDataStorage, setDataStorage } from '../../api/service';

import { colors } from '../../stylesheet/styles';

export default function KeyboardScreen({ route, navigation }) {
  const [lang, setLang] = React.useState({});
  const [pinArr, setPinArr] = React.useState([]);
  const [emty, setEmty] = React.useState(false);
  const [valuepg, setValuepg] = React.useState((route.params.key == "progress_per") ? route.params.progress_per : route.params.progress_qty);
  const [valueretrue, setValueretrue] = React.useState((route.params.key == "progress_per") ? route.params.progress_per : route.params.progress_qty);
  const [data, setData] = React.useState(route.params.data);
  const [progress_qty, setProgress_qty] = React.useState(route.params.progress_per);
  const [progress_per, setProgress_per] = React.useState(route.params.progress_qty);
  const [isLoading, setIsLoading] = React.useState(false);

  const onAddPin = async (number) => {
    console.log("number", pinArr);

    setEmty(false);
    let numberArr = number.split('|');
    var pin_ = [];
    const dot_ = pinArr.filter(e => e == '.').length;
    const minus_ = pinArr.filter(e => e == '-').length;
    
    if (number == ".") {
      if (dot_ == 0) {
        pin_ = pinArr.concat(numberArr);
      } else {
        pin_ = pinArr;
      }
    } else if (number == "-") {
      if (minus_ == 0) {
        if (pinArr[0] > 0) {
          pin_ = pinArr;
          console.log("1.1 pinArr");
        } else {
          pin_ = pinArr.concat(numberArr);
          console.log("1.2 pinArr");
        }
      } else {
        // pin_ = pinArr;
        console.log("2 pinArr");
      }
    } else {
      pin_ = pinArr.concat(numberArr);
    }

    let value_new = pin_.join('');
    console.log("final pinArr", value_new);

    setPinArr([...pin_]);
    setValueretrue(value_new);
    onChange(value_new);
  }

  const onDel = async () => {
    var pin_old = [...pinArr];
    var pin_ = pin_old.splice(0, (pinArr.length - 1));
    setPinArr(pin_);
    let value_new = pin_.join('');
    setValuepg(value_new);
    setValueretrue(value_new);
  }

  const onChange = (e) => {
    let val = parseFloat(e);
    const new_val = val;
    setValuepg(new_val);
  };

  const onRefresh = () => {
    let val = parseFloat((route.params.key == "progress_per") ? route.params.progress_per : route.params.progress_qty);
    const new_val = val;
    setValuepg(new_val);
    setPinArr([]);
  };

  const onCancel = async (per, qty) => {
    console.log(per);
    console.log(qty);
    await setDataStorage('progress_per', parseFloat(per).toString());
    await setDataStorage('progress_qty', parseFloat(qty).toString());
    await setDataStorage('PGBack', "GOBack");
    navigation.goBack();
  };

  const onCalculator = () => {
    if (route.params.key == 'progress_per') {
      onChangePer(valueretrue);
    } else {
      onChangeQty(valueretrue);
    }
  };

  const onChangeQty = (e) => {
    if (!xt.isEmpty(e)) {
      var per = ((parseFloat(e || 0) * 100) / parseFloat(data.qty)) || '0';
      setProgress_per(per || 0);
      setProgress_qty(e || 0);
      onCancel(per, e);
    }
  };

  const onChangePer = (e) => {
    if (!xt.isEmpty(e)) {
      var qty = ((parseFloat(e || 0) * parseFloat(data.qty)) / 100) || '0';
      setProgress_qty(qty || 0);
      setProgress_per(e || 0);
      onCancel(e, qty);
    }
  };

  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);
  }

  useFocusEffect(
    React.useCallback(() => {
      getLangDF();
      setPinArr([]);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <View style={styles.box}>
          {emty ? (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorText}>{lang.user_not_found}</Text>
            </View>
          ) : (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorText}>&nbsp;</Text>
            </View>
          )}

          <View style={styles.titleContainer}>
            {route.params.key == 'progress_per' ? (
              <Text style={styles.titleText}>{lang.new_progress || 'ความคืบหน้าใหม่'} (%)</Text>
            ) : (
              <Text style={styles.titleText}>{lang.new_progress || 'ความคืบหน้าใหม่'} ({lang.qty || 'จำนวน'})</Text>
            )}
          </View>
          
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{xt.dec(valuepg, route.params.decimal) || "0.00"}</Text>
          </View>

          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('1')}>
                <Text style={styles.keyText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('2')}>
                <Text style={styles.keyText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('3')}>
                <Text style={styles.keyText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('4')}>
                <Text style={styles.keyText}>4</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('5')}>
                <Text style={styles.keyText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('6')}>
                <Text style={styles.keyText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('7')}>
                <Text style={styles.keyText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('8')}>
                <Text style={styles.keyText}>8</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('9')}>
                <Text style={styles.keyText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('0')}>
                <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('-')}>
                <Text style={styles.keyText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyButton} onPress={() => onAddPin('.')}>
                <Text style={styles.keyText}>.</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>{lang.cancel || 'ยกเลิก'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={() => onCalculator()}>
                <Text style={styles.confirmButtonText}>{lang.ok || 'ตกลง'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backspaceButton} onPress={() => onDel()}>
                <Ionicons name="backspace-outline" size={24} color={colors.black_t} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f7',
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: colors.grey_t,
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  valueText: {
    fontSize: 30,
    color: '#8F9BB3',
  },
  keypadContainer: {
    width: '100%',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keyButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#edf1f7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  keyText: {
    fontSize: 20,
    color: colors.black_t,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#edf1f7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.orange,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    width: 100,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  backspaceButton: {
    flex: 0.5,
    height: 50,
    backgroundColor: '#edf1f7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});