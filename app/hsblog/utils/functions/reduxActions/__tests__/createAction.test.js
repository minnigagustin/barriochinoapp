import { createAction } from '../createAction';
describe('kiểm tra createAction trả về kết quả tương đương với action mặc định', () => {
    test('trường hợp chỉ có type', () => {
        const actionType = '@getArticles';
        const received = () => ({
            type: actionType,
        });
        const expected = createAction(actionType);
        expect(received()).toEqual(expected());
    });
    test('trường hợp có callback', () => {
        const actionType = '@search';
        const endpoint = 'search';
        const params = {
            q: 'test',
        };
        const received = (endpoint, params) => ({
            type: actionType,
            payload: {
                endpoint,
                params,
            },
        });
        const expected = createAction(actionType, (endpoint, params) => ({
            endpoint,
            params,
        }));
        expect(received(endpoint, params)).toEqual(expected(endpoint, params));
    });
});
