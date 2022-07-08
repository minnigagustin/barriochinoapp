import { handleAction } from '../handleAction';
import { handleActions } from '../handleActions';
import { createReducer } from '../createReducer';
import { getObjectFromHandleActions } from '../getObjectFromHandleActions';
const state = {};
const action1 = { type: 'ACTION_TYPE', payload: { name: 'name test', age: 1988 } };
const action2 = { type: 'ACTION_TYPE2', payload: { username: 'wiloke', avatar: 'wiloke.png' } };
describe('kiểm tra các hàm liên quan tới reducer', () => {
    test('kiểm tra hàm handleAction', () => {
        const received = {
            ACTION_TYPE: (state, action) => ({
                ...state,
                action1: action.payload,
            }),
        };
        const expected = handleAction('ACTION_TYPE', (state, action) => ({
            ...state,
            action1: action.payload,
        }));
        expect(received.ACTION_TYPE(state, action1)).toEqual(expected.ACTION_TYPE(state, action1));
    });
    test('kiểm tra hàm handleActions', () => {
        const received = {
            ACTION_TYPE: (state, action) => ({
                ...state,
                action1: action.payload,
            }),
            ACTION_TYPE2: (state, action) => ({
                ...state,
                action2: action.payload,
            }),
        };
        const expected = handleActions(['ACTION_TYPE', 'ACTION_TYPE2'], (state, action) => ({
            ...state,
            ...(action.type === 'ACTION_TYPE' ? { action1: action.payload } : { action2: action.payload }),
        }));
        expect(received.ACTION_TYPE(state, action1)).toEqual(expected['ACTION_TYPE,ACTION_TYPE2'](state, action1));
        expect(received.ACTION_TYPE2(state, action2)).toEqual(expected['ACTION_TYPE,ACTION_TYPE2'](state, action2));
    });
    test('kiểm tra hàm getObjectFromHandleActions', () => {
        const received = {
            ACTION_TYPE: (state, action) => ({
                ...state,
                action1: action.payload,
            }),
            ACTION_TYPE2: (state, action) => ({
                ...state,
                action2: action.payload,
            }),
        };
        const expected = getObjectFromHandleActions([
            handleAction('ACTION_TYPE', (state, action) => ({
                ...state,
                action1: action.payload,
            })),
            handleAction('ACTION_TYPE2', (state, action) => ({
                ...state,
                action2: action.payload,
            })),
        ]);
        expect(received?.ACTION_TYPE?.(state, action1)).toEqual(expected?.ACTION_TYPE?.(state, action1));
        expect(received?.ACTION_TYPE2?.(state, action2)).toEqual(expected?.ACTION_TYPE2?.(state, action2));
    });
    test('kiểm tra hàm createReducer với sử dụng object action', () => {
        const initialState = {};
        const received = (state = initialState, action) => {
            switch (action.type) {
                case 'ACTION_TYPE':
                    return {
                        ...state,
                        action1: action.payload,
                    };
                case 'ACTION_TYPE2':
                    return {
                        ...state,
                        action2: action.payload,
                    };
            }
        };
        const expected = createReducer(initialState, {
            ACTION_TYPE: (state, action) => ({
                ...state,
                action1: action.payload,
            }),
            ACTION_TYPE2: (state, action) => ({
                ...state,
                action2: action.payload,
            }),
        });
        expect(received(state, action1)).toEqual(expected(state, action1));
        expect(received(state, action2)).toEqual(expected(state, action2));
    });
    test('kiểm tra hàm createReducer sử dụng với handleAction và handleActions', () => {
        const initialState = {};
        const received = (state = initialState, action) => {
            switch (action.type) {
                case 'ACTION_TYPE':
                    return {
                        ...state,
                        action1: action.payload,
                    };
                case 'ACTION_TYPE2':
                    return {
                        ...state,
                        action2: action.payload,
                    };
            }
        };
        // sử dụng với handleAction
        const expected = createReducer(initialState, [
            handleAction('ACTION_TYPE', (state, action) => ({
                ...state,
                action1: action.payload,
            })),
            handleAction('ACTION_TYPE2', (state, action) => ({
                ...state,
                action2: action.payload,
            })),
        ]);
        // sử dụng với handleActions
        const expected2 = createReducer(initialState, [
            handleActions(['ACTION_TYPE', 'ACTION_TYPE2'], (state, action) => ({
                ...state,
                ...(action.type === 'ACTION_TYPE' ? { action1: action.payload } : { action2: action.payload }),
            })),
        ]);
        expect(received(state, action1)).toEqual(expected(state, action1));
        expect(received(state, action2)).toEqual(expected(state, action2));
        expect(received(state, action1)).toEqual(expected2(state, action1));
        expect(received(state, action2)).toEqual(expected2(state, action2));
    });
});
