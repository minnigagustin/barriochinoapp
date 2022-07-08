import React, { memo } from 'react';
import { Container, Button, Icons, Text } from "../../shared";
function FooterListComment({ isLoading, text, onReached }) {
    return (<Container>
      <Button backgroundColor="transparent" onPress={onReached} loadingColor="dark1" loading={isLoading} size="medium" tachyons={['mt2']}>
        <Icons.MaterialCommunityIcons name="replay" size={20} color="dark2"/>
        <Text type="h7" tachyons={['ph1']}>
          {text}
        </Text>
      </Button>
    </Container>);
}
export default memo(FooterListComment);
