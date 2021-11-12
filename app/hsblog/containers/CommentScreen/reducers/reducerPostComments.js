import { createReducer, handleAction } from "../../../utils/functions/reduxActions";
import { getUniqueSet } from "../../../utils/functions/unique";
const initialState = {
    data: [],
    status: 'loading',
    message: '',
    pageNext: 1,
    loadmoreStatus: 'loading',
    statusDelete: 'loading',
    messageDelete: '',
    statusAdd: 'loading',
    statusEdit: 'loading',
    messageEdit: '',
    messageAdd: '',
};
// const newCommentState: PostNewCommentState = {
//   status: 'loading',
//   data: {},
// };
export const postComments = createReducer(initialState, [
    handleAction('@getPostCommentsRequest', (state, action) => {
        return {
            ...state,
            status: action.payload.params.page === 1 ? 'loading' : 'success',
            pageNext: action.payload.params.page === 1 ? 1 : state.pageNext,
            loadmoreStatus: action.payload.params.page === 1 ? 'success' : 'loading',
        };
    }),
    handleAction('@getPostCommentsSuccess', (state, action) => {
        return {
            ...state,
            data: !!state.pageNext && state.pageNext > 1 ? getUniqueSet([...state.data, ...action.payload.data], 'id') : action.payload.data,
            status: 'success',
            pageNext: !!action.payload?.pagination?.next ? action.payload.pagination.next?.params.page : 1,
            loadmoreStatus: 'success',
        };
    }),
    handleAction('@getPostCommentsFailure', (state, action) => {
        return {
            ...state,
            status: state.pageNext === 1 ? 'failure' : 'success',
            message: action.payload,
            loadmoreStatus: 'failure',
        };
    }),
    handleAction('@getChildComment', (state, action) => {
        return {
            ...state,
            data: state.data.map(item => ({
                ...item,
                childComments: item.id === action.payload.data.parentID ? action.payload.data.childComments : item.childComments,
                childCommentTotal: item.id === action.payload.data.parentID ? action.payload.data.childCommentTotal : item.childCommentTotal,
            })),
        };
    }),
    handleAction('@deleteCommentRequest', (state, _action) => {
        return {
            ...state,
            statusDelete: 'loading',
        };
    }),
    handleAction('@deleteCommentSuccess', (state, action) => {
        const childCommentDelete = state.data.map(item => item.childComments.find(i => i.id === action.payload.id)).filter(item => item).length;
        return {
            ...state,
            statusDelete: 'success',
            data: childCommentDelete === 0
                ? state.data.filter(i => i.id !== action.payload.id)
                : state.data.map(item => ({
                    ...item,
                    childComments: item.childComments.filter(child => child.id !== action.payload.id),
                })),
            messageDelete: action.payload.msg,
        };
    }),
    handleAction('@deleteCommentFailure', (state, action) => ({
        ...state,
        statusDelete: 'failure',
        messageDelete: action.payload,
    })),
    handleAction('@postNewCommentRequest', (state, _action) => ({
        ...state,
        statusAdd: 'loading',
    })),
    handleAction('@postNewCommentSuccess', (state, action) => {
        return {
            ...state,
            statusAdd: 'success',
            data: [action.payload.data.comment, ...state.data],
        };
    }),
    handleAction('@postNewCommentFailure', (state, action) => ({
        ...state,
        statusAdd: 'failure',
        messageAdd: action.payload,
    })),
    handleAction('@postNewCommentOffline', (state, action) => {
        return {
            ...state,
            data: getUniqueSet([action.payload.comment, ...state.data], 'id'),
        };
    }),
    handleAction('@deleteCommentOffline', (state, action) => {
        return {
            ...state,
            data: state.data.filter(i => i.id !== action.payload.id),
        };
    }),
    handleAction('@editCommentRequest', (state, _action) => ({
        ...state,
        statusEdit: 'loading',
        messageEdit: '',
    })),
    handleAction('@editCommentSuccess', (state, action) => {
        const childCommentEdit = state.data.map(item => item.childComments.find(i => i.id === action.payload.data.id)).filter(item => item).length;
        const newDescription = action.payload.data.comment?.description;
        return {
            ...state,
            statusEdit: 'success',
            messageEdit: 'Updated sucess',
            data: state.data.map(item => ({
                ...item,
                description: childCommentEdit === 0 && item.id === action.payload.data.id ? newDescription : item.description,
                childComments: item.childComments.map(child => {
                    return {
                        ...child,
                        description: child.id === action.payload.data.id ? newDescription : child.description,
                    };
                }),
            })),
        };
    }),
    handleAction('@editCommentFailure', (state, action) => {
        return { ...state, statusEdit: 'failure', messageEdit: action.payload };
    }),
]);
