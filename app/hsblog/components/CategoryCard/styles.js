import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    text: {
        padding: 10,
    },
});
export default styles;
