import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ViewPropTypes } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import _ from "lodash";
import PropTypes from "prop-types";
import * as Const from "../../../constants/styleConstants";

export default class WilTab extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    indexActive: PropTypes.number.isRequired,
    tabBarStyles: ViewPropTypes.style,
    lazy: PropTypes.bool,
    renderLazyPlaceholder: PropTypes.func,
    renderItem: PropTypes.func,
    swipeEnabled: PropTypes.bool,
    onTabPress: PropTypes.func,
    colorPrimary: PropTypes.string,
  };

  _getNextItemWithIndex = (index) => {
    const { data } = this.props;
    return index + 1 < data.length
      ? data[index + 1]
      : { key: "", title: "", isFocused: false };
  };

  constructor(props) {
    super(props);
    this.state = {
      indexState: props.indexActive || 0,
    };
  }

  _handleChangeIndex = (index) => {
    this.setState({
      indexState: index,
    });
  };

  _handleTabPress = (scene) => {
    const { data, onTabPress } = this.props;
    const index = data.findIndex((i) => i.key === scene.route.key);
    const nextItem = this._getNextItemWithIndex(index);
    onTabPress && onTabPress(scene.route, nextItem, index);
  };

  _renderLabel = ({ route, focused }) => {
    const { colorPrimary } = this.props;
    return (
      <Text
        style={{
          color: focused ? colorPrimary : Const.colorDark,
          fontSize: 12,
          paddingHorizontal: 10,
        }}
      >
        {route.title}
      </Text>
    );
  };

  _renderTabbar = (props) => {
    const { colorPrimary, tabBarStyles } = this.props;
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={{ backgroundColor: colorPrimary }}
        style={styles.indicator}
        renderLabel={this._renderLabel}
        tabStyle={[styles.tabBar, tabBarStyles]}
        onTabPress={this._handleTabPress}
      />
    );
  };

  _renderScene = ({ route }) => {
    const { renderItem, data } = this.props;
    const indexFocused = this.state.indexState;
    const index = data.findIndex((item) => item.key === route.key);
    const nextItem = this._getNextItemWithIndex(index);
    return renderItem(route, nextItem, index, indexFocused);
  };

  render() {
    const {
      indexActive,
      data,
      lazy,
      renderLazyPlaceholder,
      swipeEnabled,
    } = this.props;
    const { indexState } = this.state;
    return (
      <TabView
        navigationState={{
          index: indexState,
          routes: data,
        }}
        renderTabBar={this._renderTabbar}
        renderScene={this._renderScene}
        renderLazyPlaceholder={renderLazyPlaceholder}
        onIndexChange={this._handleChangeIndex}
        lazy={lazy}
        swipeEnabled={swipeEnabled}
      />
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "transparent",
  },
  tabBar: {
    // width: "auto",
    paddingHorizontal: 10,
  },
});
