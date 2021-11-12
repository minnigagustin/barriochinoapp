import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootReducers from "./app/reducers";
import hsblogReducers from "./app/hsblog/store/rootReducers";
import rootSaga from "./app/hsblog/store/rootSagas";
// import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { syncTranslationWithStore, i18nReducer } from "react-redux-i18n";
import { translations } from "./app/hsblog/translations";
import { locale } from "./app/hsblog/utils/functions/getCurrentLocale";

const persistConfig = {
  timeout: 0,
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    // "translations",
    // "settings",
    "auth",
    // "countNotify",
    // "countNotifyRealTimeFaker",
    // "listings",
    // "events",
    // "stackNavigator",
    // "tabNavigator",
    // "deviceToken",
    // "shortProfile",
    // "homeScreen",
    // "listingDetail",
    // "listingListFeature",
    // "listingListFeatureAll",
    // "listingDescription",
    // "listingDescriptionAll",
    // "listingPhotos",
    // "listingPhotosAll",
    // "listingProducts",
    // "listingProductsAll",
    // "listingReviews",
    // "listingReviewsAll",
    // "listingVideos",
    // "listingVideosAll",
    // "listingEvents",
    // "listingEventsAll",
    // "listingRestaurantMenu",
    // "listingCustomBox",
    // "listingSidebar",
    // "listingAdvancedMultipleProducts",
    // "listingAdvancedSingleProduct",
  ],
};
const sagaMiddleware = createSagaMiddleware();

const _combinedReducers = combineReducers({
  ...rootReducers,
  ...hsblogReducers,
  i18n: i18nReducer,
});

const reducers = persistReducer(persistConfig, _combinedReducers);
const middlewares = [thunk, sagaMiddleware];
if (__DEV__) middlewares.push(logger);

const store = createStore(
  reducers,
  undefined,
  compose(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);

if (translations) {
  syncTranslationWithStore(store);
  store.dispatch({
    type: "@@i18n/LOAD_TRANSLATIONS",
    translations,
  });
  store.dispatch({
    type: "@@i18n/SET_LOCALE",
    locale: Object.keys(translations).includes(locale) ? locale : "en",
  });
}

export { store, persistor };
