import axios from 'axios'
import * as Application from 'expo-application';
import $xt from '../api/xtools'
import linq from 'js-linq'
import { Platform } from 'react-native'
import { xt, getDataStorage, setDataStorage } from '../api/service'

const $linq = arr => new linq(arr);

let apiPasscode = {
    async getIP(passcode) {
        let url = `https://gateway.mangoanywhere.com/mobile_ip/Home/GetAuthorized2?cus_code=${encodeURIComponent(passcode)}`;
        let rsp = await axios.get(url);
        return rsp.data;
    },
    async getCompany(base) {
        let url = `${base || ''}Api/Public/LoginCompanies/`
        let rsp = await axios.get(url);
        return rsp.data;
    }
};

let apiAuth = {
 
    async login(maincode, userid, userpass) {
        // if ($linq(Array.from(arguments)).any(x => $xt.isEmpty(x))) {
        //     throw `โปรดป้อนข้อมูลให้ครบทุกช่อง. Please fill in all required fields.`
        // }

        // const token_push = await apiAuth.notificationConfigure();     
        // const device_id = await Constants.deviceId;
        var device_id = ""
        if(Platform.OS === "android"){
            device_id = Application.getAndroidId;
        }else{
            device_id = await Application.getIosIdForVendorAsync();
        }
        //string is_api = "N", string app_name = "POOL"
        let url = `Api/Public/Login?is_api=Y&app_name=APP`
        let form = {
            maincode,
            userid,
            userpass,
            device_id,
            token_push,
            platform: 'APP',
            request_otp: request_otp || "Y",
            otp_ref,
            otp_pass,
            otp_signature: signature,
            ms_access_token: accessToken,
            oauth2 : accessToken ? "Y" : "N"
        }
        console.log("form", form);

        let rsp = await $xt.postServerJson(url, form);
        return rsp;
    },
    async getAuth() {
        //PLANWEB
        let url = `Api/Public/ViewInitData2?menu_name=PLANWEB`
        let rsp = await xt.getServer(url);
        console.log("getAuth",rsp)
        return rsp;
    },
    async logout() {
        //PLANWEB
        let url = `Api/Public/logout?is_api=Y&all=false`
        let rsp = await $xt.getServer(url);
        //console.log(rsp)
        return rsp;
    },
}
export { apiPasscode, apiAuth }

export const loginOtherApplication = async (token, app_name) => {
    // console.log(`Planning/Planning/Planning_projectsummary?pre_event2=${pre_event2}&pre_event=${pre_event}`);
    return await $xt.getServer(
      `api/public/LoginOtherApplication?token=${token}&app_name=${app_name}`
    );
  };
  