import React from 'react';
import { Image } from "../../shared";
import SoundCloud from "../../components/SoundCloud/SoundCloud";
import Video from "../../components/Video/Video";
import DetailFeaturedGrid from './DetailFeaturedGrid';
const DetailFeatured = ({ formatType, formatData, featuredImagePreview, featuredImageUri }) => {
    switch (formatType) {
        case 'audio':
            return <SoundCloud uri={formatData} tachyons="mb3"/>;
        case 'video':
            return (<Video uri={formatData} thumbnailUri={featuredImageUri} thumbnailPreview={featuredImagePreview} tachyons={['mb3', 'br3', 'overflowHidden']}/>);
        case 'gallery':
            return <DetailFeaturedGrid data={formatData || []}/>;
        case 'standard':
        default:
            return <Image preview={featuredImagePreview} uri={featuredImageUri} percentRatio="56.25%" borderRadius="round" tachyons="mb3"/>;
    }
};
export default DetailFeatured;
