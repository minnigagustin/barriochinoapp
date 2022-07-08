import { Toast, Text, Icons, View } from "../../shared";
import React from 'react';
import { LayoutAnimation, Alert, UIManager } from 'react-native';
import i18n from "../../utils/functions/i18n";
import isIOS from "../../shared/utils/isIOS";
export const options = [i18n.t('copy'), i18n.t('reply'), i18n.t('cancel')];
export const options2 = [i18n.t('copy'), i18n.t('edit'), i18n.t('reply'), i18n.t('delete'), i18n.t('cancel')];
export const retryOptions = [i18n.t('tryAgain'), i18n.t('delete'), i18n.t('cancel')];
function notify({ status, message, nameIcon }) {
    switch (status) {
        case 'success':
            return Toast.show({
                content: (<View tachyons={['flexRow', 'justifyBetween', 'itemsCenter', 'pa2']}>
            <Icons.Feather name={nameIcon} color="dark4" size={20}/>
            <Text color="dark4" numberOfLines={2} style={{ width: '85%' }}>
              {message}
            </Text>
          </View>),
            });
        case 'failure':
            return Toast.show({
                content: (<View tachyons={['flexRow', 'justifyBetween', 'itemsCenter', 'pa2']}>
            <Icons.Feather name={'x'} color="dark4" size={20}/>
            <Text color="dark4" numberOfLines={2} style={{ width: '85%' }}>
              {message}
            </Text>
          </View>),
            });
        default:
            return null;
    }
}
function updateLayouAnimation() {
    LayoutAnimation.configureNext(LayoutAnimation.create(250, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.scaleXY));
}
function notifyDelete(onPress) {
    Alert.alert(i18n.t('deleteComment'), i18n.t('deleteConfirmComment'), [
        {
            text: i18n.t('cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        { text: i18n.t('ok'), onPress },
    ], { cancelable: false });
}
function alertAuthentication(onPress) {
    Alert.alert(i18n.t('loginRequired'), i18n.t('youMustLogin'), [
        {
            text: i18n.t('cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        { text: i18n.t('yes'), onPress },
    ], { cancelable: false });
}
function setUIManager() {
    if (!isIOS && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
export { notify, updateLayouAnimation, notifyDelete, alertAuthentication, setUIManager };
