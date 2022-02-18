import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Platform, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import stylesBase from "../../stylesBase";
import he from 'he';
import { connect } from 'react-redux';
import { getListingByCat, getListingByCatLoadmore } from '../../actions';
import ListingItem from '../dumbs/ListingItem';
import EventItem from '../dumbs/EventItem';
import Heading from '../dumbs/Heading';
import ListingMarcas from '../dumbs/ListingMarcas';
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  getBusinessStatus, Button
} from '../../wiloke-elements';
import Banner from "../dumbs/Banner/Banner";
import styless from "../screens/ListingDetailStyles";
import Hero from "../dumbs/";
import { screenWidth } from '../../constants/styleConstants';
import SubCategorias from "../dumbs/ListingCategoriesNow/SubCategorias";

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
    vermas: false,
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
    const { translations } = this.props;
    return (


      <ScrollView><View
        style={[styles.categories, { marginVertical: 5 }]}
      >
      <Banner
          navigation={this.props.navigation}
          es={'NADA'}
        />
    {this.props.subcategories &&  this.props.navigation.state.params.name === 'Barrio Chino' ?

       <SubCategorias
          cat={this.props.subcategories}
          containerStyle={{
            paddingTop: 10,
            paddingVertical: 0,
            paddingBottom: 10
          }}
          navigation={this.props.navigation}
        />  : null
    }</View>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '98%'}}>
        <View style={styles.heading}>
        {this.props.navigation.state.params.name === 'Vegan' ? <Heading
          title={'Opciones vegetarianas'}
          text={''}
          mb={2}
        
        /> : <Heading
          title={'Lo mas popular'}
          text={''}
          mb={2}
        
        />} 
        </View>
        {this.props.subcategories ?

<TouchableOpacity
    style={
      { justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 30,
    borderRadius: 3, marginTop: 10, backgroundColor: 'black', width: '30%'}
    }
    activeOpacity={0.7}
   
     onPress={() => {
      const { navigation } = this.props;
      navigation.push("ListingCategories", {
        categoryId: navigation.state.params.categoryId,
        name: navigation.state.params.name,
        taxonomy: 'listing_cat',
        endpointAPI: 'list/listings',
      });
          }}
  >
    
    <Text style={{fontSize: 13,
    fontWeight: "bold",
    color: "#fff",}}>{!this.state.vermas ? 'Ver +' : 'Ver -'}</Text>
  </TouchableOpacity> : null }
  </View>
        {this.props.subcategories ?
        (!this.state.vermas ? <ListingMarcas
            layout={"horizontal"}
            data={listingByCat.oResults}
            navigation={this.props.navigation}
            colorPrimary={this.props.settings.colorPrimary}
            unit={this.props.settings.unit}
            cat={listingByCat.oResults}
            translations={translations}
            admob={this.props.settings.oAdMob}
            postType={'restaurant'}
          /> : <FlatList
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
      />  )  :
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
      /> }

      
      </ScrollView>
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
  categories: {
    paddingTop: 5,
    paddingBottom: 1,
  },
  inner: {
    flex: 1,
    height: '100%',
  },
  heading: {
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    alignItems: "flex-start",
    direction: "inherit",
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