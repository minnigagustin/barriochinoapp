import React, { memo, useState } from 'react';
import { Modal, Linking, Image as RNImage, TouchableOpacity as RNTouchableOpacity, StatusBar } from 'react-native';
import { useMount, Button, View, Text, withViewStyles, Icons } from "../../shared";
import Constants from 'expo-constants';
import isIOS from "../../shared/utils/isIOS";
import IconBox from "../IconBox/IconBox";
import isAndroid from "../../shared/utils/isAndroid";
const Image = withViewStyles(RNImage);
const TouchableOpacity = withViewStyles(RNTouchableOpacity);
const ModalAppUpdate = ({ text, buttonUpdateText, moreText, nextVersion, simulator = false, iosStore, androidStore }) => {
    const [visible, setVisible] = useState(false);
    const { name: appName, version } = Constants.manifest;
    const versionToNumber = (version) => Number(version.replace(/\./g, ''));
    const handleNeedUpdate = async () => {
        if (!!version && versionToNumber(nextVersion) > versionToNumber(version)) {
            setVisible(true);
        }
    };
    const handleUpdate = () => {
        const url = isAndroid ? androidStore : iosStore;
        if (!!url) {
            Linking.openURL(url);
        }
    };
    const handleClose = () => {
        setVisible(false);
    };
    useMount(() => {
        if (!__DEV__ || simulator) {
            handleNeedUpdate();
        }
    });
    return (<Modal visible={visible} animationType="slide">
      <StatusBar barStyle="dark-content"/>
      <View tachyons={['flex', 'relative']} safeAreaView>
        <View alignItems="flex-end" tachyons={['ph3', 'pv1']}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleClose}>
            <IconBox name="x" backgroundColor="dark1" color="light"/>
          </TouchableOpacity>
        </View>
        <View tachyons={['flex', 'justifyCenter', 'pa3']} backgroundColor="light">
          <View tachyons={['itemsCenter']}>
            <Text type="h3" tachyons="mb3" color="dark1">
              {appName} {nextVersion}
            </Text>
            <Text tachyons="tc">{text}</Text>
          </View>
          <Image source={require('../../../../assets/update.jpg')} tachyons={['w100', 'h50']} resizeMode="contain"/>
          <Button block size="medium" borderRadius="round" backgroundColor="dark1" onPress={handleUpdate}>
            <View tachyons="mr2">
              <Icons.FontAwesome5 name={isIOS ? 'apple' : 'android'} size={18} colorNative="#fff"/>
            </View>
            <Text colorNative="#fff">{buttonUpdateText}</Text>
          </Button>
          <TouchableOpacity activeOpacity={0.8} onPress={handleUpdate} tachyons="pa3">
            <Text color="dark2" tachyons="tc">
              {moreText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>);
};
export default memo(ModalAppUpdate);
