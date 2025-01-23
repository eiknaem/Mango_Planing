import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export const webviewURL = 'https://control.mangoanywhere.com';
// export const webviewURL = "http://203.154.41.4";
export const mangoURL = "https://gateway.mangoanywhere.com/mobile_ip/Home/GetAuthorized2";
export const getCustomerURL = () => AsyncStorage.getItem("baseUrl");

export const getToken = () => AsyncStorage.getItem("mango_auth");
export const getHeader = async () => ({
  "X-Mango-Auth": await getToken(),
  "X-API-Auth": "Y",
});

export const uploadFileApi = async (uri, blob) => {
  const headers = await getHeader();
  headers["Content-Type"] = "multipart/form-data";

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: blob._data.name,
    type: blob._data.type,
  });
  return axios
    .post(`${await getCustomerURL()}ext_api/Master/FileUpload`, formData, { headers })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
export const getLocation = async (lat, lng) => {
  const headers = await getHeader();

  return axios
    .get(`${webviewURL}/mango_geo/data/fetch`, {
      headers,
      params: {
        lat,
        lng,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
