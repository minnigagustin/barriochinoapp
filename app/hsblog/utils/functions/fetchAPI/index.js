import qs from 'qs';
import { CANCEL } from 'redux-saga';
import configureApp from "../../constants/configureApp";
// import { store } from 'store/configureStore';
// import i18n from '../i18n';
import ConfigureAxios from './ConfigureAxios';
const axiosConfig = new ConfigureAxios({
    configure: {
        method: 'GET',
        baseURL: configureApp.api.baseUrl,
        timeout: configureApp.api.timeout,
        paramsSerializer: qs.stringify,
    },
    setAccessToken() {
        return '';
    },
    setRefreshToken() {
        return '';
    },
});
const fetchAPI = axiosConfig.create(CANCEL);
axiosConfig.accessToken({
    setCondition(config) {
        const isAppURL = config?.url?.search(/^http/g) === -1;
        return isAppURL;
    },
});
axiosConfig.refreshToken({
    url: 'jwt/renew-access-token',
    setRefreshCondition(error) {
        return error.response?.status === 401 && !error.config.url?.includes('jwt/renew-access-token');
    },
    axiosData(refreshToken, accessToken) {
        return {
            refreshToken,
            accessToken,
        };
    },
    success(res, originalRequest) {
        // store.dispatch(
        //   updateToken({
        //     accessToken: res.data.data.accessToken,
        //   }),
        // );
        originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
    },
    failure(error) {
        console.log(error.response);
        // store.dispatch(logout());
    },
});
export default fetchAPI;
