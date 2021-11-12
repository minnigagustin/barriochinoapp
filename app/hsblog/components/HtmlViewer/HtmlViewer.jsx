import React, { PureComponent, Fragment } from 'react';
import HTML from 'react-native-render-html';
import { decode } from 'he';
import { WebView } from 'react-native-webview';
import { Image, View, Text, withTheme } from "../../shared";
import deepLinking from "../../utils/functions/deepLinking";
import CodeHighLight from "../CodeHighLight/CodeHighLight";
import CompareImage from "../CompareImage/CompareImage";
import { isEmpty } from 'ramda';
import { SCREEN_WIDTH } from "../../shared/utils/screen";
import i18n from "../../utils/functions/i18n";
import YtbAndVimeoVideo from "../YtbAndVimeoVideo/YtbAndVimeoVideo";
import isClassHtml from "../../utils/functions/checkClass";
import MenuRestaurant from "../Restaurant/MenuRestaurant";
import isIOS from "../../shared/utils/isIOS";
import { tagsStaticStyles, styles } from './styles';
const CONTAINER_PADDING = 10;
class HtmlViewer extends PureComponent {
    constructor() {
        super(...arguments);
        this.handleLinkPress = (_event, href) => {
            deepLinking(href);
        };
        this.getHTML = () => {
            const { html } = this.props;
            return html.replace(/<p><\/p>|\s*(font-family|font-weight)\s*:\s*.+?\s*;\s*/g, '');
        };
        this.renderBlockquote = (_attr, children, _convertedCSSStyles, passProps) => {
            const { theme } = this.props;
            return (<View key={passProps.key} style={[styles.blockquote, { borderLeftColor: theme?.colors.primary }]}>
        {isIOS ? <Text style={styles.blockquoteText}>{children}</Text> : children}
      </View>);
        };
        this.renderImage = (attr, _children, _convertedCSSStyles, passProps) => {
            const { imageLoading } = this.props;
            return <Image key={passProps.key} uri={attr.src} containerStyle={styles.image} loading={imageLoading}/>;
        };
        this.renderFigure = (_attr, children, _convertedCSSStyles, passProps) => {
            return (<View key={passProps.key} tachyons="mb1">
        {children}
      </View>);
        };
        this.renderFigcaption = (_attr, children, _convertedCSSStyles, passProps) => {
            return (<Text key={passProps.key} style={styles.figcaption}>
        {children}
      </Text>);
        };
        this.renderCodeHighLight = (attr, passProps) => {
            if (!attr['data-children']) {
                return null;
            }
            const language = attr['data-language'];
            const code = decode(attr['data-children']);
            return (<CodeHighLight key={passProps.key} language={language}>
        {code}
      </CodeHighLight>);
        };
        this.renderRestaurant = (attr, passProps) => {
            const dataItems = JSON.parse(attr['data-items']);
            const menus = Object.keys(dataItems).map(key => {
                return dataItems[key];
            });
            return (<Fragment key={passProps.key}>
        <MenuRestaurant menus={menus}/>
      </Fragment>);
        };
        this.renderDiv = (attr, children, _convertedCSSStyles, passProps) => {
            if (isClassHtml(attr, 'react-compare-image')) {
                // const { containerMaxWidth } = this.props;
                const beforeImageUri = attr['data-image-before'];
                const afterImageUri = attr['data-image-after'] || beforeImageUri;
                const beforeText = attr['data-before-caption'] || i18n.t('before');
                const afterText = attr['data-after-caption'] || i18n.t('after');
                return (<CompareImage key={passProps.key} beforeImageUri={beforeImageUri} afterImageUri={afterImageUri} beforeText={beforeText} afterText={afterText}/>);
            }
            if (isClassHtml(attr, 'react-video-popup')) {
                const videoSrc = attr['data-src'];
                return <YtbAndVimeoVideo key={passProps.key} uri={videoSrc}/>;
            }
            if (isClassHtml(attr, 'wil-restaurant-block')) {
                return this.renderRestaurant(attr, passProps);
            }
            if (isClassHtml(attr, 'react-code-highlight')) {
                return this.renderCodeHighLight(attr, passProps);
            }
            return children;
        };
        this.renderIframe = (attr, _children, _convertedCSSStyles, passProps) => {
            const { containerMaxWidth } = this.props;
            if (!attr.src) {
                return null;
            }
            return (<WebView key={passProps.key} javaScriptEnabled domStorageEnabled source={{
                uri: `${attr.src}${attr.src.includes('?') ? '&' : '?'}autoplay=0`,
            }} style={{
                marginLeft: -CONTAINER_PADDING,
                width: containerMaxWidth,
                height: (9 * (containerMaxWidth ?? SCREEN_WIDTH)) / 16,
            }}/>);
        };
    }
    // _renderGallaryGrid = (
    //   attr: AttrType,
    //   children: ChildrenType,
    //   _convertedCSSStyles: CSSProperties,
    //   passProps: PassPropsType,
    // ) => {
    //   // console.log(attr, children);
    //   if (attr.class !== 'blocks-gallery-item') {
    //     return children;
    //   }
    //   return children;
    // };
    render() {
        const { htmlWrapCssString, containerMaxWidth, containerStyle, justifyTextEnabled, tagsStyles, theme, colorBase, ...otherProps } = this.props;
        const textJustifyStyle = justifyTextEnabled
            ? `
    text-align: justify;
    text-justify: inter-word;`
            : '';
        const _htmlWrapCssString = `
      font-size: ${isEmpty(tagsStyles) ? '15' : tagsStyles?.text.fontSize}px;
      line-height: ${isEmpty(tagsStyles) ? '1.6em' : tagsStyles?.text.lineHeight};
      color: ${colorBase || theme?.colors.dark2};
    ` +
            textJustifyStyle +
            htmlWrapCssString;
        return (<HTML {...otherProps} html={`<div style="${_htmlWrapCssString}">${this.getHTML()}</div>`} imagesMaxWidth={containerMaxWidth} containerStyle={containerStyle} renderers={{
            blockquote: this.renderBlockquote,
            img: this.renderImage,
            figure: this.renderFigure,
            figcaption: this.renderFigcaption,
            div: this.renderDiv,
            iframe: this.renderIframe,
        }} onLinkPress={this.handleLinkPress} tagsStyles={{ ...tagsStaticStyles, a: { color: theme?.colors.primary }, li: { color: colorBase || theme?.colors.dark2 } }}/>);
    }
}
HtmlViewer.defaultProps = {
    containerMaxWidth: SCREEN_WIDTH,
    containerStyle: {
    // padding: CONTAINER_PADDING,
    },
    htmlWrapCssString: '',
    justifyTextEnabled: false,
    tagsStyles: {},
    colorBase: '',
    imageLoading: false,
};
export default withTheme(HtmlViewer);
