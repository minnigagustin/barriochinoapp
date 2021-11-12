import { StyleSheet } from 'react-native';
import { fontWeightTitle } from "../../utils/constants/font";
export const tagsStaticStyles = {
    h1: {
        marginBottom: 10,
        fontSize: 30,
        ...fontWeightTitle,
        lineHeight: 36,
    },
    h2: {
        marginBottom: 10,
        fontSize: 26,
        ...fontWeightTitle,
        lineHeight: 32,
    },
    h3: {
        marginBottom: 10,
        fontSize: 24,
        ...fontWeightTitle,
        lineHeight: 29,
    },
    h4: {
        marginBottom: 10,
        fontSize: 22,
        ...fontWeightTitle,
        lineHeight: 26,
    },
    h5: {
        marginBottom: 10,
        fontSize: 18,
        ...fontWeightTitle,
        lineHeight: 24,
    },
    h6: {
        marginBottom: 10,
        fontSize: 16,
        ...fontWeightTitle,
        lineHeight: 22,
    },
    ul: {
        marginLeft: -15,
        marginTop: 4,
    },
    li: {
        marginTop: -2,
    },
    figcaption: {
        fontSize: 14,
        fontStyle: 'italic',
        opacity: 0.8,
        lineHeight: 20,
    },
};
export const styles = StyleSheet.create({
    blockquote: {
        borderLeftWidth: 2,
        paddingLeft: 10,
        marginVertical: 10,
    },
    blockquoteText: {
        opacity: 0.8,
        fontSize: 15,
    },
    image: {
        marginVertical: 10,
    },
    figcaption: {
        borderBottomWidth: 10,
        borderBottomColor: 'transparent',
    },
    heading: {
        marginBottom: 10,
    },
    headingText: {
        fontWeight: '400',
    },
});
