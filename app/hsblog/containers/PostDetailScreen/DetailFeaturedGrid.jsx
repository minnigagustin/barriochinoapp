import React, { memo, useState } from 'react';
import { View, Image, Icons, withViewStyles } from "../../shared";
import { isEmpty } from 'ramda';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import Gallery from "../../components/Gallery/Gallery";
const TouchableOpacity = withViewStyles(RNTouchableOpacity);
const DetailFeaturedGrid = ({ data }) => {
    const [isGalleryVisible, setGalleryVisible] = useState(false);
    console.log({ data });
    if (isEmpty(data)) {
        return null;
    }
    const item1 = data[0]?.imageSize?.medium;
    const item2 = data[1]?.imageSize?.thumbnail;
    const item3 = data[2]?.imageSize?.thumbnail;
    const item4 = data[3]?.imageSize?.thumbnail;
    const item5 = data[4]?.imageSize?.thumbnail;
    const handleGalleryVisible = () => {
        setGalleryVisible(!isGalleryVisible);
    };
    const renderImage = (uri, ratio = '100%') => {
        return (<View tachyons="relative" style={{ paddingTop: ratio }}>
        <View tachyons={['absolute', 'absoluteFill', 'pa1']}>
          <Image uri={uri} tachyons={['br3', 'absolute', 'z1']} height="100%"/>
        </View>
      </View>);
    };
    const renderRight = () => {
        if (!!item5) {
            return (<View column="3/6" tachyons={['flexRow', 'flexWrap']}>
          <View column="3/6">{renderImage(item2)}</View>
          <View column="3/6">{renderImage(item3)}</View>
          <View column="3/6">{renderImage(item4)}</View>
          <View column="3/6">
            {renderImage(item5)}
            {data.length > 5 && (<View tachyons={['absolute', 'absoluteFill', 'pa1']}>
                <View flex backgroundColor="primary" tachyons={['br3', 'o80']}/>
                <View tachyons={['absolute', 'absoluteFill', 'itemsCenter', 'justifyCenter']}>
                  <Icons.Feather name="plus" size={30} color="light"/>
                </View>
              </View>)}
          </View>
        </View>);
        }
        if (!!item4) {
            return (<View column="3/6" tachyons={['flexRow', 'flexWrap']}>
          <View column="6/6">{renderImage(item2, '50%')}</View>
          <View column="3/6">{renderImage(item3)}</View>
          <View column="3/6" tachyons="relative">
            {renderImage(item4)}
          </View>
        </View>);
        }
        if (!!item3) {
            return (<View column="3/6">
          {renderImage(item2, '50%')}
          {renderImage(item3, '50%')}
        </View>);
        }
        if (!!item2) {
            return <View column="3/6">{renderImage(item2)}</View>;
        }
        return null;
    };
    return (<>
      <TouchableOpacity activeOpacity={1} tachyons="mb3" onPress={handleGalleryVisible}>
        <View tachyons={['flexRow', 'na1']}>
          <View column={!!item2 ? '3/6' : '6/6'}>{renderImage(item1, !!item2 ? '100%' : '56.25%')}</View>
          {renderRight()}
        </View>
      </TouchableOpacity>
      <Gallery visible={isGalleryVisible} data={data.map(item => ({ id: item.attachmentId, uri: item.imageSize.large }))} onClose={handleGalleryVisible}/>
    </>);
};
export default memo(DetailFeaturedGrid);
