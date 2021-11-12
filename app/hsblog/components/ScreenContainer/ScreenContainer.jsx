import React, { memo } from 'react';
import { View, OfflineNotice } from "../../shared";
import { StatusBar } from 'react-native';
import i18n from "../../utils/functions/i18n";
const ScreenContainer = ({ safeAreaView = false, safeAreaViewBottom = false, children, Header, onMount }) => {
    return (<View flex onMount={onMount} safeAreaView={safeAreaView} safeAreaViewBottom={safeAreaViewBottom} backgroundColor="light">
      <StatusBar />
      {Header}
      <OfflineNotice>{i18n.t('noInternet')}</OfflineNotice>
      {children}
    </View>);
};
export default memo(ScreenContainer);
