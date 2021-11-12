import React, { memo } from 'react';
import { NavigationSuspense } from "../../navigation";
import { FlatList } from "../../shared";
import CommentCard from "../../components/CommentCard/CommentCard";
import timeAgo from "../../utils/functions/timeAgo";
function ParentComment({ comment, isEdit, onReply, renderReply }) {
    return (<NavigationSuspense>
      <FlatList data={[comment]} renderItem={({ item }) => (<CommentCard title={item.title} author={item.author} description={item.description} createAt={timeAgo(item.timestamp, item.date)} renderReply={renderReply} onReply={() => onReply(item)}/>)} useContainer keyExtractor={(item, _index) => item.id.toString()} style={{ paddingHorizontal: 10 }} renderToHardwareTextureAndroid={true} showsVerticalScrollIndicator={false} initialScrollIndex={0} keyboardShouldPersistTaps={isEdit ? 'handled' : 'never'} keyboardDismissMode="on-drag"/>
    </NavigationSuspense>);
}
export default memo(ParentComment);
