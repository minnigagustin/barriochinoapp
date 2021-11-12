import * as React from 'react';
import R from 'ramda';
import { FlatList } from 'react-native';
import { Link } from "../../navigation";
import { Text } from "../../shared";
import i18n from "../../utils/functions/i18n";
import CommentCard from "../../components/CommentCard/CommentCard";
import { withNavigation } from 'react-navigation';
import timeAgo from "../../utils/functions/timeAgo";
function ReplyChildren({ parentComment, postID, isEdit, commentEditID, onCancel, navigation }) {
    const _renderHeaderReply = () => {
        if (parentComment.childCommentTotal < 4)
            return null;
        return (<Link to="ReplyScreen" params={{ item: parentComment, postID }} tachyons={['justifyCenter', 'pb1']}>
        <Text size={11} tachyons={['b']} color="dark2">
          {i18n.t('readMoreReply')}
        </Text>
      </Link>);
    };
    const _renderItem = ({ item }) => {
        return (<CommentCard title={item.title} author={item.author} description={item.description} createAt={timeAgo(item.timestamp, item.date)} isReply isEdit={isEdit && commentEditID === item.id} onCancel={onCancel} onReply={() => navigation?.navigate('ReplyScreen', { item: parentComment, postID, reply: item })}/>);
    };
    if (R.isEmpty(parentComment.childComments))
        return null;
    return (<FlatList data={parentComment.childComments} keyExtractor={(item, _index) => item.id.toString()} renderItem={_renderItem} ListFooterComponent={_renderHeaderReply} inverted/>);
}
export default React.memo(withNavigation(ReplyChildren));
