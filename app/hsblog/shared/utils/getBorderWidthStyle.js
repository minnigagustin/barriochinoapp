import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    bw1: {
        borderWidth: 1,
    },
    bw2: {
        borderWidth: 2,
    },
    bw3: {
        borderWidth: 4,
    },
});
export default function getBorderWidthStyle(borderWidth) {
    switch (borderWidth) {
        case 1:
            return styles.bw1;
        case 2:
            return styles.bw2;
        case 3:
        default:
            return styles.bw3;
    }
}
