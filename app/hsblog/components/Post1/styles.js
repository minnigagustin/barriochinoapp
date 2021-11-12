import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    default: {
        paddingTop: 10,
    },
    creative: {
        padding: 10,
        marginHorizontal: 10,
        marginTop: -20,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        marginTop: -3,
    },
    imageRounded: {
        borderRadius: 6,
    },
});
export default styles;
