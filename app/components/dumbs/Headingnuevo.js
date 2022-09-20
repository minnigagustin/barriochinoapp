import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import _ from "lodash";
import Obteneridioma from "../../utils/traducir"
import { RTL } from "../../wiloke-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';

import he from "he";

export default class Headingnuevo extends PureComponent {
  state = {
    idioma: ""
  };
  componentDidMount() {
    AsyncStorage.getItem('idioma').then((value) => {
      if(value){
     this.setState({ idioma: value });
    }
      });
  }
  render() {
    const rtl = RTL();

    const titleStyles = {
      fontSize: this.props.titleSize,
      fontWeight: "bold",
      color: this.props.titleColor,
      textAlign: rtl ? "left" : "auto",
    };
    const textStyles = {
      fontSize: this.props.textSize,
      color: this.props.textColor,
      textAlign: rtl ? "left" : "auto",
    };
    console.log(this.props);
    const verlen = this.state.idioma === 'zh-hans' ? '见' : 'Ver';
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '98%'}}>

        <Text
          style={[stylesBase.h6, titleStyles]}
          numberOfLines={this.props.titleNumberOfLines}
        >
          {he.decode(this.props.title.replace(":apos:", "'"))}
        </Text>
        {!_.isEmpty(this.props.text) && (
         <TouchableOpacity
         style={
           { justifyContent: "center",
         alignItems: "center",
         flexDirection: "row",
         height: 30,
         borderRadius: 3, backgroundColor: 'black', width: '30%'}
         }
         activeOpacity={0.7}

          onPress={() => {
           const { navigation } = this.props;
           console.log(this.props.text);
           navigation.navigate("ListingCategories", {
             categoryId: this.props.text,
             subcategories: 'sf',
             name: he.decode(this.props.title.replace(":apos:", "'")),
             taxonomy: 'listing_cat',
             endpointAPI: 'list/listings',
           });
               }}
       >

         <Text style={{fontSize: 13,
         fontWeight: "bold",
         color: "#fff",}}>{verlen} +</Text>
       </TouchableOpacity>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 0,
  },
});

Headingnuevo.propTypes = {
  titleSize: PropTypes.number,
  textSize: PropTypes.number,
  mb: PropTypes.number,
  textNumberOfLines: PropTypes.number,
  titleNumberOfLines: PropTypes.number,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  align: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
};

Headingnuevo.defaultProps = {
  titleSize: 24,
  titleColor: Consts.colorDark1,
  textSize: 12,
  textColor: Consts.colorDark3,
};
