import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Platform, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import {
  getListingSearchResults,
  getListingSearchResultsLoadmore,
} from "../../actions";
import ListingItem from "../dumbs/ListingItem";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  getBusinessStatus,
} from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class ListingSearchResultsContainer extends Component {
  static defaultProps = {
    horizontal: false,
  };

  static propTypes = {
    horizontal: PropTypes.bool,
  };

  state = {
    startLoadMore: false,
  };

  _getListing = async () => {
    try {
      const { navigation, getListingSearchResults } = this.props;
      const { state } = navigation;
      const { params } = navigation.state;
      await getListingSearchResults(params._results);
      this.setState({ startLoadMore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListing();
  }

  _prevPage = 1;

  _handleEndReached = async (next, totalPage) => {
    const { navigation, getListingSearchResultsLoadmore } = this.props;
    const { params } = navigation.state;
    const { startLoadMore } = this.state;
    if (startLoadMore && next !== false && this._prevPage <= totalPage) {
      this._prevPage++;
      await getListingSearchResultsLoadmore(this._prevPage, params._results);
    }
  };

  renderItem = ({ item }) => {
    const { navigation, settings, translations } = this.props;
    const hourMode = _.get(item, `newBusinessHours.mode`, null);
    const reviewMode = _.get(item, `oReview.mode`, 10);
    const addressLocation = _.get(item, `oAddress.address`, "");

    const isOpen =
      hourMode === "open_for_selected_hours"
        ? getBusinessStatus(
            item.newBusinessHours.operating_times,
            item.newBusinessHours.timezone
          )
        : hourMode;

    return (
      <ListingItem
        image={item.oFeaturedImg.large}
        title={he.decode(item.postTitle)}
        translations={translations}
        claimStatus={item.claimStatus === "claimed"}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(addressLocation)}
        claimStatus={item.claimStatus === "claimed"}
        reviewMode={reviewMode}
        reviewAverage={item.oReview.averageReview}
        businessStatus={isOpen}
        colorPrimary={settings.colorPrimary}
        onPress={() => {
          console.log({ item });
          navigation.push("ListingDetailScreen", {
            id: item.ID,
            name: he.decode(item.postTitle),
            tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
            link: item.postLink,
            author: item.oAuthor,
            image: item.oFeaturedImg.large,
            logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail,
          });
        }}
        layout={this.props.horizontal ? "horizontal" : "vertical"}
      />
    );
  };

  _getWithLoadingProps = (loading) => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10,
  });

  renderContentSuccess(listingSearchResults) {
    const { startLoadMore } = this.state;
    return (
      <FlatList
        data={listingSearchResults.oResults}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => item.ID.toString()}
        numColumns={this.props.horizontal ? 1 : 2}
        horizontal={this.props.horizontal}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.02}
        onEndReached={() =>
          this._handleEndReached(
            listingSearchResults.next,
            listingSearchResults.totalPage
          )
        }
        ListFooterComponent={() =>
          startLoadMore && listingSearchResults.next !== false ? (
            <View style={{ padding: 5 }}>
              <Row gap={10}>
                {Array(2)
                  .fill(null)
                  .map((_, index) => (
                    <Col key={index.toString()} column={2} gap={10}>
                      <ContentLoader
                        featureRatioWithPadding="56.25%"
                        contentHeight={90}
                        content={true}
                      />
                    </Col>
                  ))}
              </Row>
            </View>
          ) : (
            <View style={{ paddingBottom: 20 }} />
          )
        }
        style={{ padding: 5 }}
      />
    );
  }

  renderContentError(listingSearchResults) {
    const { translations } = this.props;
    return (
      listingSearchResults && (
        <MessageError message={translations.noPostFound} />
      )
    );
  }

  render() {
    const {
      listingSearchResults,
      isListingSearchRequestTimeout,
      loading,
      translations,
    } = this.props;
    const condition =
      !_.isEmpty(listingSearchResults) &&
      listingSearchResults.status === "success";
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <RequestTimeoutWrapped
          isTimeout={isListingSearchRequestTimeout}
          onPress={this._getListing}
          fullScreen={true}
          style={styles.container}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {condition
            ? this.renderContentSuccess(listingSearchResults)
            : this.renderContentError(listingSearchResults)}
        </RequestTimeoutWrapped>
      </ViewWithLoading>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  listingSearchResults: state.listingSearchResults,
  loading: state.loading,
  isListingSearchRequestTimeout: state.isListingSearchRequestTimeout,
  translations: state.translations,
  settings: state.settings,
});

export default connect(mapStateToProps, {
  getListingSearchResults,
  getListingSearchResultsLoadmore,
})(ListingSearchResultsContainer);
