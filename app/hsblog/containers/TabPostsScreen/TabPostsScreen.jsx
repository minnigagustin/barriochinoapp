import React from 'react';
import { View, useMount, tachyons } from "../../shared";
// import HeaderSecondary from 'components/HeaderSecondary/HeaderSecondary';
import Magazine from "../../components/Magazine/Magazine";
import { useSelector } from 'react-redux';
import AsyncComponent from "../../components/AsyncComponent/AsyncComponent";
import { isEmpty } from 'ramda';
import Empty from "../../components/Empty/Empty";
import Retry from "../../components/Retry/Retry";
import { Layout } from '../../../components/dumbs';
import { tabPostsWithParamsSelector, pageSelector, maxNumPagesSelector } from './selectors';
import { useGetPostsWithParamsRequest } from './actions/actionPosts';
const PostsScreen = ({ navigation }) => {
    const getPostsWithParamsRequest = useGetPostsWithParamsRequest();
    const postsWithParams = useSelector(tabPostsWithParamsSelector);
    const page = useSelector(pageSelector);
    const maxNumPages = useSelector(maxNumPagesSelector);
    const settings = useSelector((state) => state.settings);
    const translations = useSelector((state) => state.translations);
    const auth = useSelector((state) => state.auth);
    const handleGetPostsWithParams = (page) => {
        getPostsWithParamsRequest({
            endpoint: 'search',
            params: {
                ...navigation.state.params?.requestParams,
                postType: 'post',
                page,
                postsPerPage: 20,
            },
        });
    };
    const handleLoadmore = () => {
        if (!!postsWithParams.pageNext && !!postsWithParams.data.pagination && !!maxNumPages && postsWithParams.pageNext <= maxNumPages) {
            handleGetPostsWithParams(postsWithParams.pageNext);
        }
    };
    useMount(() => {
        handleGetPostsWithParams(1);
    });
    const renderListFooterComponent = () => {
        if (!!page && !!maxNumPages && page <= maxNumPages) {
            return (<View tachyons="nt3">
          <Magazine isLoading type="list2" firstType="list2" loadingItems={3}/>
        </View>);
        }
        return null;
    };
    return (<Layout hsblogSearch navigation={navigation} colorPrimary={settings.colorPrimary} renderContent={() => (<View flex tachyons="ph3">
          <AsyncComponent status={postsWithParams.status} isDataEmpty={isEmpty(postsWithParams.data.data)} Request={<Magazine isLoading type="list2" firstType="standard1"/>} Success={<Magazine data={postsWithParams.data.data} type="list2" firstType="standard1" useFlatList flatListProps={{
        showsVerticalScrollIndicator: false,
        onEndReached: handleLoadmore,
        ListFooterComponent: renderListFooterComponent,
    }} containerStyle={tachyons.mb0}/>} Empty={<Empty />} Failure={<Retry onPress={() => handleGetPostsWithParams(1)} tachyons={['pv4', 'mt3']}/>}/>
        </View>)} textSearch={translations.search} isLoggedIn={auth.isLoggedIn} scrollViewEnabled={false}/>);
};
export default PostsScreen;
