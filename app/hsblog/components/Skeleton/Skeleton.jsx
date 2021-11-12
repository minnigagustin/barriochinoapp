import React, { PureComponent } from 'react';
import { ThemeConsumer, View } from "../../shared";
import styles from './styles';
export default class Skeleton extends PureComponent {
    constructor() {
        super(...arguments);
        this._renderImage = (styled) => {
            const { imagePercentRatio, type, imageSizeForTypeHorizontal, imageRounded } = this.props;
            return (<View style={[
                styled.bgGray2,
                imageRounded ? styles.borderRadius : {},
                type === 'vertical'
                    ? {
                        paddingTop: imagePercentRatio,
                    }
                    : {
                        width: imageSizeForTypeHorizontal,
                        height: imageSizeForTypeHorizontal,
                    },
                ,
            ]}></View>);
        };
        this._renderContent = () => {
            const { type } = this.props;
            return (<View tachyons="mt2" style={styles[`${type}Content`]}>
        <View backgroundColor="gray2" tachyons="w80" style={styles.content}></View>
        <View backgroundColor="gray2" tachyons="w60" style={styles.content}></View>
        <View backgroundColor="gray2" tachyons="w40" style={styles.content}></View>
      </View>);
        };
    }
    render() {
        const { image, content, type, containerStyle } = this.props;
        return (<View style={containerStyle}>
        <ThemeConsumer>
          {({ styled }) => (<View style={styles[`${type}Container`]}>
              {image && this._renderImage(styled)}
              {content && this._renderContent()}
            </View>)}
        </ThemeConsumer>
      </View>);
    }
}
Skeleton.defaultProps = {
    image: false,
    content: false,
    imagePercentRatio: '56.25%',
    type: 'vertical',
    imageSizeForTypeHorizontal: 70,
    containerStyle: {},
    imageRounded: false,
};
