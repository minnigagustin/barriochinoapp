import React from 'react';
import { View } from "../../shared";
import * as R from 'ramda';
import TextBox from "../TextBox/TextBox";
import { Link } from "../../navigation";
const Categories = ({ data }) => {
    const renderCategoryItem = (item) => {
        return (<View key={item.id} tachyons={['mr1', 'mb1']}>
        <Link to="PostsScreen" params={{
            requestParams: { taxonomies: { category: [item.id] } },
            name: item.name,
        }}>
          <TextBox>{item.name}</TextBox>
        </Link>
      </View>);
    };
    return (<View flexWrap="wrap" flexDirection="row" tachyons="mb3">
      {!R.isEmpty(data) && data.map(renderCategoryItem)}
    </View>);
};
export default Categories;
