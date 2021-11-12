import { createReducer, handleAction, handleActions } from "../../../utils/functions/reduxActions";
import getPostDetailMax50 from "../../../utils/functions/getPostDetailMax50";
const initialState = {};
export const postDetails = createReducer(initialState, [
    handleAction('@getPostDetailRequest', (state, action) => ({
        ...state,
        [action.payload]: {
            ...state[action.payload],
            status: 'loading',
        },
    })),
    handleAction('@getPostDetailSuccess', (state, action) => {
        return getPostDetailMax50({
            ...state,
            [action.payload.endpoint]: {
                status: 'success',
                data: action.payload.data.data,
                message: '',
            },
        });
    }),
    handleAction('@getPostDetailFailure', (state, action) => ({
        ...state,
        [action.payload.endpoint]: {
            status: 'failure',
            data: state[action.payload.endpoint].data,
            message: action.payload.message,
        },
    })),
    handleAction('@postFavoriteRequest', (state, action) => ({
        ...state,
        [action.payload.postEndpoint]: {
            ...state[action.payload.postEndpoint],
            isFavoriteLoading: true,
        },
    })),
    handleActions(['@postFavoriteSuccess', '@getFavoriteSuccess'], (state, action) => ({
        ...state,
        [action.payload.postEndpoint]: {
            ...state[action.payload.postEndpoint],
            isFavoriteLoading: false,
            data: {
                ...state[action.payload.postEndpoint].data,
                isMyFavorite: action.payload.isAdded,
                favoriteCount: action.type === '@postFavoriteSuccess'
                    ? action.payload.isAdded
                        ? (state[action.payload.postEndpoint].data.favoriteCount ?? 0) + 1
                        : (state[action.payload.postEndpoint].data.favoriteCount ?? 0) - 1
                    : state[action.payload.postEndpoint].data.favoriteCount,
            },
        },
    })),
    handleAction('@postFavoriteFailure', (state, action) => ({
        ...state,
        [action.payload.postEndpoint]: {
            ...state[action.payload.postEndpoint],
            isFavoriteLoading: false,
        },
    })),
    handleAction('@postViewSuccess', (state, action) => ({
        ...state,
        [action.payload.postEndpoint]: {
            ...state[action.payload.postEndpoint],
            data: {
                ...state[action.payload.postEndpoint].data,
                viewCount: (state[action.payload.postEndpoint].data.viewCount ?? 0) + 1,
            },
        },
    })),
]);
