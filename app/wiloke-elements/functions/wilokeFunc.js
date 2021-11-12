import { I18nManager } from "react-native";

export const isEmpty = (prop) =>
  prop === null ||
  prop === undefined ||
  (prop.hasOwnProperty("length") && prop.length === 0) ||
  (prop.constructor === Object && Object.keys(prop).length === 0);

export const filterMax = (arr) => (max) => {
  if (arr === "__empty__") return [];
  return arr.filter((item, index) => index < max);
};

export const zeroPad = (number) =>
  number < 10 && number > 0 ? `0${number}` : number;

export const wait = (ms) =>
  new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      clearTimeout(timeout);
    }, ms);
    return timeout;
  });

export const toDataURL = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
};

export const axiosHandleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      Error: [
        error.response.data,
        error.response.status,
        error.response.headers,
        error.config,
      ],
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return { Error: [error.request, error.config] };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { Error: [error.message, error.config] };
  }
};
export const axiosHandleErrorString = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else if (error.request) {
    return JSON.stringify(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

export const cutTextEllipsis = (max) => (str) =>
  str.length > max ? `${str.substr(0, max)}...` : str;
export const removeInlineStyle = (content) => {
  const regex = /style="[^\"]*"/gim;
  return content.replace(regex, ``);
};
export const RTL = () => I18nManager.isRTL;

export function Uppercasewords(str) {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}
export const getTotalQuantity = (data) => {
  return data.reduce((total, item) => {
    return (total += item.quantity);
  }, 0);
};

export function getIDListing(myID) {
  return myID.split("_")[0];
}
