import axios from 'axios';
const { CancelToken } = axios;
export default class ConfigureAxios {
    constructor({ configure, setAccessToken, setRefreshToken }) {
        this.create = (sagaCancel = '') => {
            return {
                request: (requestConfig) => {
                    const source = CancelToken.source();
                    const request = this.axiosInstance({ ...requestConfig, cancelToken: source.token });
                    if (!!sagaCancel) {
                        // @ts-ignore
                        request[sagaCancel] = source.cancel;
                    }
                    return request;
                },
            };
        };
        this.accessToken = ({ setCondition }) => {
            this.axiosInstance.interceptors.request.use(config => {
                if (!config?.url) {
                    return config;
                }
                const accessToken = this.setAccessToken();
                if (setCondition(config) && !config.headers.Authorization) {
                    if (!!accessToken) {
                        config.headers.Authorization = `Bearer ${accessToken}`;
                    }
                }
                return config;
            });
        };
        this.handleRefreshTokenAsync = async (config, error) => {
            const { url, axiosData, success, failure } = config;
            try {
                const refreshToken = this.setRefreshToken();
                const accessToken = this.setAccessToken();
                const res = await this.axiosInstance.post(url, axiosData(refreshToken, accessToken));
                success(res, error.config);
                return await this.axiosInstance.request(error.config);
            }
            catch (err) {
                failure(error);
                return await Promise.reject(error);
            }
            finally {
                this.refreshToken(config);
            }
        };
        this.refreshToken = (config) => {
            const interceptor = this.axiosInstance.interceptors.response.use(undefined, (error) => {
                if (!config.setRefreshCondition(error)) {
                    return Promise.reject(error);
                }
                console.log('refreshToken', error.response);
                this.axiosInstance.interceptors.response.eject(interceptor);
                return this.handleRefreshTokenAsync(config, error);
            });
        };
        this.setAccessToken = setAccessToken;
        this.setRefreshToken = setRefreshToken;
        this.axiosInstance = axios.create(configure);
    }
}
