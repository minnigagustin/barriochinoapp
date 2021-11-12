import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'space-between',
        marginVertical: 10,
        borderBottomWidth: 2,
        paddingBottom: 4,
    },
    divider: {
        position: 'absolute',
        left: 0,
        bottom: -2,
        zIndex: 9,
        height: 2,
        width: 60,
    },
});
export default styles;
