import axios from "axios";
import $xt from "./xtools";

export const getTax = async () => {
    return await $xt.getServer(`Anywhere/Center/Tax`);
  };
  export const calculateCostCenter = async (cost) => {
    return await $xt.postServerJson(`Anywhere/Center/CalculateCostCenter`, cost);
  };