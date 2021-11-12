import React, { useState, useRef } from 'react';
import { Clipboard, FlatList as RNFlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { View, Container, useMount, useTheme } from "../../shared";
import AsyncComponent from "../../components/AsyncComponent/AsyncComponent";
import i18n from "../../utils/functions/i18n";
import Retry from "../../components/Retry/Retry";
import CommentCard from "../../components/CommentCard/CommentCard";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { userIdSelector, isLoggedInSelector } from 'containers/Auth/selectors';
import { getTagHighlightValuesFromDraftJs } from "../../utils/functions/supportDraftJs";
import { isEmpty } from 'ramda';
import isIOS, { isIpad, isSmallDevice } from "../../shared/utils/isIOS";
import KeyboardSpacer from "../../components/KeyboardSpacer/KeyboardSpacer";
import { onOpenModalLogin } from 'components/ModalLogin/ModalLogin';
import timeAgo from "../../utils/functions/timeAgo";
import ScreenContainer from "../../components/ScreenContainer/ScreenContainer";
import HeaderComment from './HeaderComment';
import FooterListComment from './FooterListComment';
import ParentComment from './ParentComment';
import { notify, updateLayouAnimation, notifyDelete, options, options2, alertAuthentication, setUIManager, retryOptions } from './notify';
import KeyBoardComments from './KeyBoardComments';
import { useGetReply, useAddNewReply, useDeleteReplyOffline, useDeleteReply, useEditReply } from './actions/actionReplyComents';
import { replySelector, userReplySelector } from './selector';
const ReplyScreen = ({ navigation }) => {
    const comment = navigation.state.params.item;
    const postID = navigation.state.params?.postID;
    const replyItemChild = navigation.state.params?.reply;
    const isFocus = !!navigation.state.params?.isFocus ? true : false;
    const replyComments = useSelector(replySelector);
    const isLoggedIn = useSelector(isLoggedInSelector);
    const userID = useSelector(userIdSelector);
    const usersTag = useSelector(userReplySelector);
    const getReply = useGetReply();
    const addNewReply = useAddNewReply();
    const deleteReply = useDeleteReply();
    const editReply = useEditReply();
    const { showActionSheetWithOptions } = useActionSheet();
    const deleteReplyOffline = useDeleteReplyOffline();
    const [isEdit, setEdit] = useState(false);
    const [replyEdit, setReplyEdit] = useState({});
    const editRef = useRef(() => { });
    const { colors } = useTheme();
    const _getReply = () => {
        getReply({
            endpoint: `comments/${comment?.id}`,
            parentID: comment?.id,
            params: {
                page: 1,
            },
        });
    };
    const _tryAgain = () => {
        _getReply();
    };
    const _handleReply = (item) => {
        const entityMap = [{ range: { offset: 0, length: item.author.displayName.length, key: Date.now() }, mentions: item.author }];
        editRef.current({ values: item.author.displayName, entityMap });
    };
    useMount(() => {
        setUIManager();
        _getReply();
        if (!isEmpty(replyItemChild) && !!replyItemChild) {
            if (!isFocus) {
                _handleReply(replyItemChild);
                return;
            }
        }
        if (!!isFocus) {
            _handleReply(comment);
        }
    });
    const setDefault = () => {
        editRef.current({ values: '', entityMap: [] });
    };
    const _handleReached = () => {
        const lengthReply = replyComments.data.length;
        getReply({
            endpoint: `comments/${comment?.id}`,
            params: {
                page: replyComments.pageNext,
                lastCommentID: replyComments.data[lengthReply - 1].id,
            },
        });
    };
    const onEdit = (cb) => {
        editRef.current = cb;
    };
    const deleteReplyError = (item) => {
        deleteReplyOffline(item.id);
    };
    const copyReply = async (item) => {
        if (typeof item.description === 'string')
            return item.description;
        const text = item.description.blocks.map(i => i.text).join('');
        Clipboard.setString(text);
    };
    const _handleNewReply = (draftResult) => {
        setDefault();
        if (!isEdit) {
            !!postID &&
                !isEmpty(comment) &&
                addNewReply({
                    endpoint: `comments`,
                    body: {
                        parentID: comment?.id ?? 0,
                        comment: draftResult,
                    },
                    params: {
                        postID: postID,
                    },
                });
        }
        else {
            setEdit(false);
            editReply({
                endpoint: `comments/${replyEdit.id}`,
                id: replyEdit?.id ?? 0,
                body: {
                    comment: draftResult,
                },
                parentID: comment?.id ?? 0,
            });
        }
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
                        return addNewReply({
                            endpoint: `comments`,
                            body: {
                                parentID: comment?.id ?? 0,
                                comment: item.description,
                                id: item.id,
                            },
                            params: {
                                postID: postID,
                            },
                        });
                    }
                    return null;
                }
                case i18n.t('delete'):
                    return deleteReplyError(item);
                default:
                    return null;
            }
        });
    };
    const NotifyDelete = ({ status, message }) => {
        updateLayouAnimation();
        notify({ status, message, nameIcon: 'x' });
    };
    const deleteReplyOption = (commentID) => {
        notifyDelete(() => deleteReply({ endpoint: `comments/${commentID}`, cb: NotifyDelete, parentID: comment.id }));
    };
    const _handleEdit = (reply) => {
        const description = reply.description;
        const text = description.blocks.map(i => i.text).join('\n');
        const entityMap = getTagHighlightValuesFromDraftJs(description);
        setReplyEdit(reply);
        setEdit(true);
        editRef.current({ values: text, entityMap });
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
                case i18n.t('delete'):
                    return deleteReplyOption(item.id);
                case i18n.t('copy'):
                    return copyReply(item);
                case i18n.t('edit'):
                    return _handleEdit(item);
                case i18n.t('reply'):
                    return _handleReply(item);
                default:
                    return null;
            }
        });
    };
    const renderFooter = () => {
        if (!!replyComments?.pageNext && replyComments?.pageNext > 1) {
            return (<FooterListComment onReached={_handleReached} text={i18n.t('loadmoreComment')} isLoading={replyComments?.loadmoreStatus === 'loading'}/>);
        }
        return null;
    };
    const _renderItemReply = ({ item }) => {
        return (<CommentCard title={item.title} author={item.author} description={item.description} createAt={timeAgo(item.timestamp, item.date)} onLongPress={openActionSheet(item)} isReply loading={!!item.approved ? item.approved : 'success'} onRetry={_handleRetry(item)} isEdit={isEdit && replyEdit?.id === item.id} onReply={() => _handleReply(item)} onCancel={() => {
            setEdit(false);
            setDefault();
        }}/>);
    };
    const _renderReply = () => {
        return (<RNFlatList data={replyComments?.data} keyExtractor={(item, _index) => item.id.toString()} renderItem={_renderItemReply} ListFooterComponent={renderFooter} inverted showsVerticalScrollIndicator={true}/>);
    };
    return (<ScreenContainer Header={<HeaderComment title={i18n.t('replyCommentOf', { name: comment?.author.displayName || comment?.author.email })}/>} safeAreaView safeAreaViewBottom>
      <View flex renderToHardwareTextureAndroid={true}>
        <AsyncComponent status={replyComments?.status} Request={<View flex justifyContent="center" alignItems="center" safeAreaView>
              <ActivityIndicator size="small" color={colors.secondary}/>
            </View>} Success={<ParentComment comment={comment} isEdit={isEdit} onReply={_handleReply} renderReply={_renderReply}/>} Failure={<Retry text={i18n.t('retry')} tachyons={['pv4', 'mt3']} onPress={_tryAgain}/>}/>
        <Container>
          <KeyBoardComments usersTag={usersTag} onComment={_handleNewReply} onEdit={onEdit}/>
        </Container>
        {isIOS && <KeyboardSpacer topSpacing={isIpad || isSmallDevice ? 0 : -30}/>}
      </View>
    </ScreenContainer>);
};
export default ReplyScreen;
