import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { withViewStyles } from "../../shared";
function LinkBase({ children, activeOpacity = 1, style = {}, to, params, navigation, push, onBeforeNavigate, onAfterNavigate, }) {
    const _handlePress = useCallback(() => {
        onBeforeNavigate?.();
        if (!!push) {
            navigation?.push?.(push, params);
        }
        else {
            if (to === '../') {
                navigation.goBack();
            }
            else if (!!to) {
                navigation.navigate(to, params);
            }
        }
        onAfterNavigate?.();
    }, [navigation, onAfterNavigate, onBeforeNavigate, params, push, to]);
    return (<TouchableOpacity activeOpacity={activeOpacity} onPress={_handlePress} style={style}>
      {children}
    </TouchableOpacity>);
}
export default withNavigation(withViewStyles(LinkBase));
