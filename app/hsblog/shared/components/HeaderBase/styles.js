import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 54,
        paddingHorizontal: 16,
    },
    item: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    left: {
        justifyContent: 'flex-start',
    },
    center: {
        flexGrow: 1.5,
    },
    right: {
        justifyContent: 'flex-end',
    },
    hasCenter: {
        flexBasis: 1,
    },
    debug: {
        borderWidth: 2,
        borderColor: 'red',
    },
});
export default styles;
