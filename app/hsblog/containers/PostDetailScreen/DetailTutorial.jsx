import React from 'react';
import Tutorial from "../../components/Tutorial/Tutorial";
import { Image } from "../../shared";
import { useSelector } from 'react-redux';
import { useChangePostDetailTutorial } from './actions/actionPostDetail';
import { postDetailTutorialSelector } from './selectors';
const data = [
    {
        text: 'Pull to request',
        image: 'https://cdn.dribbble.com/users/25514/screenshots/1797373/pull-down-refresh-iphone-app-interface-ux-design-ramotion.gif',
    },
    {
        text: 'abc',
        image: 'https://cdn.dribbble.com/users/131432/screenshots/5183531/tab-bar-menu.gif',
    },
    {
        text: 'aaa',
        image: 'https://cdn.dribbble.com/users/436170/screenshots/4511669/final_1.gif',
    },
];
const DetailTutorial = () => {
    const changePostDetailTutorial = useChangePostDetailTutorial();
    const postDetailTutorial = useSelector(postDetailTutorialSelector);
    const handleDone = () => {
        changePostDetailTutorial();
    };
    return (<Tutorial visible={postDetailTutorial} data={data} keyExtractor={item => item.image} setText={item => item.text} renderItem={({ item }) => {
        return <Image uri={item.image}/>;
    }} onDone={handleDone}/>);
};
export default DetailTutorial;
