import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    placeholder: {
        zIndex: 9,
    },
    imageBg: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    iconWrap: {
        position: 'relative',
        zIndex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    icon: {
        marginLeft: 3,
    },
});
export default styles;
