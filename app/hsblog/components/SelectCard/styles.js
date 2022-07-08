import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    content: {
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
    },
    text: {
        position: 'relative',
        zIndex: 9,
        fontSize: 15,
        color: '#fff',
    },
    overlay: {
        zIndex: -1,
        backgroundColor: '#000',
        opacity: 0.5,
    },
    check: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        zIndex: 9,
    },
});
