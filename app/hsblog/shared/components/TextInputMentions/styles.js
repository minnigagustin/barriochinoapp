import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
    },
    input: {
        padding: 10,
        fontSize: 14,
        lineHeight: 20,
    },
    inputImportant: {
        color: 'transparent',
        backgroundColor: 'transparent',
    },
    inputFakeImportant: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
});
export default styles;
