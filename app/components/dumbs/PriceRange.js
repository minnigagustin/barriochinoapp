import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import he from "he";
import { RTL } from "../../wiloke-elements";

const PriceRange = (props) => {
  const { data } = props;
  return (
    <View style={styles.container}>
      <Text style={{ color: props.colorPrimary, fontSize: 26 }}>
        {data.currencyPos === "right"
          ? data.minPrice + he.decode(data.currencySymbol)
          : he.decode(data.currencySymbol) + data.minPrice}
      </Text>
      <Feather
        name={!RTL() ? "arrow-right" : "arrow-left"}
        size={20}
        color={props.colorPrimary}
      />
      <Text style={{ color: props.colorPrimary, fontSize: 26 }}>
        {data.currencyPos === "right"
          ? data.maxPrice + he.decode(data.currencySymbol)
          : he.decode(data.currencySymbol) + data.maxPrice}
      </Text>
    </View>
  );
};
PriceRange.propTypes = {
  data: PropTypes.object,
  colorPrimary: PropTypes.string,
};
PriceRange.defaultProps = {
  colorPrimary: Consts.colorPrimary,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PriceRange;
