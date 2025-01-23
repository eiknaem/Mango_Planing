import $xt from "./xtools";
/////////////////// Center ///////////////////
export const getVendor = async (checkCust) => {
  return await $xt.getServer(`Anywhere/Center/Vendor?check_cust=${checkCust}`);
};
export const getDepartMent = async () => {
  return await $xt.getServer(`Anywhere/Center/Department?text=`);
};

export const getProject = async () => {
  return await $xt.getServer(
    `Anywhere/Center/Project_Contract?skip=0&take=99999&text=&field=refcode&sort=&sort_type=asc&projrunno=&pre_event2=&projcenter=false&checkTender=false&type=1`
  );
};
export const getRemark = async () => {
  return await $xt.getServer(
    `Anywhere/Center/SmDescription?desgroup=APO`
  );
};
export const getProjectToJob = async (pre_event) => {
  return await $xt.getServer(
    `Anywhere/Center/ProjectToJob?pre_event=${pre_event}&check=true`
  );
};
export const getDataType = async () => {
  return await $xt.getServer(`Anywhere/Center/DataType`);
};
export const getCurrency = async () => {
  return await $xt.getServer(`anywhere/center/currency`);
};
export const getTax = async () => {
  return await $xt.getServer(`Anywhere/Center/Tax`);
};
/////////////////// Detail ///////////////
export const getEmployee = async () => {
  return await $xt.getServer(
    `Anywhere/Center/Employee?text=&level=&signCustom=N`
  );
};
export const getExpenseList = async (pre_event, dpt_no) => {
  console.log("pre_event", pre_event, dpt_no);
  return await $xt.getServer(
    `Anywhere/Center/ExpenseList?pre_event=${pre_event || ""}&dpt_code=${dpt_no || ""}`
  );
};
export const PC_CheckCostCode = async (costcode, pre_event) => {
  return await $xt.getServer(
    `Anywhere/OF/PC_CheckCostCode?costcode=${costcode || ""}&pre_event=${
      pre_event || ""
    }`
  );
};
export const getCostcode = async () => {
  return await $xt.getServer(
    `Anywhere/Center/CostCodeList?skip=0&take=30&text=&field=c_des&not_costcode=Y&pr_type=`
  );
};
export const getCostcode_Type = async () => {
  return await $xt.getServer(`anywhere/center/costcode_type?skip=0&take=99999`);
};
export const getCostcode_Group = async (cc_code) => {
  return await $xt.getServer(
    `Anywhere/Center/Costcode_Group?text=&cc_code=${cc_code}`
  );
};
export const getCostcode_SubGroup = async (cc_code, c_code0) => {
  return await $xt.getServer(
    `Anywhere/Center/Costcode_SubGroup?text=&cc_code=${cc_code}&c_code0=${c_code0}&not_costcode=N`
  );
};
export const getCostCodeByBudget = async (pre_event, projno) => {
  return await $xt.getServer(
    `anywhere/center/CostCodeByBudget?pre_event=${pre_event}&projno=${projno}`
  );
};
/////////////////// End Center ///////////////////
/////////////////// Get///////////////////
export const getRetrieve = async () => {
  return await $xt.getServer(
    `Anywhere/OF/PC_ReadList?text=&field=docno&data_ty=0&cbx_1=N&cbx_2=N&cbx_3=N?skip=0&take=99999`
  );
};
export const getRead = async (docno) => {
  return await $xt.getServer(`Anywhere/OF/PC_Read?docno=${docno}`);
};
export const getRefBOQ = async (pre_event, jobcode) => {
  return await $xt.getServer(
    `Anywhere/Center/BOQList?text=&field=type_name&pre_event=${pre_event}&jobcode=${jobcode}`
  );
};
export const getFormSignature = async () => {
  return await $xt.getServer(
    `Anywhere/Center/FormSignature?windowcode=OTH&module=OTH&amount_limit=`
  );
};
export const getFormApprove = async (formcode, dpt_no ,pre_event) => {
  console.log("obj","pre_event", pre_event, "dpt_no", dpt_no);
  return await $xt.getServer(
    `anywhere/center/FormApprove?formcode=${formcode}&pre_event=${pre_event}&dpt_no=${dpt_no}`
  );
};
export const retrieveFormApprove = async (docno) => {
  return await $xt.getServer(
    `Anywhere/Center/ApproveInformation?docno=${docno}&doctype=PR`
  );
};
export const getConfig = async (obj) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/config`);
};
export const getSyscode = async (obj) => {
  // console.log("obj", obj);
  return await $xt.getServer(`anywhere/center/syscode`);
};
//////////////////////// POST ///////////////////////////
export const postDeleteData = async (docno, desc) => {
  return await $xt.getServer(
    `Anywhere/OF/PC_Delete?docno=${docno}&desc=${desc}`
  );
};
export const postFormData = async (obj) => {
  // console.log("obj", obj);
  return await $xt.postServerJson(`Anywhere/OF/PC_CreateAndUpdate`, obj);
};
export const postCostCenter = async (cost) => {
  return await $xt.postServerJson(`Anywhere/Center/CalculateCostCenter`, cost);
};
//////////////////////// END POST ///////////////////////////
let getRandomString = (length) => {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
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
  console.log("form", form);
  return await $xt.postServerForm(`Anywhere/Center/FileUploadToTemp`, form);
};
export const readPicture = async (docno) => {
  return await $xt.getServer(
    `Anywhere/Center/AttachPictures?docno=${docno}&doctype=OTH&lineno=0`
  );
};
export const reFormatPicture = async (file_path) => {
  return (await $xt.getBaseUrl()) + `Api/File/DownLoad?id=${file_path}`;
};
export const postCancelSubmit = async (docno) => {
  // console.log("obj", obj);
  return await $xt.getServer(
    `anywhere/center/cancelsubmitapprove?module=OTH&docno=${docno}`
  );
};
