import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    verticalContainer: {},
    horizontalContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    verticalContent: {},
    horizontalContent: {
        flex: 1,
        paddingHorizontal: 10,
    },
    content: {
        height: 8,
        marginBottom: 8,
    },
    borderRadius: {
        borderRadius: 6,
    },
});
export default styles;
