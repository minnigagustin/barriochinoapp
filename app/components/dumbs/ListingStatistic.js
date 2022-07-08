import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Row, Col, IconTextMedium } from "../../wiloke-elements";
import he from "he";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ListingStatistic extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
        key: PropTypes.string,
      })
    ),
  };

  _getIcon = (key) => {
    switch (key) {
      case "views":
        return "eye";
      case "reviews":
        return "star";
      case "favorites":
        return "heart";
      case "shares":
        return "share";
      default:
        return "check";
    }
  };

  _handleItem = (item) => () => {
    // const { navigation } = this.props;
    // console.log({ item });
    // return;
    // const _results = {
    //   postType: "listing",
    //   listing_cat: item.ID.toString(),
    // };
    // navigation.navigate("ListingSearchResultScreen", { _results });
  };

  render() {
    const { data, translations } = this.props;
    return (
      <Row gap={15}>
        {data.length > 0 &&
          data.map((item, index) => (
            <Col key={index.toString()} column={2} gap={15}>
              <TouchableOpacity onPress={this._handleItem(item)}>
                <IconTextMedium
                  iconName={this._getIcon(item.key)}
                  iconSize={30}
                  text={`${item.count} ${he.decode(translations[item.key])}`}
                  texNumberOfLines={1}
                />
              </TouchableOpacity>
            </Col>
          ))}
      </Row>
    );
  }
}
