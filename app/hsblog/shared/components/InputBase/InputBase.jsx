import React, { memo } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { View } from "../View/View";
import styles from './styles';
function defaultRenderProps() {
    return null;
}
function InputBaseComponent({ containerStyle, inputStyle, Left = defaultRenderProps, Right = defaultRenderProps, inputRef, ...otherProps }) {
    return (<View style={[styles.container, StyleSheet.flatten(containerStyle)]}>
      {Left}
      <TextInput {...otherProps} ref={inputRef} underlineColorAndroid="transparent" style={[styles.input, StyleSheet.flatten(inputStyle)]}/>
      <View style={styles.rightItem}>{Right}</View>
    </View>);
}
export const InputBase = memo(InputBaseComponent);
