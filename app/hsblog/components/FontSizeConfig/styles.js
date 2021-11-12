import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    modalInner: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        opacity: 0.6,
    },
    content: {
        position: 'relative',
        zIndex: 9,
        padding: 5,
        borderRadius: 18,
        overflow: 'hidden',
    },
    contentInner: {
        overflow: 'hidden',
        borderRadius: 15,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        borderLeftWidth: 1,
    },
    border: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
});
