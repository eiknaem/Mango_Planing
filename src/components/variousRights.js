
import { apiAuth } from "../api/authentication";
import { xt, getDataStorage, setDataStorage } from "../api/service";
import linq from "js-linq";


const $linq = (arr) => new linq(arr);
console.log("hihihihihihihihihihii");

// General Setting 

export const CheckViewPPN = async () => { // สิทธิ์ในการดูโครงการ 
    console.log("CheckViewPPN");

    let server_data = (await apiAuth.getAuth()).data;
    console.log("server_data11111111111111", server_data);

    let auth = server_data.auth;
    var site_ = await getDataStorage("sitevalue_key");

    console.log("site_11111111111111111111", site_);
    let checkConfig = await xt.getServer(`${site_}Anywhere/Management/EmployeeRead?empno=${auth.empno}`)
    return checkConfig.data.data.st_view_ppn;
}

// User Right
export const ProjectManagement_UR = async () => {   // สิทธิ์ Setting Project Management
    let server_data = (await apiAuth.getAuth()).data;
    let menu_right = server_data.menu_right
    let pm = $linq(menu_right).where(y => y.menu_id == "18010").toArray()
    return (((pm.length == 0) ? "N" : "Y"));
}

export const PlanSetting_UR = async () => {   // สิทธิ์ Plan Setting
    let server_data = (await apiAuth.getAuth()).data;
    let menu_right = server_data.menu_right
    let ps = $linq(menu_right).where(y => y.menu_id == "12400").toArray()
    return (((ps.length == 0) ? "N" : "Y"));
}

export const Attachfile_UR = async () => {   // สิทธิ์ Attachfile หน้า task
    let server_data = (await apiAuth.getAuth()).data;
    let menu_right = server_data.menu_right
    let at = $linq(menu_right).where(y => y.menu_id == "13800").toArray()
    return (((at.length == 0) ? "N" : "Y"));
}

export const UpdateProgress_UR = async () => {   // สิทธิ์ในการ update progress
    let server_data = (await apiAuth.getAuth()).data;
    let menu_right = server_data.menu_right
    let check_UpdatePr = $linq(menu_right).where(y => y.menu_id == "14110").toArray()
    return (((check_UpdatePr.length == 0) ? "N" : "Y"));
}

// project right

export const checkProjectRight = async () => {
    let server_data = (await apiAuth.getAuth()).data;
    let auth = server_data.auth;
    var site_ = await getDataStorage("sitevalue_key");
    let checkPR = await xt.getServer(`${site_}Anywhere/Management/Project?empcode=${auth.empcode}&all_project=N`)
    return checkPR;
}


