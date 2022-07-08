import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import he from 'he';
import _ from 'lodash';
import {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo,
} from '../../actions';
import {
  isEmpty,
  Row,
  Col,
  IconTextMedium,
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped,
  P,
} from '../../wiloke-elements';
import { ButtonFooterContentBox } from '../dumbs';
import * as Consts from '../../constants/styleConstants';

class ListingListFeatureContainer extends Component {
  static defaultProps = {
    postType: 'listing',
  };

  _getListingFeature() {
    const {
      params,
      getListingListFeature,
      getListingBoxCustom,
      listingListFeature,
      listingListFeatureAll,
      listingCustomBox,
      type,
    } = this.props;
    const { id, item, max } = params;
    type === null &&
      (item.key === 'tags'
        ? getListingListFeature(id, item, max)
        : getListingBoxCustom(id, item, max));
  }

  componentDidMount() {
    this._getListingFeature();
  }

  _handlePress = item => async () => {
    const { navigation, postType } = this.props;
    const _results = {
      postType: postType,
      [item.taxonomy]: item.term_id.toString(),
    };
    navigation.push('ListingSearchResultScreen', { _results });
  };

  renderContent = (id, item, isLoading, listFeature, type) => {
    const { isListingDetailListRequestTimeout, translations, settings } = this.props;
    if (listFeature === '__empty__' || isEmpty(listFeature) || listFeature[0] === '__empty__') {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(listFeature) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="list"
            style={{
              marginBottom: type !== 'all' ? 10 : 50,
              width: '100%',
            }}
            renderFooter={
              item.status && item.status === 'yes' && this.renderFooterContentBox(id, item)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailListRequestTimeout}
              onPress={this._getListingFeature}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={15}>
                {listFeature.map((i, index) => (
                  <Col key={index.toString()} column={2} gap={15}>
                    <TouchableOpacity onPress={this._handlePress(i)}>
                      {!isEmpty(i.oIcon) ? (
                        <IconTextMedium
                          isImage={i.type === 'image'}
                          urlImage={i.oIcon.url}
                          iconName={!!i.oIcon.icon ? i.oIcon.icon : 'check'}
                          iconSize={30}
                          text={he.decode(i.name)}
                          texNumberOfLines={1}
                          disabled={i.unChecked === 'yes'}
                          iconBackgroundColor={
                            !!i.oIcon.color && typeof i.oIcon.color === 'string'
                              ? i.oIcon.color
                              : Consts.colorGray2
                          }
                          iconColor={!!i.oIcon.color ? '#fff' : Consts.colorDark2}
                          textStyle={{
                            color:
                              !!i.oIcon.color && typeof i.oIcon.color === 'string'
                                ? i.oIcon.color
                                : Consts.colorDark2,
                          }}
                        />
                      ) : (
                        <P
                          style={{
                            fontSize: 12,
                            textDecorationLine: i.unChecked === 'yes' ? 'line-through' : 'none',
                            color: !!i.color ? i.color : Consts.colorDark2,
                          }}
                        >
                          {he.decode(i.name)}
                        </P>
                      )}
                    </TouchableOpacity>
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
      getListingListFeature,
      getScrollTo,
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(item.key);
          getListingListFeature(listingId, item, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingListFeature,
      listingListFeatureAll,
      listingCustomBox,
      type,
      params,
      listingDetail,
    } = this.props;
    const { item, id } = params;
    const listingID = `${params.id}_details`;

    const customBoxListing = _.get(listingCustomBox, `${listingID}[${item.key}]`, []);
    const data =
      item.key === 'tags'
        ? type === 'all'
          ? listingListFeatureAll[listingID]
          : listingListFeature[listingID]
        : customBoxListing;
    return type === 'all'
      ? this.renderContent(id, item, _.isEmpty(data), data, 'all')
      : this.renderContent(id, item, _.isEmpty(data), data);
  }
}

const mapStateToProps = state => ({
  listingListFeature: state.listingListFeature,
  listingListFeatureAll: state.listingListFeatureAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailListRequestTimeout: state.isListingDetailListRequestTimeout,
  settings: state.settings,
  listingCustomBox: state.listingCustomBox,
  listingDetail: state.listingDetail,
});

const mapDispatchToProps = {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingListFeatureContainer);
