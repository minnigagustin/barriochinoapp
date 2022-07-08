import React from 'react';
import { View, Text, Icons } from "../../shared";
import styles from './styles';
export default function Reaction({ countLike, nameIcon = 'heart', containerStyle }) {
    return (<View flexDirection="row" alignItems="center" justifyContent="center" style={[containerStyle, styles.reactionWrap]} backgroundColor="light">
      <View backgroundColor="primary" alignItems="center" justifyContent="center" style={styles.reactionIcon}>
        <Icons.Feather name={nameIcon} size={12} color="light"/>
      </View>
      <Text color="dark3" type="small" style={{ paddingHorizontal: 3 }}>
        {countLike}
      </Text>
    </View>);
}
