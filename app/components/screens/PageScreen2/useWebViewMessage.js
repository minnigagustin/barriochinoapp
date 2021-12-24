import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useWebViewMessage = (navigation) => {
  const [title, setTitle] = useState("");
  const auth = useSelector((state) => state.auth);

  const handleMessage = async (event) => {
    const { payload, type } = JSON.parse(event.nativeEvent.data);
    switch (type) {
      case "mounted": {
        setTitle(payload.title);
        break;
      }
      case "browser": {
        WebBrowser.openBrowserAsync(payload.uri);
        break;
      }
      case "navigate": {
        navigation.push("PageScreen2", {
          uri: `${payload.uri}${
            payload.uri.includes("?") ? "&" : "?"
          }iswebview=yes&token=${auth.token}`,
        });
        break;
      }
      case "addlisting": {
        await AsyncStorage.setItem("hasDetailPreview", payload.postType);
        navigation.navigate("AccountScreen");
        break;
      }
      case "login": {
        navigation.navigate("MenuHomeScreen");
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 0);
        break;
      }
      default:
        break;
    }
  };
  return {
    title,
    onMessage: handleMessage,
  };
};

export default useWebViewMessage;
