import { StyleSheet } from 'react-native';
const getColPercent = (col) => `${(100 * col) / 6}%`;
const styles = StyleSheet.create({
    col6: {
        width: getColPercent(6),
    },
    col5: {
        width: getColPercent(5),
    },
    col4: {
        width: getColPercent(4),
    },
    col3: {
        width: getColPercent(3),
    },
    col2: {
        width: getColPercent(2),
    },
    col1: {
        width: getColPercent(1),
    },
    empty: {},
});
export default function getColumnStyle(column) {
    switch (column) {
        case '1/6':
            return styles.col1;
        case '2/6':
            return styles.col2;
        case '3/6':
            return styles.col3;
        case '4/6':
            return styles.col4;
        case '5/6':
            return styles.col5;
        case '6/6':
            return styles.col6;
        default:
            return styles.empty;
    }
}
