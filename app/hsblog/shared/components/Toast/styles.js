import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    // container: {
    //   ...StyleSheet.absoluteFillObject,
    //   zIndex: 1000,
    //   borderWidth: 3,
    // },
    // inner: {
    //   position: 'relative',
    //   marginVertical: 10,
    // },
    container: {
        position: 'absolute',
        left: 10,
        right: 10,
        zIndex: 1000,
    },
    toastInner: {
        padding: 5,
        borderRadius: 5,
    },
});
