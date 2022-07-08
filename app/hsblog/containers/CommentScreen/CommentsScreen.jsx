import React, { useState, useRef } from 'react';
import { useMount, View, Container, useTheme } from "../../shared";
import { isEmpty } from 'ramda';
import { FlatList, ActivityIndicator, Clipboard } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import CommentCard from "../../components/CommentCard/CommentCard";
import AsyncComponent from "../../components/AsyncComponent/AsyncComponent";
import Retry from "../../components/Retry/Retry";
import i18n from "../../utils/functions/i18n";
import { useSelector } from 'react-redux';
import { userIdSelector, isLoggedInSelector } from 'containers/Auth/selectors';
import { NavigationSuspense } from "../../navigation";
import Empty from "../../components/Empty/Empty";
import KeyboardSpacer from "../../components/KeyboardSpacer/KeyboardSpacer";
import { getTagHighlightValuesFromDraftJs } from "../../utils/functions/supportDraftJs";
import isIOS, { isIpad, isSmallDevice } from "../../shared/utils/isIOS";
import { onOpenModalLogin } from 'components/ModalLogin/ModalLogin';
import timeAgo from "../../utils/functions/timeAgo";
import ScreenContainer from "../../components/ScreenContainer/ScreenContainer";
import { updateLayouAnimation, notifyDelete, options2, options, alertAuthentication, setUIManager, retryOptions } from './notify';
import HeaderComment from './HeaderComment';
import FooterListComment from './FooterListComment';
import ReplyChildren from './ReplyChildren';
import { commentSelector, usersCommentSelector } from './selector';
import { useGetPostComment, useDeleteComment, useAddNewComment, useDeleteOffline, useEditComment } from './actions/actionComments';
import KeyBoardComments from './KeyBoardComments';
const CommentScreen = ({ navigation }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const getComments = useGetPostComment();
    const deleteComment = useDeleteComment();
    const addNewComment = useAddNewComment();
    const editComment = useEditComment();
    const deleteCommentOffline = useDeleteOffline();
    const comments = useSelector(commentSelector);
    const usersTag = useSelector(usersCommentSelector);
    const isLoggedIn = useSelector(isLoggedInSelector);
    const userID = useSelector(userIdSelector);
    const listRef = useRef(null);
    const [isEdit, setEdit] = useState(false);
    const [commentEdit, setCommentEdit] = useState({});
    const postID = navigation.state?.params?.id;
    const titlePost = navigation.state?.params?.title;
    const editRef = useRef(() => { });
    const { colors } = useTheme();
    const _getComments = () => {
        if (!!postID) {
            getComments({
                endpoint: 'comments',
                params: {
                    page: 1,
                    postID,
                },
            });
        }
    };
    const _tryAgain = () => {
        _getComments();
    };
    useMount(() => {
        setUIManager();
        _getComments();
    });
    const _handleCancel = () => {
        setEdit(false);
        setCommentEdit({});
        editRef.current({ values: '', entityMap: [] });
    };
    const onEdit = (cb) => {
        editRef.current = cb;
    };
    const copyComment = async (item) => {
        if (typeof item.description === 'string')
            return item.description;
        const text = item.description.blocks.map(i => i.text).join('');
        Clipboard.setString(text);
    };
    const _handleEdit = (item) => {
        const description = item.description;
        const text = description.blocks.map(i => i.text).join('\n');
        const entityMap = getTagHighlightValuesFromDraftJs(description);
        setCommentEdit(item);
        setEdit(true);
        editRef.current({ values: text, entityMap });
    };
    const updateCommentsLayout = () => {
        updateLayouAnimation();
        if (comments.data.length === 0)
            return;
        listRef.current?.scrollToIndex({ index: 0, animated: true });
    };
    const _handleNewComment = (draftResult) => {
        editRef.current({ values: '', entityMap: [] });
        if (!isEdit) {
            if (!!postID) {
                addNewComment({
                    endpoint: 'comments',
                    body: {
                        postID,
                        comment: draftResult,
                    },
                    cb: updateCommentsLayout,
                });
            }
        }
        else {
            setEdit(false);
            if (!!commentEdit?.id) {
                editComment({
                    endpoint: `comments/${commentEdit?.id}`,
                    body: {
                        comment: draftResult,
                    },
                    id: commentEdit?.id,
                });
            }
        }
    };
    const deleteCommentError = (item) => {
        deleteCommentOffline(item.id);
        updateCommentsLayout();
    };
    const _handleRetry = (item) => () => {
        showActionSheetWithOptions({
            options: retryOptions,
            cancelButtonIndex: retryOptions.length - 1,
            destructiveButtonIndex: 1,
        }, buttonIndex => {
            switch (retryOptions[buttonIndex]) {
                case i18n.t('tryAgain'): {
                    if (!!postID) {
                        return addNewComment({
                            endpoint: 'comments',
                            body: {
                                postID,
                                comment: item.description,
                                id: item.id,
                            },
                            cb: updateCommentsLayout,
                        });
                    }
                    return null;
                }
                case i18n.t('delete'):
                    return deleteCommentError(item);
                default:
                    return null;
            }
        });
    };
    const deleteCommentOption = (commentID) => {
        notifyDelete(() => deleteComment({ endpoint: `comments/${commentID}`, cb: updateLayouAnimation }));
    };
    const _handleReached = () => {
        const lengthComment = comments.data.length;
        if (!!comments.pageNext && !!postID) {
            getComments({
                endpoint: 'comments',
                params: {
                    page: comments.pageNext,
                    postID,
                    lastCommentID: comments.data[lengthComment - 1].id,
                },
            });
        }
    };
    const openActionSheet = (item) => () => {
        if (!isLoggedIn) {
            alertAuthentication(onOpenModalLogin);
            return;
        }
        const newOptions = item?.author?.id === userID ? options2 : options;
        showActionSheetWithOptions({
            options: newOptions,
            cancelButtonIndex: newOptions.length - 1,
            destructiveButtonIndex: 3,
        }, buttonIndex => {
            switch (newOptions[buttonIndex]) {
                case 'Delete':
                    return deleteCommentOption(item.id);
                case 'Copy':
                    return copyComment(item);
                case 'Reply':
                    return navigation.navigate('ReplyScreen', { item, postID, isFocus: true });
                case 'Edit':
                    return _handleEdit(item);
                default:
                    return null;
            }
        });
    };
    const _renderReply = (item) => () => {
        return <ReplyChildren parentComment={item} onCancel={_handleCancel} postID={postID} isEdit={isEdit} commentEditID={commentEdit?.id}/>;
    };
    const _renderFooter = () => {
        if (!!comments.pageNext && comments.pageNext > 1) {
            return <FooterListComment onReached={_handleReached} text={i18n.t('loadmoreComment')} isLoading={comments?.loadmoreStatus === 'loading'}/>;
        }
        return null;
    };
    const renderCommentItem = ({ item }) => {
        return (<Container>
        <CommentCard title={item.title} author={item.author} description={item.description} createAt={timeAgo(item.timestamp, item.date)} onLongPress={openActionSheet(item)} renderReply={_renderReply(item)} loading={!!item.approved ? item.approved : 'success'} onRetry={_handleRetry(item)} onReply={() => navigation.navigate('ReplyScreen', { item, postID, isFocus: true })} isEdit={isEdit && commentEdit?.id === item.id} onCancel={_handleCancel}/>
      </Container>);
    };
    const renderBody = () => {
        return (<AsyncComponent status={comments?.status} Request={<View flex justifyContent="center" alignItems="center">
            <ActivityIndicator size="small" color={colors.secondary}/>
          </View>} Failure={<Retry text={i18n.t('retry')} tachyons={['pv4', 'mt3']} onPress={_tryAgain}/>} Success={<NavigationSuspense>
            <FlatList data={comments?.data} ref={listRef} renderItem={renderCommentItem} keyExtractor={(item, _index) => item.id.toString()} extraData={comments?.statusDelete} inverted={!isEmpty(comments?.data)} style={{ paddingHorizontal: 10 }} ListFooterComponent={_renderFooter} initialScrollIndex={0} renderToHardwareTextureAndroid={true} showsVerticalScrollIndicator={false} ListEmptyComponent={() => <Empty />} keyboardShouldPersistTaps={isEdit ? 'handled' : 'never'} keyboardDismissMode="on-drag"/>
          </NavigationSuspense>}/>);
    };
    const Body = (<View flex renderToHardwareTextureAndroid={true}>
      {renderBody()}
      <Container>
        <KeyBoardComments usersTag={usersTag} onComment={_handleNewComment} onEdit={onEdit}/>
      </Container>
    </View>);
    return (<ScreenContainer Header={<HeaderComment title={i18n.t('comments')} subTitle={titlePost}/>} safeAreaView safeAreaViewBottom>
      {Body}
      {isIOS && <KeyboardSpacer topSpacing={isIpad || isSmallDevice ? 0 : -30}/>}
    </ScreenContainer>);
};
export default CommentScreen;
