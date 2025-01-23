import axios from "axios";
import $xt from "./xtools";
import { getCustomerURL, getHeader } from "./constants";
import { apiAuth } from "./authentication";
import MessageBox from "../api/msg";
import * as FileSystem from "expo-file-system";
import xtools from "../api/xtools";

async function _Base64Photo(data, file, form) {
  let server_data = (await apiAuth.getAuth()).data;
  let auth = server_data.auth;
  // let base64 = auth?.base64_file || "N";
  let filesize = auth.base64_filesize || null;
  console.log("filesize...", filesize);
  // console.log("base64...", base64);
  let _file = data.uri;
  let ext = (_file.split(".").pop() || "").toLowerCase();
  console.log("_file path...", _file);
  console.log("นามสกุล...", ext);
  if (filesize != null) {
    console.log("2");
    let configsize = 1024 * 1024 * filesize;
    console.log("config resize...", data.size, ">", configsize);
    if (parseInt(data.size) > parseInt(configsize)) {
      console.log("3");
      MessageBox.Alert("Warning", `File Size More Than ${filesize}MB`, "OK");
      return false;
    }
  }
  if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx", 'heic'].includes(ext)) {
    console.log("5");
    MessageBox.Alert(
      "Warning",
      `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx, 'heic')`,
      "OK"
    );
    return false;
  }
  console.log("file.uri", file.uri);
  let base64 = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log("base64 file ==>", base64);
  form.append("base64_file", base64);
  form.append("base64_filename", file.name || getRandomString() + ".png");
  form.append("base64_content_type", file.type);
  return true;
}

// async function _Base64Photo(data, file, form) {
//   let server_data = (await apiAuth.getAuth()).data;
//   let auth = server_data.auth;
//   let base64 = auth?.base64_file || "N";
//   let filesize = auth.base64_filesize || null;
//   console.log("filesize...", filesize);
//   console.log("base64...", base64);
//   if (base64 == "N") {
//     form.append("file", file);
//   } else {
//     let _file = data.file;
//     // console.log("_file...", _file);
//     let ext = (_file.split(".").pop() || "").toLowerCase();
//     // console.log("ext..", ext);
//     // console.log("_file...", _file);
//     // if (filesize != null) {
//     //   console.log("2");
//     //   let configsize = 1024 * 1024 * filesize;
//     //   console.log("configsize...", _file.size > configsize);
//     //   if (parseInt(_file.size) > parseInt(configsize)) {
//     //     console.log("3");
//     //     MessageBox.Alert("Warning", `File Size More Than ${filesize}MB`, "OK");
//     //     return false;
//     //   }
//     // }
//     // if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx"].includes(ext)) {
//     //   console.log("5");
//     //   MessageBox.Alert(
//     //     "Warning",
//     //     `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx)`,
//     //     "OK"
//     //   );
//     //   return false;
//     // }
//     let base64 = await FileSystem.readAsStringAsync(file.uri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     //let bas64 = base64.split(",");
//     // console.log("base64_Split...", bas64);
//     form.append("base64_file", base64);
//     form.append("base64_filename", data.file.name);
//     form.append("base64_content_type", data.result.type);
//   }
// }

async function Base64File(data, file, form) {
  let server_data = (await apiAuth.getAuth()).data;
  let auth = server_data.auth;
  // let base64 = auth?.base64_file || "N";
  let filesize = auth.base64_filesize || null;
  console.log("filesize...", filesize);
  // console.log("base64...", base64);
  let _file = data.file;
  let ext = (_file.name.split(".").pop() || "").toLowerCase();
  console.log("ext..", ext);
  console.log("_file...", _file);
  if (["xls", "xlsx"].includes(ext) && filesize != null) {
    let configsize = 1024 * 1024 * 15;
    console.log("_file 2...", _file.size > configsize);
    if (parseInt(_file.size) > parseInt(configsize)) {
      console.log("4");
      MessageBox.Alert("Warning", `File Size More Than 15MB`, "OK");
      return false;
    }
  }
  if (!["xls", "xlsx"].includes(ext) && filesize != null) {
    console.log("2");
    let configsize = 1024 * 1024 * filesize;
    console.log("_file 1...", _file.size > configsize);
    if (parseInt(_file.size) > parseInt(configsize)) {
      console.log("3");
      MessageBox.Alert("Warning", `File Size More Than ${filesize}MB`, "OK");
      return false;
    }
  }
  // let ext = _file.name.split(".").pop();

  if (!["png", "jpg", "jpeg", "pdf", "xls", "xlsx", 'heic', 'heif'].includes(ext)) {
    console.log("5");
    MessageBox.Alert(
      "Warning",
      `File Not Support (Support : png, jpg, jpeg, pdf, xls, xlsx, heic, heif)`,
      "OK"
    );
    return false;
  }
  console.log("Before baswe64");
  let base64 = await FileSystem.readAsStringAsync(_file.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  // let bas64 = base64.split(",");
  // console.log("base64_Split...", bas64);
  form.append("base64_file", base64);
  form.append("base64_filename", data.file.name);
  form.append("base64_content_type", file.type);
  return true;

}
export const getReadList = async (status, field, text, start_date, end_date, sort_type) => {
  console.log("status", status, "field", field, "text", text, "start_date", start_date, "end_date", end_date ,"sort_type",sort_type);
  return await $xt.getServer(
    `qcc/transaction/QcTransaction_ReadForApp?field=${field}&text=${text}&start_date=${start_date}&end_date=${end_date}&complete=${status}&sort=${sort_type}`
  );
};
// export const getReadList = async (status) => {
//   console.log("status", status);
//   return await $xt.getServer(
//     `qcc/transaction/QcTransaction_ReadForApp?complete=${status}`
//   );
// };
export const postReadList = async (data) => {
  console.log("docno", data.docno);
  console.log("header", data.header);
  console.log("detail", data.detail);
  console.log("data", data)
  return await $xt.postServerJson(
    `qcc/transaction/QcTransaction_QcAppUpdate`,
    data
  );
};
export const postRevise = async (data) => {
  console.log("DATA", data);
  var form = new FormData();
  form.append("docno", data.docno);
  form.append("due_date", data.due_date);
  form.append("remark", data.remark);
  console.log("FORM", form);
  // return await $xt.postServerForm(`qcc/transaction/QcTransaction_QcAppCreateRevise`, form)
  return await $xt.postServerJson(
    `qcc/transaction/QcTransaction_QcAppCreateRevise`,
    data
  );
};
export const getCheckList = async (item) => {
  console.log("item", item);
  return await $xt.getServer(
    // `qcc/transaction/QcTransaction_FromDataRead?docno=QC2025090002&pre_event=0000402020&loccode=20240329175258R2c98e&form_code=11111&form_type=Q`
    `qcc/transaction/QcTransaction_FromDataRead?docno=${item.docno}&pre_event=${item.pre_event}&loccode=${item.loccode}&form_code=${item.form_code}&form_type=${item.form_type}`
    // {
    //   docno,
    //   pre_event,
    //   loccode,
    //   form_code,
    //   form_type,
    // }
  );
};
export const postComment = async (data) => {
  console.log("DATA", data);
  // return await $xt.postServerJson(`qcc/transaction/QcTransaction_QcComment`, data)
  return await $xt.postServerJson(
    `Planning/Planning/Planning_CreateTaskcomments`,
    data
  );
};
export const removeComment = async ({
  itemno,
  pre_event,
  plan_code,
  taskid,
}) => {
  // return await $xt.getServer(`qcc/transaction/QcTransaction_QcAppRemovePicture?docno=${docno}&item_number=${item_number}&itemno=${itemno}`)
  return await $xt.getServer(
    `Planning/Planning/Planning_task_comments_Delete?del=${itemno}&pre_event=${pre_event}&plan_code=${plan_code}&taskid=${taskid}`
  );
};
export const reFormatPicture = async (file_path) => {
  // console.log("reFormatPicture", file_path);
  return (await $xt.getBaseUrl()) + `Api/File/DownLoad?id=${file_path}`;
};
export const getResults = async () => {
  //console.log(data);
  // return await $xt.postServerJson(`qcc/transaction/QcTransaction_QcComment`, data)
  return await $xt.getServer(
    `printApi/document/create?token=${localStorage.getItem("mango_auth") || ""
    }&module=QCC&groupcode=${this.groupcode || ""}&doccode=${encodeURIComponent(
      x.doccode
    )}&docno=${$queryString.docno || ""}&new_program=Y`
  );
};
export const getPermissionGallery = async () => {
  return await $xt.getServer(`qcc/master/PermissionGallery`);
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
  // console.log("data",data);
  var file = {
    uri: data.uri,
    type: "image/jpeg",
    name: getRandomString(10) + ".jpg",
  };
  var form = new FormData();
  form.append("file", file);
  console.log("form",form);
  return await $xt.postServerForm(`Anywhere/Center/FileUploadToTemp`, form);
};
export const getPicture = async (docno, item_number) => {
  console.log("docno, item_number", docno, item_number);
  return await $xt.getServer(
    `qcc/transaction/QcTransaction_QcAppPictureReadList?docno=${docno}&item_number=${item_number}`
  );
};
export const getLocation = async (lat, lng) => {
  console.log("lat", lat);
  console.log("lng", lng);
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
export const addPicture = async (data, file) => {
  console.log("file>>>>...", data);


  let server_data = (await apiAuth.getAuth()).data;
  let auth = server_data.auth;
  let base64 = auth?.base64_file || "N";
  let lat = data.location_y;
  let lng = data.location_x;
  var file = {
    uri: data.file,
    type: "image/jpeg",
    name: "photo.jpg",
  };
  // console.log("FileSSS", file);
  var form = new FormData();
  console.log("file...", data.file);
  form.append("docno", data.docno);
  form.append("item_number", data.item_number);
  form.append("remark", data.remark);
  form.append("location_name", data.location_name);
  form.append("location_x", data.location_x);
  form.append("location_y", data.location_y);
  form.append("sizefile", data.sizefile);
  ///////////////////////////////////////base64////////////////
  console.log("check base64", base64);
  console.log("form", form);
  if (base64 == 'Y') {
    let _Base64 = await _Base64Photo(data.result, file, form);
    console.log("_Base64", _Base64);
    if (!_Base64) {
      return {
        success: true,
      };
    }
  } else {
    form.append("file", file);
  }
  return await $xt.postServerForm(`qcc/transaction/QcTransaction_QcAppAddPicture`, form, true);
};
export const addMultiPicture = async (data) => {
  let f = new FormData();
  f.append("docno", data[0].docno);
  f.append("item_number", data[0].item_number);
  f.append("location_name", data[0].location_name);
  f.append("location_x", data[0].location_x);
  f.append("location_y", data[0].location_y);


  for (var i = 0; i < data.length; i++) {
    f.append("file",
      {
        uri: data[i].file,
        type: "image/jpeg",
        name: "photo.jpg"
      }
    );
  }

  // console.log("F", f);
  return await $xt.postServerForm(`qcc/Transaction/QcTransaction_QcAppAddMultiPicture`, f);
};
export const UpdateRemarkInPicture = async (data) => {

  console.log("data", data);
  return await $xt.postServerJson(`qcc/Transaction/QcTransaction_QcAppUpdateRemarkInPicture`, data);
};
export const removePicture = async ({ docno, item_number, itemno }) => {
  console.log("REMOVE", docno, item_number, itemno);
  return await $xt.getServer(
    `qcc/transaction/QcTransaction_QcAppRemovePicture?docno=${docno}&item_number=${item_number}&itemno=${itemno}`
  );
};
export const postAttachfile = async (data, file) => {
  let server_data = (await apiAuth.getAuth()).data;
  let auth = server_data.auth;
  let base64 = auth?.base64_file || "N";

  var file = {
    uri: data.file.uri,
    //     ? "image/png"
    //     ? "video/mp4"

    type: data.file.mimeType,
    name: data.file.name,
  };
  var formData = new FormData();
  formData.append("pre_event2", data.pre_event2);
  formData.append("pre_event", data.pre_event);
  formData.append("plancode", data.plan_code);
  formData.append("doctype", data.doctype);
  formData.append("taskid", data.taskid);
  formData.append("refitemno", "");
  formData.append("sizefile", data.sizefile);
  formData.append("usertype", "N");
  formData.append("resize", "N");
  formData.append("pathfrom", "APP");

  ///////////////////////////////////////base64////////////////
  console.log("base64", base64);
  if (base64 == 'Y') {
    let _Base64 = await Base64File(data, file, formData);
    console.log("_Base64", _Base64);
    if (!_Base64) {
      return {
        success: true,
      };
    }
  } else {
    console.log("formData ELSE");
    formData.append("file", file);
  }
  console.log("formData", formData);
  return await $xt.postServerForm(`Planning/plan/FileUploadToTemp`, formData);
};
export const addSignature = async (data) => {
  var photo = {
    uri: data.file,
    type: "image/png",
    name: "signature.png",
  };
  var form = new FormData();
  form.append("file", photo);
  form.append("docno", data.docno);
  //console.log(data.docno);
  console.log(form);
  return await $xt.postServerForm(
    `qcc/transaction/QcTransaction_QcAppAddSignature`,
    form
  );
};
export const addSignature2 = async (data) => {
  var photo = {
    uri: data.file,
    type: "image/png",
    name: "signature.png",
  };
  var form = new FormData();
  form.append("file", photo);
  form.append("docno", data.docno);
  form.append("name", data.name);
  form.append("type", data.type);
  //console.log(data.docno);
  console.log(form);
  return await $xt.postServerForm(
    `qcc/transaction/QcTransaction_QcAppAddSignature2`,
    form
  );
};
export const addSignatureCustomer = async (data) => {
  var photo = {
    uri: data.file,
    type: "image/png",
    name: "signature.png",
  };
  var form = new FormData();
  form.append("file", photo);
  form.append("docno", data.docno);
  form.append("customer_name", data.customer_name);
  //console.log(data.docno);
  console.log(form);
  return await $xt.postServerForm(
    `qcc/transaction/QcTransaction_QcAppAddSignatureCustomer`,
    form
  );
};
export const readLoopApprove = async () => {
  return await $xt.getServer(`Anywhere/Center/FormSignature?windowcode=QCM`);
};
export const readUserLoopApprove = async ({ formcode, pre_event }) => {
  return await $xt.getServer(
    `Anywhere/Center/FormApprove?formcode=${formcode}&pre_event=${pre_event || ""
    }`
  );
};
export const SendApprove = async (form) => {
  return await $xt.postServerJson(
    `qcc/transaction/QcTransaction_QcAppSendApprove`,
    form
  );
};
export const postCancelSubmit = async (docno, module) => {
  console.log("docno", docno);
  console.log("module", module);
  return await $xt.getServer(`anywhere/center/cancelsubmitapprove?module=${module || "QCM"}&docno=${docno}`);
};
export const getSyscode = async (obj) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/syscode`);
};
export const DefectTemplate_ReadList = async () => {
  return await $xt.getServer(`qcc/master/QcmDefectTemplate_ReadList`);
};
export const getProject = async () => {
  let take = "999999999";
  return await $xt.getServer(`Anywhere/Center/Project_Contract?skip=0&take=${take}&text=&field=refcode&sort=&sort_type=asc&projrunno=&pre_event2=&projcenter=false&checkTender=false&type=1`);
};
export const postGetPorjectHasQCM = async (form) => {
  console.log("form",form);
  return await $xt.postServerJson(
    `QCC/Transaction/QcTransaction_GetProjectHasQCM`,
    form
  );
}