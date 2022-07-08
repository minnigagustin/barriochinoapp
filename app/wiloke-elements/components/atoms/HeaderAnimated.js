import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import Animated from "react-native-reanimated";
import { withTransition } from "react-native-redash";

const { width, height } = Dimensions.get("window");
const FlatListAnim = Animated.createAnimatedComponent(FlatList);

const heightStatus = StatusBar.currentHeight;
const HEIGHT_HEADER = Platform.OS === "ios" ? 115 : 70 + heightStatus;

const index = () => {
  const data = [{ color: "red" }, { color: "yellow" }, { color: "blue" }];
  const y = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(y, 0, HEIGHT_HEADER);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }]);
  const transition = withTransition(diffClamp);
  const translateY = Animated.interpolate(transition, {
    inputRange: [0, HEIGHT_HEADER],
    outputRange: [0, -HEIGHT_HEADER],
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { height: HEIGHT_HEADER, transform: [{ translateY }] },
        ]}
      >
        <Text>Header</Text>
      </Animated.View>
      <FlatListAnim
        {...{ onScroll }}
        data={data}
        bounces={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item, index) => "List-" + index}
        renderItem={({ item, index }) => {
          return <View style={styles.listItem(item.color)} />;
        }}
      />
    </View>
  );
};
export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 1,
  },
  list: {
    alignItems: "center",
    paddingTop: HEIGHT_HEADER + 10,
  },
  listItem: (backgroundColor) => ({
    width: width / 1.2,
    height: height / 1.2,
    backgroundColor,
    marginBottom: 20,
  }),
});
