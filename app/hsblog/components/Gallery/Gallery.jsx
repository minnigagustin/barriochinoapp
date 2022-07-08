import React, { useState, memo } from 'react';
import { Image, FlatList, View, withViewStyles, HeaderBase, Text, Icons } from "../../shared";
import { Modal, TouchableOpacity as RNTouchableOpacity, ActivityIndicator, StatusBar, } from 'react-native';
import { tachyonsStyles } from "../../shared/themes/tachyons";
import { styles } from './styles';
const TouchableOpacity = withViewStyles(RNTouchableOpacity);
const Gallery = ({ data, onClose, ...rest }) => {
    const [indexImagesLoaded, setIndexImagesLoaded] = useState([]);
    const [indexActive, setIndexActive] = useState(0);
    const handleImageLoad = (index) => () => {
        setIndexImagesLoaded(indexImagesLoaded => [...indexImagesLoaded, index]);
    };
    const handleDragEnd = (event) => {
        if (!!event.nativeEvent?.contentOffset) {
            const indexActive = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
            setIndexActive(indexActive);
        }
    };
    const handleClose = () => {
        onClose?.();
    };
    const renderGalleryItem = ({ item, index }) => {
        return (<View style={styles.item} tachyons={['justifyCenter', 'itemsCenter']}>
        {!indexImagesLoaded.includes(index) && <ActivityIndicator size="small"/>}
        <Image uri={item.uri} width="100%" height="100%" resizeMode="contain" containerStyle={{
            ...tachyonsStyles.bgTransparent,
            opacity: indexImagesLoaded.includes(index) ? 1 : 0,
        }} onLoad={handleImageLoad(index)}/>
      </View>);
    };
    return (<Modal {...rest} animationType="slide" onDismiss={() => {
        setIndexActive(0);
    }} onRequestClose={handleClose}>
      <View flex safeAreaView style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View flex tachyons={['relative']}>
          <View tachyons={['absolute', 'top0', 'left0', 'right0', 'z1']}>
            <HeaderBase Left={<Text colorNative="#eee">
                  {indexActive + 1} / {data.length}
                </Text>} Right={<TouchableOpacity activeOpacity={0.7} tachyons="pa1" onPress={handleClose}>
                  <Icons.Feather name="x" size={25} colorNative="#eee"/>
                </TouchableOpacity>} backgroundColor="transparent"/>
          </View>
          <FlatList data={data} keyExtractor={item => String(item.id)} horizontal pagingEnabled initialNumToRender={2} showsHorizontalScrollIndicator={false} renderItem={renderGalleryItem} onMomentumScrollEnd={handleDragEnd}/>
        </View>
      </View>
    </Modal>);
};
export default memo(Gallery);
