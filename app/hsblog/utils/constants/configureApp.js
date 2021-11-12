import configureAppJson from '../../configureApp.json';
import configureAppJsonWilcity from '../../../../configureApp.json';
// @ts-ignore
const configureApp = {
    ...configureAppJson,
    api: {
        baseUrl: `${configureAppJsonWilcity.apiHighSpeedBlog?.baseUrl}/wp-json/hsblog/v1`,
        timeout: configureAppJsonWilcity.apiHighSpeedBlog?.timeout,
    },
};
export default configureApp;
