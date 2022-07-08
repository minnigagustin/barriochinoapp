import React, { useRef } from 'react';
import { Modal, FlatList, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { View, Text, withViewStyles, Icons } from "../../shared";
import i18n from "../../utils/functions/i18n";
import IconBox from "../IconBox/IconBox";
import styles from './styles';
const TouchableOpacity = withViewStyles(RNTouchableOpacity);
function Tutorial({ visible, data, renderItem, setText, onDone, ...rest }) {
    const listRef = useRef(null);
    const handleClose = () => {
        onDone?.();
    };
    const handleNavigate = (num) => () => {
        if (!data) {
            return;
        }
        if (num === data.length) {
            onDone?.();
        }
        else {
            listRef.current?.scrollToIndex({
                animated: true,
                index: num,
            });
        }
    };
    return (<Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
      <View style={styles.container}>
        <FlatList ref={listRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} data={data} renderItem={({ item, index, separators }) => {
        return (<View style={styles.slide} tachyons={['justifyCenter', 'itemsCenter']}>
                <View style={styles.body}>
                  <View tachyons={['flexRow', 'justifyBetween', 'itemsCenter', 'pa2']}>
                    <View>
                      <Text type="h7">{i18n.t('tutorial')}</Text>
                      <Text type="small">{setText?.(item)}</Text>
                    </View>
                    <TouchableOpacity onPress={handleClose}>
                      <IconBox name="x" size="small" backgroundColor="gray2"/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.content}>{renderItem?.({ item, index, separators })}</View>
                  <View tachyons={['flexRow', 'justifyEnd', 'itemsCenter', 'pa2']}>
                    {index > 0 && (<TouchableOpacity onPress={handleNavigate(index - 1)} tachyons={['ph2', 'pv1', 'flexRow', 'justifyCenter', 'itemsCenter']}>
                        <View tachyons="pr1">
                          <Icons.Feather name="arrow-left" color="dark3"/>
                        </View>
                        <Text color="dark3">{i18n.t('prev')}</Text>
                      </TouchableOpacity>)}
                    <TouchableOpacity onPress={handleNavigate(index + 1)} tachyons={['ph2', 'pv1', 'flexRow', 'justifyCenter', 'itemsCenter']}>
                      <Text color="primary">{i18n.t('next')}</Text>
                      <View tachyons="pl1">
                        <Icons.Feather name="arrow-right" color="primary"/>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>);
    }} {...rest}/>
      </View>
    </Modal>);
}
export default Tutorial;
