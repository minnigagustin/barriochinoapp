import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    popoverOuter: {
        position: 'absolute',
        zIndex: 10,
    },
    underlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9,
    },
    popover: {
        paddingTop: 10,
    },
    popoverInner: {},
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },
});
