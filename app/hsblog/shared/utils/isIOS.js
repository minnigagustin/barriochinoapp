import { Platform } from 'react-native';
import { SCREEN_HEIGHT } from './screen';
const isIOS = Platform.OS === 'ios';
const PlatformIOS = Platform;
export const isIpad = PlatformIOS.isPad;
export const isSmallDevice = SCREEN_HEIGHT < 750;
export default isIOS;
