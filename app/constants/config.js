import appJson from "../../app.json";
export const baseURL = "https://wilcity.com/wp-json/wiloke/v2";

export const LINKING_MY_APP = __DEV__
  ? "exp://localhost:19000"
  : appJson.expo.scheme;
