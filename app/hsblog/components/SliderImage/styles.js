import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {},
    dots: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    whiteCircle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        margin: 5,
    },
});
export default styles;
