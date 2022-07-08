import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import {
  changeListingDetailNavigation,
  getListingVideos,
  getScrollTo,
} from "../../actions";
import {
  Row,
  Col,
  ViewWithLoading,
  Video,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped,
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import { screenWidth } from "../../constants/styleConstants";

class ListingVideosContainer extends Component {
  _getListingVideos = () => {
    const {
      params,
      getListingVideos,
      type,
      listingVideos,
      listingVideosAll,
    } = this.props;
    const { id, item, max } = params;
    type === null && getListingVideos(id, item, max);
  };
  componentDidMount() {
    this._getListingVideos();
  }

  renderContent = (id, item, isLoading, videos, type) => {
    const {
      isListingDetailVideosRequestTimeout,
      translations,
      settings,
    } = this.props;
    if (videos === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(videos) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{
              marginBottom: type !== "all" ? 10 : 50,
              width: "100%",
            }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailVideosRequestTimeout}
              onPress={this._getListingVideos}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={10}>
                {videos.map((item, index) => (
                  <Col key={index.toString()} column={2} gap={10}>
                    <Video source={item.src} thumbnail={item.thumbnail} />
                  </Col>
                ))}
              </Row>
            </RequestTimeoutWrapped>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (listingId, item) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingVideos,
      getScrollTo,
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(item.key);
          getListingVideos(listingId, item, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingVideos,
      listingVideosAll,
      loadingListingDetail,
      params,
      type,
      listingDetail,
    } = this.props;
    const { item, id } = params;
    const listingID = `${params.id}_details`;

    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingVideosAll),
          listingVideosAll[listingID],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingVideos[listingID]),
          listingVideos[listingID]
        );
  }
}

const mapStateToProps = (state) => ({
  listingVideos: state.listingVideos,
  listingVideosAll: state.listingVideosAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailVideosRequestTimeout:
    state.isListingDetailVideosRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail,
});

export default connect(mapStateToProps, {
  changeListingDetailNavigation,
  getListingVideos,
  getScrollTo,
})(ListingVideosContainer);
