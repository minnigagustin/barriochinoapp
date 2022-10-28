import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import PropTypes from "prop-types";
import { Image2 } from "../../../wiloke-elements";
import _ from "lodash";
import { colorPrimary } from "../../../constants/styleConstants";
import CategorySelectItem from "./CategorySelectItem";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import he from "he";

const AnimatedImage = Animated.createAnimatedComponent(Image2);

export default class ListCategoriesSelect extends PureComponent {
  static propTypes = {
    categories: PropTypes.array,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { categories } = props;
    this.state = {
      selected: [categories[0]],
    };
  }

  _handleSelectss = (item) => async () => {
    const { navigation } = this.props;
    navigation.navigate("PageScreen2", {
                  uri: item.oTerm.description });
    console.log(item.oTerm.name);

  };
  _handleSelectsss = (item) => () => {
    const { navigation } = this.props;
    navigation.navigate("ListingCategories", {
      categoryId: item.oTerm.term_id,
      name: he.decode(item.oTerm.name),
      taxonomy: item.taxonomy ? item.taxonomy : "listing_cat",
      endpointAPI: item.restAPI,
    });
  };

  _handleSelect = (item) => () => {
    const { navigation } = this.props;
    console.log(item.oTerm.slug, 'pagina');
    if(item.oCount.number === 1 && !item.oTerm.slug.startsWith("web")){
    navigation.navigate('ListingDetailScreen', {
      id: item.oTerm.slug,
      name: he.decode(item.oTerm.name),
      link: item.oTerm.description,
      image: item.oIcon.url,
      logo: item.oIcon.url
    });

  } else if(item.oTerm.slug.startsWith("web")) {
    navigation.navigate("PageScreen2", {
      uri: item.oTerm.description,
    titleitem: item.oTerm.name });
  }
   else {
    const { subcategories, subevents } = this.props;
    navigation.navigate("ListingCategories", {
      categoryId: item.oTerm.term_id,
      name: he.decode(item.oTerm.name),
      taxonomy: "listing_cat",
      subcategories: subcategories,
      subevents: subevents,
      endpointAPI: item.restAPI,
    });
  }
  };

  _renderItem = ({ item, index }) => {
    const { selected, animatedValue } = this.state;
    const isSelected = _.includes(selected, item);

    return (
      <CategorySelectItem
        item={item}
        isSelected={isSelected}
        onPress={this._handleSelect(item)}
      />
    );
  };

  render() {
    const { categories } = this.props;
    return (
      <View style={{ paddingHorizontal: 10 }}>
    
        <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      autoplayLoopKeepAnimation
      data={categories}
      renderItem={this._renderItem}
          keyExtractor={(i, index) =>
            i.oTerm.term_id.toString() + `__categories__`
          }
    />
      </View>
    );
  }
}
