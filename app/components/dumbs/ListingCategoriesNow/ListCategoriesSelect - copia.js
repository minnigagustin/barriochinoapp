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

  _handleSelect = (item) => async () => {
    const { selected } = this.state;
    const { onSelect } = this.props;
    const itemSelected = selected.filter(
      (i) => i.oTerm.term_id === item.oTerm.term_id
    );
    if (!_.isEmpty(itemSelected)) {
      return;
    }
    const addItem = [item];
    await this.setState({
      selected: addItem,
    });
    onSelect && onSelect(addItem[0]);
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
        <FlatList
          data={categories}
          renderItem={this._renderItem}
          keyExtractor={(i, index) =>
            i.oTerm.term_id.toString() + `__categories__`
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
