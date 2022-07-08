import React from 'react';
import { View, Button } from "../../shared";
import { Link } from "../../navigation";
import { isEmpty } from 'ramda';
const renderTagItem = (item) => (<Link key={String(item.id)} push="PostsScreen" params={{ requestParams: { taxonomies: { post_tag: [item.id] } }, name: item.name }} tachyons={['mb1', 'mr1']}>
    <Button size="extra-small" borderRadius="round" disabled backgroundColor="gray2" color="dark2">
      {item.name}
    </Button>
  </Link>);
const DetailTags = ({ postTags }) => {
    return (<View flexDirection="row" tachyons="mb3">
      {!isEmpty(postTags) && !!postTags && postTags.map(renderTagItem)}
    </View>);
};
export default DetailTags;
