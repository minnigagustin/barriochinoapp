import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Consts from '../../constants/styleConstants';
import { Row, Col, IconTextMedium, P } from '../../wiloke-elements';
import he from 'he';
import { get } from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ListingTagList extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  };

  _handleItem = item => () => {
    const { navigation } = this.props;
    const _results = {
      postType: navigation.state.params.postType,
      listing_tag: item.ID.toString(),
    };
    navigation.navigate('ListingSearchResultScreen', { _results });
  };

  renderIconText = item => {
    return (
      <IconTextMedium
        isImage={item.type === 'image'}
        urlImage={item.url}
        iconName={item.oIcon.icon}
        iconSize={30}
        text={he.decode(item.name)}
        texNumberOfLines={1}
        disabled={item.unChecked === 'yes'}
        iconBackgroundColor={!!item.color ? item.color : Consts.colorGray2}
        iconColor={!!item.color ? '#fff' : Consts.colorDark2}
        textStyle={{
          color: !!item.color ? item.color : Consts.colorDark2,
        }}
      />
    );
  };

  renderText = item => {
    return (
      <P
        style={{
          fontSize: 12,
          textDecorationLine: item.unChecked === 'yes' ? 'line-through' : 'none',
          color: !!item.color ? item.color : Consts.colorDark2,
        }}
      >
        {he.decode(item.name)}
      </P>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <Row gap={15}>
        {data.length > 0 &&
          data.map((item, index) => {
            const iconType = get(item, `oIcon.type`, '');
            return (
              <Col key={index.toString()} column={2} gap={15}>
                <TouchableOpacity onPress={this._handleItem(item)}>
                  {item.type === 'image' || iconType === 'icon'
                    ? this.renderIconText(item)
                    : this.renderText(item)}
                </TouchableOpacity>
              </Col>
            );
          })}
      </Row>
    );
  }
}
