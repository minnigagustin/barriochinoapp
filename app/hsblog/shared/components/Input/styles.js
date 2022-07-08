import { StyleSheet } from 'react-native';
import isIOS from "../../utils/isIOS";
const styles = StyleSheet.create({
    input: {
        paddingVertical: isIOS ? 13 : 7,
    },
    hasLeft: {
        paddingLeft: 0,
    },
    hasRight: {
        paddingRight: 0,
    },
    right: {
        marginRight: -7,
    },
    iconX: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    borderBottom: {
        borderWidth: 0,
        borderBottomWidth: 1,
    },
});
export default styles;
