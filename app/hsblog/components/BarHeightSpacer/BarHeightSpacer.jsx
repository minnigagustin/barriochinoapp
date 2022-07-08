import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bottomBarHeight } from "../../utils/constants/base";
const styles = StyleSheet.create({
    container: {
        height: bottomBarHeight,
    },
});
const BarHeightSpacer = () => {
    return <View style={styles.container}></View>;
};
export default BarHeightSpacer;
