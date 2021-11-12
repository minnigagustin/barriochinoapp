"use strict";
// import React, { useState, memo, useEffect, useRef } from 'react';
// import { View, Image, ImageProps, useMount, useUnmount } from 'shared';
// import { SCREEN_WIDTH } from 'shared/utils/screen';
// import { ViewStyle, StyleProp, NativeSyntheticEvent, NativeScrollEvent, FlatList, FlatListProps } from 'react-native';
// import styles from './styles';
// interface Image {
//   uri: string;
// }
// export interface GalleryProps<ItemT> extends FlatListProps<ItemT> {
//   images: Image[];
//   initialIndex?: number;
//   autoPlay?: boolean;
//   timeInterval?: number;
//   onChangeIndex?: (index: number) => void;
//   imageProps?: ImageProps;
//   gap?: number;
//   style?: StyleProp<ViewStyle>;
//   enablePaging?: boolean;
// }
// let play: NodeJS.Timeout;
// function SliderImage<ItemT>({
//   images,
//   initialIndex = 0,
//   style,
//   autoPlay = false,
//   timeInterval = 1000,
//   imageProps,
//   gap = 0,
//   enablePaging = true,
// }: GalleryProps<ItemT>) {
//   const [selectedIndex, setSelectedIndex] = useState(initialIndex);
//   const [gapImage, setGap] = useState(gap);
//   const listRef = useRef<FlatList<ItemT>>(null);
//   useMount(() => {
//     if (enablePaging) {
//       setGap(0);
//     }
//     if (autoPlay) {
//       play = setInterval(() => {
//         console.log('runninng');
//         setSelectedIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
//       }, timeInterval);
//     }
//   });
//   useEffect(() => {
//     if (autoPlay) {
//       listRef.current?.scrollToOffset({
//         offset: SCREEN_WIDTH * selectedIndex,
//         animated: true,
//       });
//     }
//   }, [selectedIndex, autoPlay]);
//   useUnmount(() => {
//     clearInterval(play);
//   });
//   const _renderImageItem = ({ item }: { item: Image }) => {
//     return (
//       <View style={{ width: SCREEN_WIDTH - gapImage }}>
//         <Image uri={item.uri} preview={item.uri} percentRatio="75%" {...imageProps} width="100%" />
//       </View>
//     );
//   };
//   const _renderDotItem = ({ index }: { index: number }) => {
//     return (
//       <View style={[styles.whiteCircle, { opacity: index === selectedIndex ? 0.5 : 1, backgroundColor: index === selectedIndex ? 'red' : '#fff' }]} />
//     );
//   };
//   const _changeIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     if (!enablePaging) {
//       return;
//     }
//     const contentOffset = event.nativeEvent.contentOffset;
//     const viewSize = event.nativeEvent.layoutMeasurement;
//     const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
//     setSelectedIndex(selectedIndex);
//   };
//   return (
//     <View style={style}>
//       <FlatList
//         data={images}
//         keyExtractor={(_, index) => index.toString() + 'galleryImage'}
//         renderItem={_renderImageItem}
//         horizontal={true}
//         scrollEventThrottle={16}
//         pagingEnabled={true}
//         decelerationRate={0.99}
//         snapToInterval={SCREEN_WIDTH}
//         onMomentumScrollEnd={_changeIndex}
//         ref={listRef}
//       />
//       {enablePaging && (
//         <View
//           style={[
//             styles.dots,
//             {
//               marginLeft: -(images.length * 2 * 10) / 2,
//             },
//           ]}
//         >
//           <FlatList data={images} keyExtractor={(_, index) => index.toString() + 'galleryImage'} renderItem={_renderDotItem} horizontal={true} />
//         </View>
//       )}
//     </View>
//   );
// }
// export default memo(SliderImage);
