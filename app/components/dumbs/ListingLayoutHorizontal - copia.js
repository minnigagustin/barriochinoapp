import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import he from 'he';
import ListingItem from '../dumbs/ListingItem';
import { Loader, getBusinessStatus, adMobModal } from '../../wiloke-elements';
import * as Consts from '../../constants/styleConstants';
import { getDistance } from '../../utils/getDistance';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const emiter = new Emitter();

class ListingLayoutHorizontal extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    colorPrimary: PropTypes.string,
  };

  static defaultProps = {
    colorPrimary: Consts.colorPrimary,
  };

  _navigate = item => {
    const { navigation, postType } = this.props;

    navigation.navigate('ListingDetailScreen', {
      id: item.ID,
      name: he.decode(item.postTitle),
      tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
      link: item.postLink,
      author: item.oAuthor,
      image: item.oFeaturedImg.large,
      logo: item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail,
      postType,
    });
  };

  _handlePress = item => async () => {
    const { admob } = this.props;
    const isAdmob = _.get(admob, 'oFullWidth', false);
    !!isAdmob && adMobModal({ variant: admob.oFullWidth.variant });
    this._navigate(item);
  };

  renderItem = ({ item }) => {
    const { navigation, myCoords, unit, translations } = this.props;
    const { latitude, longitude } = myCoords;
    const address = item.oAddress || { lat: '', lng: '' };
    const { lat, lng } = address;
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    const hourMode = _.get(item, `newBusinessHours.mode`, null);
    const reviewMode = _.get(item, `oReview.mode`, 10);
    const addressLocation = _.get(item, `oAddress.address`, '');
    const isOpen =
      hourMode === 'open_for_selected_hours'
        ? getBusinessStatus(item.newBusinessHours.operating_times, item.newBusinessHours.timezone)
        : hourMode;
    return (
      <ListingItem
        image={item.oFeaturedImg.large}
        title={he.decode(item.postTitle)}
        translations={translations}
        claimStatus={item.claimStatus === 'claimed'}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        claimStatus={item.claimStatus === 'claimed'}
        logo={item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(addressLocation)}
        reviewMode={reviewMode}
        reviewAverage={item.oReview.averageReview}
        businessStatus={isOpen}
        colorPrimary={this.props.colorPrimary}
        onPress={this._handlePress(item)}
        layout={this.props.layout}
        mapDistance={distance}
      />
    );
  };
  renderItemLoader = () => <ListingItem contentLoader={true} layout={this.props.layout} />;

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.ID.toString()}
            numColumns={this.props.layout === 'horizontal' ? 1 : 2}
            horizontal={this.props.layout === 'horizontal' ? true : false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={[
              { key: '1' },
              { key: '2' },
              { key: '3' },
              { key: '4' },
              { key: '5' },
              { key: '6' },
            ]}
            renderItem={this.renderItemLoader}
            numColumns={1}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
});

export default ListingLayoutHorizontal;
