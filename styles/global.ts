import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const globalPadding = '5%';
export const globalPaddingX2 = '10%';

const globalStyles = StyleSheet.create({
    paddedPage: {
        paddingTop: 65,
        height: '100%',
        backgroundColor: Colors.white,
    },
    contentContainer: {
        fontFamily: 'Avenir',
        paddingHorizontal: globalPadding,
        backgroundColor: Colors.white,
        height: '100%',
        overflow: 'visible',
    },
    mainContainer: {
        fontFamily: 'Avenir',
        backgroundColor: Colors.white,
        height: '100%',
    },
    horizontalPadding: {
        paddingHorizontal: globalPadding,
        backgroundColor: Colors.white,
    },
    horizontalPaddingX2: {
        paddingHorizontal: globalPaddingX2,
        backgroundColor: Colors.white,
    },
});

export default globalStyles;
