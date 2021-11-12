import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import convertFontIcon from "../../functions/convertFontIcon";

const FontIcon = (props) => {
  const renderFontaweSome = () => {
    if (/^(f|l)a\s/g.test(props.name)) {
      return (
        <FontAwesome
          name={props.name.replace(/^((f|l)a(s|b|)\s*|)(f|l)a(s|b|)-/g, "")}
          size={props.size}
          color={props.color}
        />
      );
    }
    return (
      <FontAwesome5
        name={props.name.replace(/^((f|l)a(s|b|)\s*|)(f|l)a(s|b|)-/g, "")}
        size={props.size}
        color={props.color}
      />
    );
  };
  return (
    <View style={props.style}>
      {props.name.search(/.*fa-/g) !== -1 || !convertFontIcon(props.name) ? (
        <View>
          {!/rutube|livejournal|bloglovin|map-pint|three-line|write|dollar/.test(
            props.name
          ) ? (
            renderFontaweSome()
          ) : (
            <Feather name="check" size={props.size} color={props.color} />
          )}
        </View>
      ) : (
        <Feather
          name={convertFontIcon(props.name)}
          size={props.size}
          color={props.color}
        />
      )}
    </View>
  );
};
FontIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};
export default FontIcon;
