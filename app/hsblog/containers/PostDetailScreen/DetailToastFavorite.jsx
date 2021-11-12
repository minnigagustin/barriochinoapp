import React, { memo } from 'react';
import { View, Text, Icons } from "../../shared";
import i18n from "../../utils/functions/i18n";
const DetailToastFavorite = () => {
    return (<View tachyons={['flexRow', 'justifyBetween', 'itemsCenter', 'pa2']}>
      <Icons.FontAwesome name="heart" color="tertiary" size={20}/>
      <Text color="dark4">{i18n.t('addToFavorite')}</Text>
    </View>);
};
export default memo(DetailToastFavorite);
