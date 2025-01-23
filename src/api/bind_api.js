import axios from "axios";
import $xt from "./xtools";
import { getCustomerURL, getHeader } from "./constants";
/////////////////// Center ///////////////////
export const getVendor = async (checkCust) => {
  return await $xt.getServer(`Anywhere/Center/Vendor?check_cust=${checkCust}`);
};
export const getProjectToJob = async (pre_event) => {
  return await $xt.getServer(`Anywhere/Center/ProjectToJob?pre_event=${pre_event}&check=true`);
};
export const getDataType = async () => {
  return await $xt.getServer(`Anywhere/Center/DataType`);
};
export const getFormSignaturePR = async () => {
  return await $xt.getServer(`anywhere/center/FormSignature?windowcode=PR&module=PR`);
};
export const getCurrency = async () => {
  return await $xt.getServer(`anywhere/center/currency`);
};
export const getTax = async () => {
  return await $xt.getServer(`Anywhere/Center/Tax`);
};
export const postCostCenter = async (cost) => {
  return await $xt.postServerJson(`Anywhere/Center/CalculateCostCenter`, cost);
};

/////////////////// APPROVE ///////////////////
export const getReview = async () => {
  return await $xt.getServer(`ext_api/approve/Approve_review_Readlist`);
};
export const getWaiting = async () => {
  return await $xt.getServer(`ext_api/approve/Approve_waiting_Readlist`);
};
export const getUpper = async () => {
  return await $xt.getServer(`ext_api/approve/Approve_upper_Readlist`);
};
export const getCancel = async () => {
  return await $xt.getServer(`ext_api/approve/Approve_cancle_Readlist`);
};
export const getCountApproveType = async (maincode) => {
  return await $xt.getServer(`ext_api/approve/Count_ApproveType?maincode=${maincode}`);
};
export const getComment = async (item, maincode, docno) => {
  console.log("getComment", item.maincode, item.docno, item.doctype);
  return await $xt.getServer(`ext_api/Approve/App_Comment_ReadList?maincode=${item.maincode}&doctype=${item.doctype}&docno=${item.docno}`);
};
export const updateDoc = async (docList) => {
  console.log("docList", docList);
  let data = {
    form: docList,
  };
  return await $xt.postServerJson(`ext_api/approve/Approve_review_Update`, data);
};
export const updateCancelDoc = async (docList) => {
  console.log("docList", docList);
  let data = {
    form: docList,
  };
  return await $xt.postServerJson(`ext_api/approve/cancle_update`, data);
};
export const createWebviewToken = async () => {
  return await $xt.postServer(`Api/Public/CreateFakeTokenViews`);
};
export const AttachFileData = async ({ doctype, maincode, docno, itemno, token }) => {
  await console.log(doctype, maincode, docno, token);
  const headers = await getHeader();
  // var testLog =
  return axios
    .get(`${await getCustomerURL()}/ext_api/DocumentDetail/APFile_ReadList`, {
      headers,
      params: {
        doctype,
        maincode,
        prno: docno,
        itemno,
        token,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => console.log(err));
};
let getRandomString = (length) => {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};
export const postPicture = async (data) => {
  var file = {
    uri: data.uri,
    type: "image/jpeg",
    name: getRandomString(10) + ".jpg",
  };
  var form = new FormData();
  form.append("file", file);
  return await $xt.postServerForm(`Anywhere/Center/FileUploadToTemp`, form);
};
export const addSignature = async (data) => {
  console.log("data", data);
  var photo = {
    uri: data.file,
    type: "image/png",
    name: "signature.png",
  };
  var form = new FormData();
  form.append("file", photo);
  form.append("docno", data.docno);
  form.append("resize", "Y");
  //console.log(data.docno);
  console.log(form);
  return await $xt.postServerForm(`Data/CSM_FileUploadToTemp`, form);
};
export const postVideo = async (data) => {
  var file = {
    uri: data.uri,
    type: "video/mp4",
    name: getRandomString(10) + ".mp4",
  };
  var form = new FormData();
  form.append("file", file);
  form.append("resize", "Y");
  // return await $xt.postServerForm(`Data/CSM_FileUploadToTemp`, form);
  return await $xt.postServerForm(`Data/CSM_FileUploadToTemp`, form);
};
export const readPicture = async (docno, type) => {
  console.log("docno", docno, type);
  return await $xt.getServer(`Anywhere/Center/AttachPictures?docno=${docno}&doctype=${type || "OTH"}&lineno=0`);
};
export const reFormatPicture = async (file_path) => {
  return (await $xt.getBaseUrl()) + `Api/File/DownLoad?id=${file_path}`;
};
export const postCancelSubmit = async (docno) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/cancelsubmitapprove?module=OTH&docno=${docno}`);
};

///////////////////////////Module IC ///////////////////

export const getAsset = async (stock_oil, matcode) => {
  return await $xt.getServer(`Anywhere/Center/AssetList?text=${matcode || ""}&field=facode&status=N&stock_oil=${stock_oil}`);
};
export const getFACostCode = async (stock_oil) => {
  return await $xt.getServer(`Anywhere/Center/FACostcodeList?stock_oil=${stock_oil}`);
};
export const getReadRefMain = async (pre_event2, matcode) => {
  // console.log("testtest",pre_event, stock_oil);
  return await $xt.getServer(`Anywhere/IC/ReadRefMain?text=${matcode}&field=itemcode&pre_event2=${pre_event2}`);
};
export const getFormSubmit = async (docno, formcode) => {
  console.log("params", docno, formcode);
  return await $xt.getServer(`Anywhere/Center/FindInformationSubmit?docno=${docno}&doctype=IC_EN&formcode=${formcode}&submit=Y`);
};
export const getMaterialBalanceList = async () => {
  return await $xt.getServer(
    // `Anywhere/Center/Project_IC`
    `Anywhere/Center/Project_IC?skip=0&take=999999999`
    // `Anywhere/Center/Project_IC?skip=0&take=10`
  );
};
export const getICMaterialList = async (pre_event) => {
  // console.log("testtest",pre_event);
  return await $xt.getServer(`Anywhere/Center/ICMaterialList?pre_event2=${pre_event}&select_lot=N&text=&field=itemname&send=N`);
};
export const getWhereHouse = async (pre_event) => {
  return await $xt.getServer(`Anywhere/Center/WarehouseList?pre_event=${pre_event}`);
};
export const getArea = async (pre_event) => {
  return await $xt.getServer(`Anywhere/Master/ic_mas300_ReadList?skip=0&take=9999&pre_event=${pre_event}&show_all=N&text=`);
};
export const getCostCodeByBudget = async (pre_event, projno) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/CostCodeByBudget?pre_event=${pre_event}}`);
};
export const getCostcode_Type = async () => {
  return await $xt.getServer(`anywhere/center/costcode_type?skip=0&take=99999`);
};
export const getCostcode_Group = async (cc_code) => {
  return await $xt.getServer(`Anywhere/Center/Costcode_Group?text=&cc_code=${cc_code}`);
};
export const getCostcode_SubGroup = async (cc_code, c_code0) => {
  return await $xt.getServer(`Anywhere/Center/Costcode_SubGroup?text=&cc_code=${cc_code}&c_code0=${c_code0}&not_costcode=N`);
};
export const getRaferanceBy = async (pre_event2) => {
  console.log("pre_event2", pre_event2);
  return await $xt.getServer(`Anywhere/Master/Ic_Mas200_ReadList?skip=0&take=999999999&pre_event2=${pre_event2}&text=&active=Y`);
};
export const getFormSignature = async (module) => {
  return await $xt.getServer(`anywhere/center/FormSignature?windowcode=${module || "IC_EN"}&module=${module || "IC_EN"}`);
};

export const getFormApprove = async (formcode, pre_event) => {
  console.log("formcode, pre_event", formcode, pre_event);
  return await $xt.getServer(`anywhere/center/FormApprove?formcode=${formcode}&pre_event=${pre_event}`);
};

export const getRetiveEntry = async (pre_event2) => {
  return await $xt.getServer(`Anywhere/IC/v_ic_entry_trn220_readlist?text=&pre_event2=${pre_event2}&field=docno&skip=0&take=999999999&sort=&sort_type=desc`);
  // Anywhere/IC/v_ic_entry_trn220_readlist?text=&pre_event2=2021054&field=docno&skip=0&take=10&sort=&sort_type=desc
};
export const getEntryRead = async (docno) => {
  return await $xt.getServer(`Anywhere/IC/v_ic_entry_trn220_read?docno=${docno}`);
};
export const getSaveEntry = async (data) => {
  return await $xt.postServerJson(`Anywhere/IC/v_ic_entry_trn220_create`, data);
};
export const getScantree = async (data) => {
  console.log("data");
  // console.log("ggg", await $xt.getServer(
  //   `anywhere/center/FormSignature?windowcode=IC_EN&module=IC_EN`
  // ));
  return await $xt.getServer(`Anywhere/IC/ICApp_Scantree?pre_event2=${data.pre_event2}&docno=${data.docno}&itemno=${data.itemno}&seriesno=${data.seriesno}`);
};
export const getICAPP_ReadList = async (pre_event2, docno) => {
  return await $xt.getServer(`Anywhere/IC/ICAPP_ReadList?pre_event2=${pre_event2}&text=${docno || ""}&field=docno`);
};
export const getICAPP_Read = async (pre_event2, docno, inout) => {
  return await $xt.getServer(`Anywhere/IC/ICAPP_Read?pre_event2=${pre_event2}&docno=${docno}&inout=${inout}`);
};

export const getSoList = async (pre_event2) => {
  return await $xt.getServer(`Anywhere/IC/v_ic_entry_trn220_soreadlist?skip=0&take=10&pre_event2=${pre_event2}`);
};
export const getSoBalance = async (so_no, pre_event2, matcode) => {
  return await $xt.getServer(`Anywhere/IC/v_ic_entry_trn220_soreadicbalance?so_no=${so_no}&pre_event2=${pre_event2}&text=${matcode || ""}&field=type_code`);
};
export const getMatAreaList = async (pre_event2, jobcode, loccode) => {
  return await $xt.getServer(`Anywhere/IC/v_ic_entry_trn220_readMaterialArealist?pre_event2=${pre_event2}&jobcode=${jobcode}&loccode=${loccode}`);
};
export const getSubCode = async () => {
  return await $xt.getServer(`Anywhere/Center/Vendor?check_cust=N&appv_vandor=&show_all=N&text=&bank_id=&branch_id=&account_code=&appchq=N`);
};
////////////// Module Notification ///////////
export const getNarmal = async (type, Subtype) => {
  // console.log("type, Subtype", type, Subtype);
  return await $xt.getServer(`ext_api/notifications/Notifications_Readlist?type=${type}&Subtype=${Subtype}`);
};
export const getColateral = async (type, Subtype) => {
  return await $xt.getServer(`ext_api/notifications/Notifications_Readlist2?type=${type}&Subtype=${Subtype}`);
};
export const getTypeData = async () => {
  return await $xt.getServer(`ext_api/notifications/Notifications_type`);
};
export const getNotiMRP = async () => {
  return await $xt.getServer(`Ext_API/Notifications/Notifications_MRP`);
};

////////////// Module PR ///////////
export const getDepartMent = async () => {
  return await $xt.getServer(`Anywhere/Center/Department`);
};
export const getMatList = async () => {
  return await $xt.getServer(`anywhere/center/MaterialList?text=&skip=0&take=99999`);
};
export const getTypeList = async () => {
  return await $xt.getServer(`anywhere/center/costcode_type?skip=0&take=99999`);
};
export const getGroupList = async (cc_code) => {
  return await $xt.getServer(`anywhere/center/costcode_group?skip=0&take=99999&cc_code=${cc_code}`);
};
export const getSubGroupList = async (cc_code, c_code0) => {
  return await $xt.getServer(`anywhere/center/costcode_subgroup?skip=0&take=99999&cc_code=${cc_code}&c_code0=${c_code0}`);
};
export const getConfig = async (obj) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/config`);
};
export const getWhoorderList = async () => {
  return await $xt.getServer(`anywhere/center/WhoorderList`);
};
export const getCostcode = async (pr_type) => {
  return await $xt.getServer(`Anywhere/Center/CostCodeList?skip=0&take=999999999&text=&field=c_des&not_costcode=N&pr_type=${pr_type}`);
};
export const getRefBOQ = async (pre_event, jobcode) => {
  return await $xt.getServer(`Anywhere/Center/BOQList?text=&field=type_name&pre_event=${pre_event}&jobcode=${jobcode}`);
};
export const getSyscode = async (obj) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/api/StoreSyscode`);
};
// export const getSyscode = async (obj) => {
//   // console.log("obj", obj);
//   return await $xt.getServer(`anywhere/center/syscode`);
// };
export const pr_getRetrieve = async () => {
  return await $xt.getServer(`Anywhere/OF/PR_ReadList?skip=0&take=99999?text=&sort=prno&sort_type=desc&pending=N&field=prno`);
};
export const pr_postCancelSubmit = async (prno) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/cancelsubmitapprove?module=PR&docno=${prno}`);
};
export const getRead = async (docno) => {
  return await $xt.getServer(`Anywhere/OF/PR_Read?docno=${docno}`);
};
export const postFormData = async (obj) => {
  console.log("obj", obj);
  return await $xt.postServerJson(`Anywhere/OF/PR_CreateAndUpdate`, obj);
};
export const pr_getVendor = async () => {
  return await $xt.getServer(`Anywhere/Center/Vendor?check_cust=&appv_vandor=&show_all=N&text=&bank_id=&branch_id=&account_code=&appchq=N`);
};
export const retrieveFormApprove = async (docno) => {
  return await $xt.getServer(`Anywhere/Center/ApproveInformation?docno=${docno}&doctype=PR`);
};
export const pr_getFormApprove = async (formcode, pre_event, dpt_no) => {
  console.log("obj", "pre_event", pre_event, "dpt_no", dpt_no);
  return await $xt.getServer(`anywhere/center/FormApprove?formcode=${formcode}&pre_event=${pre_event}&dpt_no=${dpt_no}`);
};

////////////// Module PO ///////////
export const getPO = async (pono, completepo, barcode) => {
  const headers = await getHeader();
  console.log("headers", await getCustomerURL());
  return axios
    .get(`${await getCustomerURL()}/ext_api/PoApi/PoCompleteBeforeReadList`, {
      headers,
      params: {
        pono,
        completepo,
        barcode,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => console.log(err));
};
export const getPORec = async (pono) => {
  const headers = await getHeader();
  return axios
    .get(`${await getCustomerURL()}/ext_api/PoApi/PORecHeader2SearchReadList`, {
      headers,
      params: {
        pono,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => console.log(err));
};
export const getPORecDetail = async (pono, recno) => {
  const headers = await getHeader();
  let res = await axios.get(`${await getCustomerURL()}/ext_api/PoApi/PORecReadList`, {
    headers,
    params: {
      pono,
      recno,
    },
  });
  //.then(res => res.data.data)
  //.catch(err => console.log(err));
  return res.data.data;
};
export const getPOReceivePic = async (recno) => {
  console.log("recno", recno);
  const headers = await getHeader();
  let res = await axios.get(`${await getCustomerURL()}/ext_api/PoApi/PicReadList`, {
    headers,
    params: {
      pre_event: recno,
    },
  });
  //.then(res => res.data.data)
  //.catch(err => console.log(err))

  return res.data.data;
};
export const getPONewInfo = async (pono) => {
  const headers = await getHeader();
  return axios
    .get(`${await getCustomerURL()}/ext_api/PoApi/POReadListNewInfo`, {
      headers,
      params: {
        pono,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => console.log(err));
};
export const getPODetail = async (pono) => {
  const headers = await getHeader();
  return axios
    .get(`${await getCustomerURL()}/ext_api/PoApi/PODetailReadList`, {
      headers,
      params: {
        pono,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => console.log(err));
};
export const checkConfig = async () => {
  const headers = await getHeader();
  return axios
  .get(`${await getCustomerURL()}/Anywhere/Center/Config`, {
    headers,
  })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
export const getPOSyscode = async (obj) => {
  // console.log("obj", obj);
  const headers = await getHeader();
  return axios
  .get(`${await getCustomerURL()}/Anywhere/Center/syscode`, {
    headers,
  })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
export const createPORec = async ({
  ap_poheader,
  ap_porec_header2,
  ap_porec_detail,
  photos,
}) => {
  const headers = await getHeader();
  let header2 = await getHeader();
  header2["Content-Type"] = "multipart/form-data";

  let photo2 = [];
  for (let i in photos) {
    let localUri = photos[i];
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("file", { uri: localUri, name: filename, type });

    let act = `${await getCustomerURL()}ext_api/PoApi/PoPhotoUpload`;
    let rspp = (await axios.post(act, formData, { headers: header2 })).data;
    if (rspp.error) {
      throw rspp.error;
    }

    photo2.push(rspp.data.file);
  }

  console.log(photo2);

  const data = {
    ap_poheader,
    ap_porec_header2,
    ap_porec_detail,
    photos: photo2,
  };
  console.log("PoCreate3", data);
  let rsp = await axios.post(
    `${await getCustomerURL()}ext_api/PoApi/PoCreate3`,
    data,
    { headers }
  );
  //.then(res => res)
  //    .catch(err => console.log(err));

  return rsp;
};
export const getFinfDataDoc = async (docno) => {
  console.log("docno", docno);
  return await $xt.getServer(`Anywhere/EVAL/FindDataDoc?docno=${docno}&type=POREC`);
};
export const getCustEvalRefDocRead = async (acct_no, pre_event, formcode) => {
  console.log("acct_no, pre_event, formcode", acct_no, pre_event, formcode);
  return await $xt.getServer(`Anywhere/EVAL/CustEvalRefDocRead?acct_no=${acct_no}&pre_event=${pre_event}&formcode=${formcode}`);
};
export const getCustEvalCreate = async (data) => {
  return await $xt.postServerJson(`Anywhere/EVAL/CustEvalCreate`, data);
};
////////////// Module Cash Flow ///////////
export const getCashFlowDaily = async (start_date, end_date) => {
  console.log("start_date, end_date", start_date, end_date);
  // console.log("getReadList", await $xt.postServerJson(`ext_api/CashFlowApi/CashFlowApi_CashFlowDaily`,{ start_date, end_date }));
  return await $xt.postServerJson(`ext_api/CashFlowApi/CashFlowApi_CashFlowDaily`, { start_date, end_date });
};

export const getIncomeList = async (start_date, end_date) => {
  console.log("getIncomeList", start_date, end_date);
  return await $xt.postServerJson(`ext_api/CashFlowApi/CashFlowApi_dataAll`, {
    start_date,
    end_date,
  });
};
export const ForecastIncome = async (start_date, end_date) => {
  // console.log("ForecastIncome", start_date, end_date);
  return await $xt.postServerJson(`ext_api/CashFlowApi/CashFlowApi_ForecastIncome`, { start_date, end_date });
};

export const ProjectPlanning = async () => {
  return $xt.getServer(`Planning/Planning/Planning_project_web`);
};

export const PlanPlanning = async (pre_event) => {
  console.log("PRE_EVENT", pre_event);
  return $xt.getServer(`Planning/Planning/Planning_plan_web?pre_event=${pre_event}&statussearch=`);
};

export const ProjectStatus = async () => {
  return $xt.getServer(`ext_api/CashFlowApi/ProjectStatus_ProjectAll`);
};
////////////// Module Billing ///////////

export const getProject = async () => {
  return await $xt.getServer(`Anywhere/Center/Project_Contract?skip=0&take=99999&text=&field=refcode&sort=&sort_type=asc&projrunno=&pre_event2=&projcenter=false&checkTender=false&type=1`);
};
export const getRetrieveBill = async () => {
  let take = "999999999"; //999999999 B2020100030
  return await $xt.getServer(`Anywhere/of/AP_Billsubc_ReadRetrieve?skip=0&take=${take}&text=P&field=billtype&alldoc=N`);
};
export const getReadWO = async (text) => {
  let take = "999999999"; //999999999
  return await $xt.getServer(`Anywhere/OF/AP_Billsubc_LoadRetrieve?skip=0&take=${take}&text=${text || ""}&field=docno`);
};
export const getForecastWO = async (item) => {
  return await $xt.getServer(`Anywhere/OF/Billsubc_Forecast?docno=${item.docno}&plan_no=`)
};
export const getDetailWO = async (item) => {
  return await $xt.getServer(`Anywhere/OF/AP_Billsubc_LoadDetail?doctype=B&docno=${item.docno}&billtype=P`);
};
export const getBilling = async (item) => {
  return await $xt.getServer(`Anywhere/OF/AP_Billsubc_Read?billno=${item.billno}`);
};
export const readFile = async (data) => {
  return await $xt.getServer(`Anywhere/Center/AttachFile?docno=${data.billno}&doctype=BILL&lineno=0&docno_arr=${data.billno}`); //chq_proj_doc
};
export const getLessOther = async () => {
  return await $xt.getServer(`Anywhere/Center/LessOtherList?whflag=N`);
};
export const getLocation = async (lat, lng) => {
  return axios
    .get(`https://control.mangoanywhere.com/mango_geo/data/fetch`, {
      params: {
        lat,
        lng,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
export const SendApprove = async (form) => {
  return await $xt.postServerJson(`Anywhere/OF/AP_Billsubc_CreateAndUpdate`, form);
};
export const VaildDetail = async (form) => {
  return await $xt.postServerJson(`Anywhere/OF/VaildDetailBill`, form);
};
export const readPicturebill = async (data) => {
  return await $xt.getServer(`Anywhere/Center/AttachPictures?docno=${data.billno}&doctype=BILL`); //chq_proj_pic
};
export const readSyscode = async () => {
  return await $xt.getServer(`Anywhere/Management/SyscodeRead`);
};

export const readLoopApprove = async () => {
  return await $xt.getServer(`Anywhere/Center/FormSignature?windowcode=BIL`);
};
export const readUserLoopApprove = async ({ formcode, pre_event, dpt_code }) => {
  console.log(formcode, pre_event, dpt_code);
  return await $xt.getServer(`Anywhere/Center/FormApprove?formcode=${formcode}&pre_event=${pre_event || ""}&dpt_no=${dpt_code || ""}`);
};
export const CancelApprove = async (form) => {
  // console.log("HEADER BACKEND", form);
  return await $xt.getServer(`Anywhere/Center/CancelSubmitApprove?module=BIL&docno=${form.billno}`);
};

////////////// Module PM ///////////
////////////// Module FA ///////////

////////////// Module CountAsset ///////////
export const readConfig = async () => {
  return await $xt.getServer(`Anywhere/Center/Config`);
};
export const getItem = async (data) => {
  return await $xt.getServer(`/Anywhere/FA/ReadListApp?text=&field=facode&pre_event=${data.pre_event || ""}&dpt_code=${data.dpt_code || ""}`);
};
export const getRetrieve = async (data) => {
  let take = "999999999";
  return await $xt.getServer(`/Anywhere/FA/CountAssetReadList?text=&sort=&sort_type=desc&skip=0&take=${take}&pre_event=${data.pre_event || ""}&dpt_code=${data.dpt_code || ""}`);
};
export const getFALocation = async () => {
  let take = "999999999";
  return await $xt.getServer(`/Anywhere/Master/Fa_Location_ReadList?skip=0&take=${take}`);
};
export const postTrn800 = async (data) => {
  return await $xt.postServerJson(`Anywhere/FA/CountAssetCreateAndUpdate`, data);
};
export const readAsset = async (data) => {
  return await $xt.getServer(`/Anywhere/FA/CountAssetRead?docno=${data.docno}`);
};
export const getAssetList = async (data) => {
  console.log(data.pre_event, data.dpt_code);
  return await $xt.getServer(`Anywhere/FA/ReadAssetOutsideApp?text=&field=facode&pre_event=${data.pre_event || ""}&dpt_code=${data.dpt_code || ""}`);
};
export const getAssetType = async () => {
  return await $xt.getServer(`Anywhere/Center/AssetTypeList`);
};
export const getVendor1 = async () => {
  return await $xt.getServer(`Anywhere/Center/Vendor?check_cust=&show_all=N&text=`);
};
export const getEmployee = async () => {
  return await $xt.getServer(`Anywhere/Center/Employee?text=&level=&signCustom=N`);
};
export const getDepartmentfa = async () => {
  let take = "999999999";
  return await $xt.getServer(`/Anywhere/Center/Department?text=`);
};

export const readPictureFa = async (data) => {
  return await $xt.getServer(`Anywhere/Center/AttachFile?docno=${data.facode}&doctype=ASSET&lineno=0&docno_arr=${data.facode}`);
};
export const readAssetItem = async (data) => {
  return await $xt.getServer(`/Anywhere/FA/Trn100_Read?facode=${data.facode}`);
};
export const postNewAsset = async (data) => {
  // console.log("DATA", data);
  return await $xt.postServerJson(`Anywhere/FA/AppAssetCreateAndUpdate`, data);
};
export const postTrn100 = async (data) => {
  // console.log("DATA", data);
  return await $xt.postServerJson(`Anywhere/FA/Trn100_CreateAndUpdate`, data);
};

