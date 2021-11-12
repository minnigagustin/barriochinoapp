import React, { useRef, useState, memo } from 'react';
import { View } from "../..";
import { BackHandler } from 'react-native';
import { useMount } from "../../hooks/useMount";
import isAndroid from "../../utils/isAndroid";
import Emitter from "../../utils/emitter";
import { useUnmount } from "../../hooks/useUnmount";
import { styles } from './styles';
const Event = new Emitter();
const defaultProps = {
    visible: true,
};
export const ModalBase = ({ onRequestClose, ...otherProps }) => {
    const backPress = useRef(0);
    Event.emit('MODAL_MOUNT', otherProps);
    const handleBackPress = () => {
        onRequestClose?.();
    };
    useMount(() => {
        backPress.current = Event.on('MODAL_BACK_PRESS', handleBackPress);
    });
    useUnmount(() => {
        Event.off(backPress.current);
    });
    return null;
};
ModalBase.defaultProps = defaultProps;
export const ModalBaseUI = memo(() => {
    const mounted = useRef(0);
    const [visible, setVisible] = useState(false);
    const [children, setChildren] = useState(null);
    const [style, setStyle] = useState({});
    const handleBackPress = () => {
        Event.emit('MODAL_BACK_PRESS');
        return null;
    };
    const handleMount = (props) => {
        !!props.visible && setVisible(props.visible);
        setChildren(props.children);
        !!props.style && setStyle(props.style);
    };
    useMount(() => {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        }
        mounted.current = Event.on('MODAL_MOUNT', handleMount);
    });
    useUnmount(() => {
        Event.off(mounted.current);
    });
    if (!visible) {
        return null;
    }
    return (<View style={styles.container}>
      <View flex style={style}>
        {children}
      </View>
    </View>);
});
