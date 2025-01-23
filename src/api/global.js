import Moment from "moment";

import AsyncStorage from '@react-native-async-storage/async-storage';
/////////////////// Get///////////////////
export const toDay = Moment(new Date()).format("DD/MM/YYYY");
export const startDate = Moment(new Date())
  .startOf("month")
  .format("DD/MM/YYYY");
export const endDate = Moment(new Date()).endOf("month").format("DD/MM/YYYY");

export const shortCurrency = (num) => {
  if (Math.abs(num) > 999999) {
    return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "M";
  } else if (Math.abs(num) > 999) {
    return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K";
  } else {
    return Math.sign(num) * Math.abs(num);
  }

  // var isNegative = false
  // // console.log(num);
  // if (num < 0) {
  //     isNegative = true
  // }
  // var num = Math.abs(num)
  // if (num >= 1000000000) {
  //     var formattedNumber = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  // } else if (num >= 1000000) {
  //     var formattedNumber = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  // } else if (num >= 1000) {
  //     var formattedNumber = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  // } else {
  //     var formattedNumber = num;
  // }
  // if (isNegative) { formattedNumber = '-' + formattedNumber }

  // return formattedNumber;
};
export const setMatList = async () => {
  let stackList = (await AsyncStorage.getItem("stackList")) || [];
  console.log("stackList", stackList);

  // const listJob = type_code.map((item, index) => ({
  //   type_code: item,
  // }));
  // console.log("listJob", listJob);
  // return stackList;
};
export const getMainName = async () => {
  let mainname = await AsyncStorage.getItem("mainname");
  return mainname;
}
