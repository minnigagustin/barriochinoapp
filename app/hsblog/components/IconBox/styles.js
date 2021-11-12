import { StyleSheet } from 'react-native';
const MEDIUM = 34;
const SMALL = 28;
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    medium: {
        width: MEDIUM,
        height: MEDIUM,
        borderRadius: MEDIUM / 2,
    },
    small: {
        width: SMALL,
        height: SMALL,
        borderRadius: SMALL / 2,
    },
});
export default styles;
