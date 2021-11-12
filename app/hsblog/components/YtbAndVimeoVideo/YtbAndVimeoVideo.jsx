import React, { PureComponent } from 'react';
import Video from "../Video/Video";
import getVideoInfo from './getVideoInfo';
class YtbAndVimeoVideo extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            thumbnail: '',
        };
    }
    async componentDidMount() {
        const { uri } = this.props;
        const { thumbnail } = await getVideoInfo(uri);
        this.setState({
            thumbnail,
        });
    }
    render() {
        const { uri } = this.props;
        const { thumbnail } = this.state;
        return <Video uri={uri} thumbnailUri={thumbnail} thumbnailPreview={thumbnail} tachyons={['mb3', 'br3', 'overflowHidden']}/>;
    }
}
export default YtbAndVimeoVideo;
