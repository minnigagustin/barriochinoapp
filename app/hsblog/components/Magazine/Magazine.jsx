import React, { memo } from 'react';
import * as R from 'ramda';
import { Link } from "../../navigation";
import { View, FlatList, useMount, Container } from "../../shared";
import Post1 from "../Post1/Post1";
import PostList1 from "../PostList1/PostList1";
import Skeleton from "../Skeleton/Skeleton";
const Magazine = ({ data = [], isLoading = false, loadingItems = 5, type = 'standard1', firstType = 'standard1', containerStyle = {}, useFlatList = false, flatListProps = {}, keyExtractor = (_item, index) => String(index), onMount = () => { }, }) => {
    const dataLoading = R.range(0, loadingItems);
    const numColumns = type.includes('grid') ? 2 : 1;
    const dataRemoveFirstItem = data.filter((_, index) => !!index);
    const firstItem = data[0];
    useMount(() => {
        onMount();
    });
    const getColumn = (index) => {
        const _type = index === 0 ? firstType : type;
        return _type.includes('grid') ? '3/6' : '6/6';
    };
    const handleKeyExtractor = (item, index) => {
        return String(item.id || index);
    };
    const checkRenderPost = (type, item) => {
        switch (type) {
            case 'standard1':
                return <Post1 {...item} imageRounded/>;
            case 'standard2':
                return <Post1 {...item} type="creative" imageRounded/>;
            case 'list1':
                return <PostList1 {...item} imageRounded/>;
            case 'list2':
                return <PostList1 {...item} size="small" imageRounded/>;
            case 'list3':
                return <PostList1 {...item} imageRounded inverted/>;
            case 'list4':
                return <PostList1 {...item} size="small" imageRounded inverted/>;
            case 'grid1':
                return <Post1 {...item} size="small" imageRounded/>;
            case 'grid2':
                return <Post1 {...item} type="creative" size="small" imageRounded/>;
            default:
                return null;
        }
    };
    const checkRenderLoading = (type) => {
        if (type.includes('standard') || type.includes('grid')) {
            return <Skeleton image content imageRounded/>;
        }
        if (type.includes('list')) {
            return <Skeleton image content type="horizontal" imageRounded/>;
        }
        return null;
    };
    const renderPostItem = (item, index) => {
        const _type = index === 0 ? firstType : type;
        return (<View key={keyExtractor(item, index)} column={getColumn(index)} tachyons={['pb3', 'ph2']}>
        <Link push="PostDetailNotGetureDistance" params={item} activeOpacity={0.8}>
          {checkRenderPost(_type, item)}
        </Link>
      </View>);
    };
    const renderPostItemFlatList = ({ item }) => {
        return (<View tachyons="pb3">
        <Link push="PostDetailNotGetureDistance" params={item} activeOpacity={0.8}>
          {checkRenderPost(type, item)}
        </Link>
      </View>);
    };
    const renderLoadingItem = (item, index) => {
        const _type = index === 0 ? firstType : type;
        return (<View key={String(item)} column={getColumn(index)} tachyons="pa2">
        {checkRenderLoading(_type)}
      </View>);
    };
    return (<View flex tachyons="mb2" style={containerStyle}>
      {isLoading ? (<Container flex>
          <View flexDirection="row" tachyons={['na2', 'mt3']}>
            {dataLoading.map(renderLoadingItem)}
          </View>
        </Container>) : (!R.isEmpty(data) &&
        (useFlatList ? (<FlatList {...flatListProps} data={dataRemoveFirstItem} keyExtractor={handleKeyExtractor} keyboardShouldPersistTaps="handled" ListHeaderComponent={<View tachyons={['mb3', 'mt3']}>
                <Link push="PostDetailNotGetureDistance" params={firstItem} activeOpacity={0.8}>
                  {checkRenderPost(firstType, firstItem)}
                </Link>
              </View>} renderItem={renderPostItemFlatList} numColumns={numColumns} numGap={30} useContainer/>) : (<Container>
            <View flexDirection="row" flex tachyons={['nl2', 'nr2']}>
              {data.map(renderPostItem)}
            </View>
          </Container>)))}
    </View>);
};
export default memo(Magazine);
