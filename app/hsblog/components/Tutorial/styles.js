import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../shared/utils/screen";
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    slide: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        padding: 20,
    },
    body: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        borderRadius: 15,
    },
    content: {
        marginLeft: -1,
        marginRight: -1,
    },
});
export default styles;
