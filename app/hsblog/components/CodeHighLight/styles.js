import { StyleSheet, Platform } from 'react-native';
const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 0,
        marginBottom: 10,
        ...(Platform.OS === 'android' ? {} : { maxHeight: 250 }),
        borderRadius: 4,
    },
});
export default styles;
