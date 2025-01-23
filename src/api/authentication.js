import axios from 'axios'
import $xt from './xtools'
import linq from 'js-linq'
import * as Application from 'expo-application';
import { Platform } from 'react-native'

const $linq = arr => new linq(arr);

let apiPasscode = {
    async getIP(passcode) {
        let url = `https://gateway.mangoanywhere.com/mobile_ip/Home/GetAuthorized2?cus_code=${encodeURIComponent(passcode)}`;
        let rsp = await axios.get(url);
        return rsp.data;
    },
    async getCompany(base) {
        // console.log("base", base);
        let url = `${base || ''}Api/Public/LoginCompanies/`
        // console.log("getCompany", url);
        let rsp = await axios.get(url);
        return rsp.data;
    }
};

let apiAuth = {
    notificationConfigure: async () => {
        // Notifications
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return '';
        }

        // Get the token that uniquely identifies this device

        let token = ''
        //try {
        token = await Notifications.getExpoPushTokenAsync();
        //} catch (ex) {
        //    console.log(ex.toString())

        //}

        return token;
    },
    async login(maincode, userid, userpass, token_push, accessToken, request_otp, otp_ref, otp_pass, signature) {
        console.log("token_pushwwww", maincode, userid, userpass);
        // if ($xt.isEmpty(maincode) || $xt.isEmpty(userid) || $xt.isEmpty(userpass)) {
        //   throw `โปรดป้อนข้อมูลให้ครบทุกช่อง. Please fill in all required fields.`;
        // }
        // const token_push = await apiAuth.notificationConfigure();
        // const device_id = await Constants.deviceId;
        var device_id = ""
        if (Platform.OS === "android") {
            device_id = Application.getAndroidId;
        } else {
            device_id = await Application.getIosIdForVendorAsync();
        }
        //string is_api = "N", string app_name = "POOL"
        let url = `Api/Public/Login?is_api=${global.is_api || "N"}&app_name=${global.app_name || "ALLAPP"}`
        // let token_push = ""
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
            oauth2: accessToken ? "Y" : "N"
        };
        console.log("form login", form);
        let rsp = await $xt.postServerJson(url, form);
        return rsp;
    },
    async getAuth() {
        //PLANWEB
        let url = `Api/Public/ViewInitData2?menu_name=PLANWEB`
        let rsp = await $xt.getServer(url);
        // console.log(rsp)
        return rsp;
    },
    async logout() {
        //PLANWEB
        let url = `Api/Public/logout?is_api=${global.is_api || 'N'}&all=false`
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

export const requestOTPMango = async (maincode, userid, email, signature) => {
    let url = "api/public/RequestMangoOTP";
    var form = new FormData();
    form.append("maincode", maincode);
    form.append("userid", userid);
    form.append("email", email);
    form.append("signature", signature);
    console.log("form", form);
    let rsp = await $xt.postServerForm(url, form);
    return rsp
};