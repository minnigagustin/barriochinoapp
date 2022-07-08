import React, { useEffect, useState } from "react";
import {
  YellowBox,
  View,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "Remote debugger is in a background tab which",
  "Debugger and device times have drifted",
  "Warning: isMounted(...) is deprecated",
  "Setting a timer",
  "<InputAccessoryView> is not supported on Android yet.",
  "Class EX",
  "Require cycle:",
]);
console.disableYellowBox = true;

import { AppLoading } from "expo";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./configureStore";
import configureApp from "./configureApp.json";
import RootStack from "./app/routes";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { updateFocus } from "./app/wiloke-elements";
import Constants from "expo-constants";
import { Asset } from "expo-asset";
import { screenHeight } from "./app/constants/styleConstants";
import ModalUpdateApp from "./app/hsblog/components/ModalAppUpdate/ModalAppUpdate";
import StoreReview from "./app/hsblog/components/StoreReview/StoreReview";

const SCREEN_HEIGHT = Dimensions.get("screen").height;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const navbarHeight = SCREEN_HEIGHT - WINDOW_HEIGHT;

axios.defaults.baseURL = `${configureApp.api.baseUrl.replace(
  /\/$/g,
  ""
)}/wp-json/wiloke/v3`;

axios.defaults.timeout = configureApp.api.timeout;
// axios.defaults.headers["Cache-Control"] = "no-cache";

const deviceHeight = Dimensions.get("screen").height;
const navigationBarHeight =
  deviceHeight - screenHeight - Constants.statusBarHeight;

const AndroidHeight =
  navigationBarHeight > 20
    ? deviceHeight - Constants.statusBarHeight
    : screenHeight - Constants.statusBarHeight;
const android = Platform.OS === "android";

const OpenApp = () => {
  const settings = useSelector((state) => state.settings);
  const translations = useSelector((state) => state.translations);
  return (
    <>
      {!!settings.appUpdateAnnouncement && (
        <ModalUpdateApp
          text={settings.appUpdateAnnouncement.desc}
          buttonUpdateText={translations.updateNow}
          moreText={settings.appUpdateAnnouncement.readmore}
          iosStore={settings.appUpdateAnnouncement?.appStoreUrl}
          androidStore={settings.appUpdateAnnouncement?.chplayUrl}
          nextVersion={settings.appUpdateAnnouncement?.version}
        />
      )}
      {!!settings.appUpdateAnnouncement && (
        <StoreReview
          iosStore={settings.appUpdateAnnouncement?.appStoreUrl}
          androidStore={settings.appUpdateAnnouncement?.chplayUrl}
        />
      )}
    </>
  );
};

const App = () => {
  const [minHeight, setMinHeight] = useState(0);
  const _cacheResourcesAsync = async () => {
    const images = [
      require("./assets/loginCover.png"),
      require("./assets/logo.png"),
    ];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  useEffect(() => {
    _cacheResourcesAsync();
  }, []);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              ...(!!minHeight ? { minHeight } : {}),
            }}
            onLayout={({ nativeEvent }) => {
              const timeId = setTimeout(() => {
                const windowHeight = nativeEvent.layout.height;
                setMinHeight(windowHeight);
                clearTimeout(timeId);
              }, 1000);
            }}
          >
            <RootStack />
            <OpenApp />
          </View>
        </SafeAreaProvider>
      </Provider>
    </PersistGate>
  );
};
export default App;

// if (__DEV__) {
//   // @ts-ignore
//   global.XMLHttpRequest = global.originalXMLHttpRequest ? global.originalXMLHttpRequest : global.XMLHttpRequest;
//   // @ts-ignore
//   global.FormData = global.originalFormData ? global.originalFormData : global.FormData;

//   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//   fetch; // Ensure to get the lazy property

//   // @ts-ignore
//   if (window.__FETCH_SUPPORT__) {
//     // it's RNDebugger only to have
//     // @ts-ignore
//     window.__FETCH_SUPPORT__.blob = false;
//   } else {
//     /*
//      * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
//      * If you're using another way you can just use the native Blob and remove the `else` statement
//      */
//     // @ts-ignore
//     global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
//     // @ts-ignore
//     global.FileReader = global.originalFileReader ? global.originalFileReader : global.FileReader;
//   }
// }
