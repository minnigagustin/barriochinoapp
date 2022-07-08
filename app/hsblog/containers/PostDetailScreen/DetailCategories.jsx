import React from 'react';
import { View, Button, Text } from "../../shared";
import { Link } from "../../navigation";
import { isEmpty } from 'ramda';
const renderCatItem = (item) => (<Link key={item.id} push="PostsScreen" params={{ requestParams: { taxonomies: { category: [item.id] } }, name: item.name }} tachyons={['mb1', 'mr1']}>
    <Button size="extra-small" borderRadius="round" disabled style={{ backgroundColor: item.color || '#111' }}>
      <Text colorNative="#fff" tailwind="text-xs">
        {item.name}
      </Text>
    </Button>
  </Link>);
const DetailCategories = ({ postCategories }) => {
    return (<View flexDirection="row" tachyons="mb2">
      {!isEmpty(postCategories) && postCategories.map(renderCatItem)}
    </View>);
};
export default DetailCategories;
