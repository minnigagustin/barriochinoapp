import { createAsyncAction } from '../createAsyncAction';
describe('kiểm tra createAsyncAction', () => {
    test('trường hợp đầu vào là value', () => {
        const actionTypeRequest = '@getCommentsRequest';
        const actionTypeSuccess = '@getCommentsSuccess';
        const actionTypeFailure = '@getCommentsFailure';
        const data = {
            name: 'Wiloke',
            email: 'wiloke@gmail.com',
        };
        const endpoint = 'comments';
        const message = 'Error';
        const received = {
            request: (endpoint) => ({
                type: actionTypeRequest,
                payload: endpoint,
            }),
            success: (data) => ({
                type: actionTypeSuccess,
                payload: data,
            }),
            failure: (message) => ({
                type: actionTypeFailure,
                payload: message,
            }),
        };
        const expected = createAsyncAction([actionTypeRequest, actionTypeSuccess, actionTypeFailure])();
        expect(received.request(endpoint)).toEqual(expected.request(endpoint));
        expect(received.success(data)).toEqual(expected.success(data));
        expect(received.failure(message)).toEqual(expected.failure(message));
    });
    test('trường hợp đầu vào là object', () => {
        const actionTypeRequest = '@getCommentsRequest';
        const actionTypeSuccess = '@getCommentsSuccess';
        const actionTypeFailure = '@getCommentsFailure';
        const data = {
            name: 'Wiloke',
            email: 'wiloke@gmail.com',
        };
        const endpoint = 'comments';
        const message = 'Error';
        const received = {
            request: ({ endpoint }) => ({
                type: actionTypeRequest,
                payload: {
                    endpoint,
                },
            }),
            success: ({ endpoint, data }) => ({
                type: actionTypeSuccess,
                payload: {
                    endpoint,
                    data,
                },
            }),
            failure: ({ endpoint, message }) => ({
                type: actionTypeFailure,
                payload: {
                    endpoint,
                    message,
                },
            }),
        };
        const expected = createAsyncAction([actionTypeRequest, actionTypeSuccess, actionTypeFailure])();
        expect(received.request({ endpoint })).toEqual(expected.request({ endpoint }));
        expect(received.success({ endpoint, data })).toEqual(expected.success({ endpoint, data }));
        expect(received.failure({ endpoint, message })).toEqual(expected.failure({ endpoint, message }));
    });
});
