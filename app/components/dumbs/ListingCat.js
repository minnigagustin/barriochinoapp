import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { ImageCover, Image2 } from "../../wiloke-elements";
import { LinearGradient } from "expo-linear-gradient";
import _ from "lodash";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2.5;
const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==";

export default class ListingCat extends Component {
  static defaultProps = {
    contentLoader: false,
  };
  randomNumber = (min, max) => {
    return Math.floor(Math.random() * max + min);
  };
  shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  randomRgb = () => {
    switch (this.randomNumber(1, 4)) {
      case 1:
        return [
          this.randomNumber(0, 50),
          this.randomNumber(30, 140),
          this.randomNumber(150, 200),
        ];
      case 2:
        return [
          this.randomNumber(0, 100),
          this.randomNumber(100, 140),
          this.randomNumber(30, 140),
        ];
      case 3:
        return [
          this.randomNumber(30, 140),
          this.randomNumber(0, 50),
          this.randomNumber(100, 180),
        ];
      default:
        return [
          this.randomNumber(100, 180),
          this.randomNumber(0, 50),
          this.randomNumber(30, 140),
        ];
    }
  };

  renderNoGradient = () => {
    const { image } = this.props;
    return (
      <View>
        <ImageCover
          src={!!image ? image : DEFAULT_IMAGE}
          width="100%"
          modifier="16by9"
          styles={{
            borderRadius: Consts.round,
          }}
        />
        <View style={[styles.nameNogradient]}>
          <Text style={[stylesBase.h6, styles.text]}>{this.props.name}</Text>
        </View>
      </View>
    );
  };

  renderGradient = () => {
    const { linearGradient } = this.props;
    const color1 = this.randomRgb();
    const color2 = color1.map((item) => {
      let _item = item + this.randomNumber(-80, 80);
      if (_item < 0) {
        _item = 0;
      } else if (_item > 180) {
        _item = 160;
      }
      return _item;
    });
    const gradient = [
      !_.isEmpty(linearGradient)
        ? linearGradient.leftColor
        : `rgba(${color1}, 0.8)`,
      !_.isEmpty(linearGradient)
        ? linearGradient.rightColor
        : `rgba(${color2}, 0.4)`,
    ];
    return (
      <View>
        {this.props.image ? (
          <ImageCover
            src={this.props.image}
            width="100%"
            modifier="16by9"
            overlay={0.35}
            linearGradient="0,0,0"
            styles={{
              borderRadius: Consts.round,
            }}
          />
        ) : (
          <LinearGradient
            colors={gradient}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{
              width: this.props.itemWidth,
              height: (this.props.itemWidth * 9) / 16,
            }}
          />
        )}
        <View style={[stylesBase.absFull, styles.name]}>
          <Text style={[stylesBase.h6, styles.text]}>{this.props.name}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { toggle_gradient } = this.props;

    return (
      <View style={[styles.container, { width: this.props.itemWidth }]}>
        <TouchableHighlight
          underlayColor="rgba(255,255,255,0.2)"
          onPress={this.props.onPress}
        >
          {toggle_gradient ? this.renderGradient() : this.renderNoGradient()}
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    borderRadius: Consts.round,
    overflow: "hidden",
  },
  nameNogradient: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
    justifyContent: "center",
    height: "50%",
    bottom: 0,
    zIndex: 9,
  },
  name: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    letterSpacing: 0.5,
    paddingLeft: 10,
    paddingVertical: 7,
  },
});
