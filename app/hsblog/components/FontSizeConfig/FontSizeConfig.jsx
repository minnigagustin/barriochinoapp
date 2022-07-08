import React from 'react';
import { View, useToggle, useTheme, useAnimated } from "../../shared";
import { Modal, TouchableOpacity, Animated } from 'react-native';
import IconA from "../IconA/IconA";
import { styles } from './styles';
const SIZES = ['small', 'medium', 'large'];
const FontSizeConfig = ({ style = {}, onChange, fontSizeSelected }) => {
    const [visible, onVisible] = useToggle(false);
    const { colors, styled } = useTheme();
    const [animate, onAnimated] = useAnimated({ toValue: 100 });
    const scale = animate.interpolate({
        inputRange: [0, 100],
        outputRange: [0.3, 1],
        extrapolate: 'clamp',
    });
    const handleContentPress = () => {
        onVisible();
        onAnimated();
    };
    return (<View style={style}>
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onVisible}>
        <View flex justifyContent="center" alignItems="center" style={styles.modalInner}>
          <TouchableOpacity activeOpacity={1} style={[styles.overlay, styled.bgDark1]} onPress={onVisible}/>
          <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
            <View style={[styles.border, styled.bgLight]}/>
            <View flexDirection="row" style={[styles.contentInner, styled.bgLight]}>
              {SIZES.map((item, index) => {
        return (<TouchableOpacity key={item} activeOpacity={0.7} onPress={() => {
            onChange?.(item);
            onVisible();
        }} style={[styles.icon, { borderColor: index === 0 ? 'transparent' : colors.gray1 }]}>
                    <IconA size={item} color={fontSizeSelected === item ? 'primary' : 'dark2'}/>
                  </TouchableOpacity>);
    })}
            </View>
          </Animated.View>
        </View>
      </Modal>
      <TouchableOpacity activeOpacity={0.7} onPress={handleContentPress}>
        <IconA />
      </TouchableOpacity>
    </View>);
};
export default FontSizeConfig;
