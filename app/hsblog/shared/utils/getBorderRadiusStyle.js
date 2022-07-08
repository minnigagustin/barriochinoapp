import { StyleSheet } from 'react-native';
import { tachyonsStyles as tachyons } from "../themes/tachyons";
const styles = StyleSheet.create({
    br4: {
        borderRadius: 4,
    },
});
export default function getBorderRadiusStyle(borderRadius) {
    if (typeof borderRadius === 'number') {
        return {
            borderRadius,
        };
    }
    switch (borderRadius) {
        case 'round':
            return styles.br4;
        case 'pill':
            return tachyons.brPill;
        default:
            return {};
    }
}
