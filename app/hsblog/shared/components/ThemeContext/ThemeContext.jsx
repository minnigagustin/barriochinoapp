import React, { createContext, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import defaultColors from "../../themes/defaultColors";
import defaultSizes from "../../themes/defaultSizes";
import getDefaultStyles from "../../themes/getDefaultStyles";
import { ToastUI } from "../Toast/Toast";
import { ModalBaseUI } from "../ModalBase/ModalBase";
import getDisplayNameHOC from "../../utils/getDisplayNameHOC";
export const defaultTheme = {
    colors: defaultColors,
    sizes: defaultSizes,
    styled: getDefaultStyles(defaultColors),
    debug: false,
};
const ThemeContext = createContext(defaultTheme);
export function ThemeProvider({ themeOverrides = defaultTheme, children }) {
    const colors = { ...defaultColors, ...themeOverrides.colors };
    const sizes = { ...defaultSizes, ...themeOverrides.sizes };
    const styled = { ...getDefaultStyles(colors), ...themeOverrides.styled };
    const debug = themeOverrides.debug || false;
    return (<SafeAreaProvider>
      <ThemeContext.Provider value={{
        ...themeOverrides,
        colors,
        sizes,
        styled,
        debug,
    }}>
        {children}
        <ToastUI />
        <ModalBaseUI />
      </ThemeContext.Provider>
    </SafeAreaProvider>);
}
export const ThemeConsumer = ThemeContext.Consumer;
export function useTheme() {
    const theme = useContext(ThemeContext);
    return theme;
}
export function withTheme(Component) {
    const WithTheme = ({ ...rest }) => {
        const theme = useTheme();
        return <Component {...rest} theme={theme}/>;
    };
    WithTheme.displayName = `WithTheme ${getDisplayNameHOC(Component)}`;
    return WithTheme;
}
