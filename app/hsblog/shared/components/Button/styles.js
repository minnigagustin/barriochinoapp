import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
    },
    touchable: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    inner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    extraSmall: {
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
    small: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    medium: {
        paddingVertical: 13,
        paddingHorizontal: 16,
    },
    large: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
});
export default styles;
