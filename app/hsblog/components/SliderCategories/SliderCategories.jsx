import React, { memo } from 'react';
import { View, FlatList, useTheme, tachyons } from "../../shared";
import { Link } from "../../navigation";
import CategoryCard from "../CategoryCard/CategoryCard";
import { SCREEN_WIDTH } from "../../shared/utils/screen";
const SliderCategories = ({ data, ListFooterComponent }) => {
    const { sizes } = useTheme();
    const isContainer = SCREEN_WIDTH > sizes.container;
    const sizeContainer = isContainer ? sizes.container : SCREEN_WIDTH;
    const containerMarginLeft = isContainer ? (SCREEN_WIDTH - sizes.container) / 2 : tachyons.mr3.marginRight;
    const footerMarginRight = isContainer ? SCREEN_WIDTH - sizes.container : tachyons.mr4.marginRight;
    const itemWidth = sizeContainer / 2.5;
    return (<FlatList horizontal data={data} keyExtractor={item => String(item.id)} renderItem={({ item }) => (<View style={{ width: itemWidth }} tachyons={['mr3', 'pb3']}>
          <Link to="PostsScreen" params={{
        requestParams: {
            taxonomies: { category: [item.id] },
        },
        name: item.name,
    }}>
            <CategoryCard imageUri={item.featuredImage.thumbnail} imagePreview={item.featuredImage.preview} title={item.name}/>
          </Link>
        </View>)} showsHorizontalScrollIndicator={false} ListFooterComponent={ListFooterComponent && (<View flex tachyons={['pb3']} style={{
        width: itemWidth,
        marginRight: footerMarginRight,
    }}>
            {ListFooterComponent}
          </View>)} contentContainerStyle={{ marginLeft: containerMarginLeft }}/>);
};
export default memo(SliderCategories);
