import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { Row, Col, IconTextMedium } from "../../wiloke-elements";
import he from "he";

const ListingCatList = (props) => {
  const { data } = props;
  const _handleItem = (item) => () => {
    const { navigation } = props;
    const _results = {
      postType: navigation.state.params.postType,
      listing_cat: item.ID.toString(),
    };
    navigation.navigate("ListingSearchResultScreen", { _results });
  };
  return (
    <Row gap={15}>
      {data.length > 0 &&
        data.map((item, index) => (
          <Col key={index.toString()} column={2} gap={15}>
            <TouchableOpacity onPress={_handleItem(item)}>
              <IconTextMedium
                iconName={item.oIcon.icon}
                iconSize={30}
                isImage={item.oIcon.type === "image" ? true : false}
                urlImage={item.oIcon.url}
                iconColor={item.oIcon.iconColor ? "#fff" : Consts.colorDark2}
                iconBackgroundColor={
                  item.oIcon.color ? item.oIcon.color : Consts.colorGray2
                }
                text={he.decode(item.name)}
                texNumberOfLines={1}
              />
            </TouchableOpacity>
          </Col>
        ))}
    </Row>
  );
};
ListingCatList.propTypes = {
  data: PropTypes.array,
};

export default ListingCatList;
