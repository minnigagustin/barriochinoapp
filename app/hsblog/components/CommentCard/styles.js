import { StyleSheet } from 'react-native';
import { fontWeightTitle } from "../../utils/constants/font";
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    avatar: {
        marginRight: 10,
    },
    content: {
        minWidth: '50%',
    },
    descripText: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 17,
        position: 'relative',
    },
    bottom: {
        paddingTop: 5,
        paddingLeft: 5,
        maxWidth: 220,
    },
    ph5: {
        paddingHorizontal: 7,
    },
    reactionIcon: {
        borderRadius: 100,
        width: 20,
        height: 20,
    },
    reactionWrap: {
        elevation: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingHorizontal: 3,
        shadowRadius: 15,
        shadowColor: '#d6d6da',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
    },
    popoverContainer: {
        borderWidth: 1,
        borderColor: 'red',
    },
    error: {
        position: 'absolute',
        right: 0,
        top: 10,
        paddingHorizontal: 7,
    },
    highlight: {
        padding: 0,
        paddingVertical: 3,
    },
    mentionName: {
        ...fontWeightTitle,
        backgroundColor: 'transparent',
    },
});
export default styles;
