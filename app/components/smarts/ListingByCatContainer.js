import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, FlatList, StyleSheet, Dimensions } from 'react-native';
import _ from 'lodash';
import he from 'he';
import { connect } from 'react-redux';
import { getListingByCat, getListingByCatLoadmore } from '../../actions';
import ListingItem from '../dumbs/ListingItem';
import EventItem from '../dumbs/EventItem';
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  getBusinessStatus,
} from '../../wiloke-elements';
import { screenWidth } from '../../constants/styleConstants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const END_REACHED_THRESHOLD = Platform.OS === 'ios' ? 0 : 1;

class ListingByCatContainer extends Component {
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
      const { navigation, getListingByCat } = this.props;
      const { params } = navigation.state;
      const { endpointAPI, taxonomy, categoryId } = params;
      await getListingByCat(categoryId, taxonomy, endpointAPI);
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
    const { navigation, getListingByCatLoadmore } = this.props;
    const { params } = navigation.state;
    const { endpointAPI, taxonomy, categoryId } = params;
    const { startLoadMore } = this.state;
    if (startLoadMore && next !== false && this._prevPage <= totalPage) {
      this._prevPage++;
      await getListingByCatLoadmore(this._prevPage, categoryId, taxonomy, endpointAPI);
    }
  };

  renderItem = ({ item }) => {
    const { navigation, settings, translations } = this.props;
    const { params } = navigation.state;
    const { endpointAPI } = params;
    const hourMode = _.get(item, `newBusinessHours.mode`, null);
    const reviewMode = _.get(item, `oReview.mode`, 10);
    const isOpen =
      item.hourMode === 'open_for_selected_hours'
        ? getBusinessStatus(item.businessHours, item.timezone)
        : item.hourMode;
    const addressLocation = _.get(item, `oAddress.address`, '');

    if (endpointAPI === 'events') {
      return (
        <EventItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          date={
            item.oCalendar
              ? `${item.oCalendar.oStarts.date} - ${item.oCalendar.oStarts.hour}`
              : null
          }
          address={he.decode(item.oAddress.address)}
          hosted={`${translations.hostedBy} ${item.oAuthor.displayName}`}
          interested={`${item.oFavorite.totalFavorites} ${item.oFavorite.text}`}
          style={{
            width: screenWidth / 2 - 15,
            margin: 5,
          }}
          onPress={() =>
            navigation.push('EventDetailScreen', {
              id: item.ID,
              name: he.decode(item.postTitle),
              image: SCREEN_WIDTH > 420 ? item.oFeaturedImg.large : item.oFeaturedImg.medium,
              address: he.decode(item.oAddress.address),
              hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
              interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`,
            })
          }
        />
      );
    }
    return (
      <ListingItem
        image={item.oFeaturedImg.large}
        title={he.decode(item.postTitle)}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(addressLocation)}
        claimStatus={item.claimStatus === 'claimed'}
        translations={translations}
        reviewMode={reviewMode}
        reviewAverage={item.oReview.averageReview}
        claimStatus={item.claimStatus === 'claimed'}
        businessStatus={isOpen}
        colorPrimary={settings.colorPrimary}
        onPress={() =>
          navigation.navigate('ListingDetailScreen', {
            id: item.ID,
            name: he.decode(item.postTitle),
            tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
            link: item.postLink,
            author: item.oAuthor,
            image: item.oFeaturedImg.large,
            logo: item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail,
          })
        }
        layout={this.props.horizontal ? 'horizontal' : 'vertical'}
      />
    );
  };

  _getWithLoadingProps = loading => ({
    isLoading: loading,
    contentLoader: 'content',
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: '56.25%',
    column: 2,
    gap: 10,
    containerPadding: 10,
  });

  renderContentSuccess(listingByCat) {
    const { startLoadMore } = this.state;
    return (
      <FlatList
        data={listingByCat.oResults}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => item.ID.toString() + index.toString()}
        numColumns={this.props.horizontal ? 1 : 2}
        horizontal={this.props.horizontal}
        showsHorizontalScrollIndicator={false}
        onEndReached={() => this._handleEndReached(listingByCat.next, listingByCat.totalPage)}
        ListFooterComponent={() =>
          startLoadMore && listingByCat.next !== false ? (
            <View
              style={{
                width: screenWidth - 10,
                marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
              }}
            >
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
            </View>
          ) : (
            <View style={{ paddingBottom: 20 }} />
          )
        }
        style={{ padding: 5 }}
        columnWrapperStyle={{
          width: screenWidth,
          marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
        }}
      />
    );
  }

  renderContentError(listingByCat) {
    const { translations } = this.props;
    return listingByCat && <MessageError message={translations.noPostFound} />;
  }

  render() {
    const { listingByCat, loading } = this.props;
    const condition = !_.isEmpty(listingByCat) && listingByCat.status === 'success';
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inner,
            {
              width: loading ? screenWidth : SCREEN_WIDTH,
            },
          ]}
        >
          <ViewWithLoading {...this._getWithLoadingProps(loading)}>
            {condition
              ? this.renderContentSuccess(listingByCat)
              : this.renderContentError(listingByCat)}
          </ViewWithLoading>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    height: '100%',
  },
});

const mapStateToProps = state => ({
  listingByCat: state.listingByCat,
  loading: state.loading,
  settings: state.settings,
  translations: state.translations,
});

export default connect(mapStateToProps, {
  getListingByCat,
  getListingByCatLoadmore,
})(ListingByCatContainer);
