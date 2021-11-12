import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";
import {
  getListingEvents,
  changeListingDetailNavigation,
  getScrollTo,
} from "../../actions";
import {
  ViewWithLoading,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped,
  Col,
  Row,
} from "../../wiloke-elements";
import { EventItem } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
import { ButtonFooterContentBox } from "../dumbs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class ListingEventsContainer extends Component {
  _getListingEvents = () => {
    const {
      params,
      getListingEvents,
      type,
      listingEvents,
      listingEventsAll,
    } = this.props;
    const { id, item, max } = params;
    type === null && getListingEvents(id, item, max);
  };

  componentDidMount() {
    this._getListingEvents();
  }

  renderItem = (item) => {
    const { navigation, translations } = this.props;
    return (
      <Col key={item.ID.toString()} column={2} gap={10}>
        <EventItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          date={
            item.oCalendar
              ? `${item.oCalendar.oStarts.date} - ${item.oCalendar.oStarts.hour}`
              : null
          }
          address={he.decode(item.oAddress.address || "")}
          hosted={`${translations.hostedBy} ${item.hostedBy.name}`}
          interested={`${item.totalFavorites} ${translations.favorite}`}
          onPress={() =>
            navigation.navigate("EventDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              address: he.decode(item.oAddress.address || ""),
              hosted: `${translations.hostedBy} ${item.hostedBy.name}`,
              interested: `${item.totalFavorites} ${translations.favorite}`,
            })
          }
          style={{
            marginBottom: 10,
          }}
          bodyStyle={{
            borderWidth: 1,
            borderColor: Consts.colorGray1,
            borderTopWidth: 0,
          }}
          footerStyle={{
            borderWidth: 1,
            borderColor: Consts.colorGray1,
            borderTopWidth: 0,
            paddingVertical: 10,
          }}
        />
      </Col>
    );
  };

  renderContent = (id, item, isLoading, events, type) => {
    const {
      isListingDetailEventRequestTimeout,
      translations,
      settings,
    } = this.props;
    if (events === "__empty__" || isEmpty(events)) {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(events) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="calendar"
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
              isTimeout={isListingDetailEventRequestTimeout}
              onPress={this._getListingEvents}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={10}>{events.map(this.renderItem)}</Row>
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
      getListingEvents,
      getScrollTo,
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(item.key);
          getListingEvents(listingId, item, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingEvents,
      listingEventsAll,
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
          _.isEmpty(listingEventsAll[listingID]),
          listingEventsAll[listingID],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingEvents[listingID]),
          listingEvents[listingID]
        );
  }
}

const mapStateToProps = (state) => ({
  listingEvents: state.listingEvents,
  listingEventsAll: state.listingEventsAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailEventRequestTimeout: state.isListingDetailEventRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail,
});

export default connect(mapStateToProps, {
  getListingEvents,
  changeListingDetailNavigation,
  getScrollTo,
})(ListingEventsContainer);
