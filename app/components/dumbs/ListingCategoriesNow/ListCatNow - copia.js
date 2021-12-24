import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import {
  screenWidth,
  colorDark1,
  colorGray1,
  round,
  colorGray3,
} from "../../../constants/styleConstants";
import { Row, Col, ImageCover, FontIcon } from "../../../wiloke-elements";
import _ from "lodash";
import he from "he";

export default class ListCatNow extends PureComponent {
  static propTypes = {
    cat: PropTypes.array,
    containerStyle: PropTypes.object,
  };

  state = {
    data: [],
        currentStepIndex: '',
        selectCatg: 1
  };

  mapDataToCategories = () => {
    const { cat } = this.props;
    const res = cat
      .reduce((newArr, item, index) => {
        const length = cat.length;
        let catDouble = [];
        if (index <= length - 1) {
          if (index % 2 === 0) {
            catDouble = !!cat[index + 1]
              ? [cat[index], cat[index + 1]]
              : [cat[index]];
          }
        }
        return [...newArr, catDouble];
      }, [])
      .filter((i) => !_.isEmpty(i));
    return res;
  };

  componentDidMount() {
    this.setState({
      data: this.mapDataToCategories(),
    });
  }

  _handleItem = (item) => () => {
    const { navigation } = this.props;
    navigation.navigate("ListingCategories", {
      categoryId: item.oTerm.term_id,
      name: he.decode(item.oTerm.name),
      taxonomy: item.taxonomy ? item.taxonomy : "listing_cat",
      endpointAPI: item.restAPI,
    });
  };
  

  _renderCatItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.catItem, index === 0 && { paddingBottom: 20 }]}
        onPress={this._handleItem(item)}
      >
        <View style={styles.box}>
          <ImageCover
            src={item.oIcon.url}
            width="100%"
            modifier="16by9"
          />
        </View>
        <Text style={styles.name}>{he.decode(item.oTerm.name)}</Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={[styles.item, { width: screenWidth / 4 - 10, height: "100%" }]}
      >
        <FlatList
          data={item}
          renderItem={this._renderCatItem}
          keyExtractor={(item, index) => index.toString() + "__categoryItem"}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
        
      </View>
    );
  };

  scrollToIndex = () => {
    
    this.flatListRef.scrollToIndex({animated: true, index: 0});
    this.setState({
              selectCatg: 1
            });
  }
  scrollToFinal = () => {
    const { navigation } = this.props;
    navigation.navigate("HomeNueva", {
    });
  }
  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )

  render() {
    const { cat, containerStyle } = this.props;
    const { data } = this.state;

    return (
      <View style={[containerStyle]}>
        <FlatList
        ref={(ref) => { this.flatListRef = ref; }}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString() + "__category"}
          horizontal={true}
      
          getItemLayout={this.getItemLayout}
          showsHorizontalScrollIndicator={false}
        />
        <View style={{marginTop: 10,marginBottom: -20,justifyContent: "center", alignItems: "center"}}>
        <View style={{flexDirection:'row',justifyContent:'space-between', width: 200,justifyContent: "center", alignItems: "center"}}>
        

    <Button
  onPress={this.scrollToFinal}
  title="Nuevo Menu"

  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>

      </View>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    marginHorizontal: 5,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
  },
  openMapView: {

    right: 10,
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "#E60000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 15,
  },
  catItem: {
    alignItems: "center",
  },
  name: {
    fontSize: 11,
    paddingTop: 10,
    fontWeight: "500",
  },
});
