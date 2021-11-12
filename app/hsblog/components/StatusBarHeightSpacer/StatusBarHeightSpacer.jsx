import React from 'react';
import { View, StyleSheet } from 'react-native';
import { statusBarHeight } from "../../utils/constants/base";
const styles = StyleSheet.create({
    container: {
        height: statusBarHeight,
    },
});
const StatusBarHeightSpacer = () => {
    return <View style={styles.container}></View>;
};
export default StatusBarHeightSpacer;
