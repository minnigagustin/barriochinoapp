import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import he from "he";
import { connect } from "react-redux";
import { colorGray2, screenWidth } from "../../../constants/styleConstants";
import { isCloseToBottom, Loader, Masonry } from "../../../wiloke-elements";
import { CommentItem, Layout } from "../../dumbs";
import getMyReviews from "./actions";

const MyReviewScreen = ({
  navigation,
  translations,
  settings,
  getMyReviews,
  myReviews,
}) => {
  useEffect(() => {
    getMyReviews();
  }, []);

  const _handleReviewItemNavigate = (reviewItem) => () => {
    navigation.navigate("CommentListingScreen", {
      id: reviewItem.ID,
      key: "reviews",
      item: reviewItem,
      autoFocus: true,
      mode: reviewItem.oReviews.mode,
    });
  };

  const _handleReviewItemNavigateListing = (listingItem) => () => {
    navigation.navigate("ListingDetailScreen", {
      id: listingItem.id,
      name: he.decode(listingItem.title),
      tagline: !!listingItem.tagline ? he.decode(listingItem.tagline) : null,
      link: listingItem.link,
      author: listingItem.author,
      image: listingItem.image.large,
      logo:
        listingItem.logo !== ""
          ? listingItem.logo
          : listingItem.image.thumbnail,
    });
  };

  const _handleLoadMore = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent) && !!myReviews.next) {
      getMyReviews({
        next: myReviews.next,
        isLoadmore: true,
      });
    }
  };

  const _renderReviewItem = ({ item, index }) => {
    const { oReview: reviewItem, oParent: listingItem } = item;
    return (
      <CommentItem
        galleryThumbnailMax={2}
        avatar={reviewItem.oUserInfo.avatar}
        grade={reviewItem.oReviews.average}
        title={reviewItem.postTitle}
        content={reviewItem.postContent}
        userName={reviewItem.oUserInfo.displayName}
        gallery={!!reviewItem.oGallery ? reviewItem.oGallery : {}}
        postDate={reviewItem.postDate}
        toListingButtonText={he.decode(listingItem.title)}
        toCommentButtonText={translations.showMore}
        goToCommentReview={_handleReviewItemNavigate(reviewItem)}
        goToListing={_handleReviewItemNavigateListing(listingItem)}
        colorPrimary={settings.colorPrimary}
      />
    );
  };

  const _renderContent = () => {
    if (myReviews.isLoading) {
      return <Loader />;
    }
    return (
      <View style={styles.content}>
        <Masonry
          column={2}
          gapVertical={10}
          gapHorizontal={10}
          data={myReviews.data}
          renderItem={_renderReviewItem}
        />
        {myReviews.isLoadmore && !myReviews.isLoading && !!myReviews.next ? (
          <Loader height={60} />
        ) : (
          <View style={{ height: 60 }} />
        )}
      </View>
    );
  };

  return (
    <Layout
      removeClippedSubviews
      navigation={navigation}
      headerType="headerHasBack"
      title={translations.reviews}
      goBack={() => navigation.goBack()}
      renderRight={() => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      renderContent={_renderContent}
      colorPrimary={settings.colorPrimary}
      textSearch={translations.search}
      scrollViewStyle={styles.scrollView}
      onMomentumScrollEnd={_handleLoadMore}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 10,
  },
  scrollView: {
    backgroundColor: colorGray2,
  },
});

const mapState = (state) => ({
  translations: state.translations,
  settings: state.settings,
  myReviews: state.myReviews,
});

const mapDispatch = {
  getMyReviews,
};

export default connect(mapState, mapDispatch)(MyReviewScreen);
