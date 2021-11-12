import React from 'react';
import { NavigationSuspense, Link } from "../../navigation";
import HtmlViewer from "../../components/HtmlViewer/HtmlViewer";
import HtmlViewerImageLoading from "../../components/HtmlViewer/HtmlViewerImageLoading";
import { Button, View, useTheme } from "../../shared";
import Magazine from "../../components/Magazine/Magazine";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import i18n from "../../utils/functions/i18n";
import Skeleton from "../../components/Skeleton/Skeleton";
import { useSelector } from 'react-redux';
import getHtmlViewerTextStyles from "../../utils/functions/getHtmlViewerTextStyles";
import { useNetInfo } from '@react-native-community/netinfo';
import { historyPostsSelector, postTextSizeSelector } from './selectors';
import DetailTags from './DetailTags';
const DetailContent = ({ postDetail, postDetailRelatedPost, imageMounted }) => {
    const { colors } = useTheme();
    const historyPosts = useSelector(historyPostsSelector);
    const postTextSize = useSelector(postTextSizeSelector);
    const netInfoState = useNetInfo();
    const checkTagStyles = () => {
        switch (postTextSize) {
            case 'large':
                return getHtmlViewerTextStyles(20, colors.primary);
            case 'medium':
                return getHtmlViewerTextStyles(18, colors.primary);
            case 'small':
                return getHtmlViewerTextStyles(15, colors.primary);
            default:
                return {};
        }
    };
    if (postDetail?.status === 'loading' && !postDetail?.data) {
        return <Skeleton content/>;
    }
    if (postDetail?.status === 'failure' && netInfoState.isConnected) {
        return null;
    }
    return (<NavigationSuspense fallback={<Skeleton content/>}>
      {imageMounted ? (<HtmlViewer html={postDetail?.data?.description ?? ''} tagsStyles={checkTagStyles()}/>) : (<HtmlViewerImageLoading html={postDetail?.data?.description ?? ''} tagsStyles={checkTagStyles()}/>)}
      {!!postDetail?.data?.postTags && <DetailTags postTags={postDetail?.data?.postTags}/>}
      {!!postDetail?.data && (<>
          <Link to="Comments" activeOpacity={0.7} tachyons="mb3" params={{ id: postDetail?.data?.id ?? -1, title: postDetail?.data?.title ?? '' }}>
            <Button disabled block borderRadius="round" backgroundColor="transparent" borderColor="primary" color="primary" tachyons="mt2">
              {`${i18n.t('seeResponse')} (${postDetail?.data?.commentCount})`}
            </Button>
          </Link>
          {postDetailRelatedPost?.status === 'loading' && !postDetailRelatedPost?.data ? (<Magazine isLoading type="list2" firstType="list2"/>) : (<View>
              <SectionTitle text={postDetailRelatedPost?.data?.title ?? ''} color="primary"/>
              <View tachyons="nt2">
                <Magazine data={postDetailRelatedPost?.data?.data} type="list2" firstType="list2"/>
              </View>
            </View>)}
          <SectionTitle text={i18n.t('viewedPosts')} color="primary"/>
          <View tachyons="nt2">
            <Magazine data={historyPosts} type="list2" firstType="list2"/>
          </View>
        </>)}
    </NavigationSuspense>);
};
export default DetailContent;
