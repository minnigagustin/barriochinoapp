import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, tailwind } from "../../shared";
import { useNetInfo } from '@react-native-community/netinfo';
const AsyncComponent = ({ status, useOldData = false, isDataEmpty, Request = <ActivityIndicator size="small" style={[tailwind['pt-8'], tailwind['pb-8']]}/>, Success, Failure = null, Empty = null, style = {}, }) => {
    const netInfoState = useNetInfo();
    let Content = null;
    if (useOldData) {
        if (status === 'loading' && isDataEmpty) {
            Content = Request;
        }
        else if (status === 'failure') {
            Content = netInfoState.isConnected ? Failure : Success;
        }
        else if (status === 'success' && isDataEmpty) {
            Content = Empty;
        }
        else {
            Content = Success;
        }
    }
    else {
        if (status === 'loading') {
            Content = Request;
        }
        else if (status === 'failure') {
            Content = netInfoState.isConnected ? Failure : Success;
        }
        else if (status === 'success' && isDataEmpty) {
            Content = Empty;
        }
        else if (status === 'success' && !isDataEmpty) {
            Content = Success;
        }
    }
    return (<View flex style={style}>
      {Content}
    </View>);
};
export default AsyncComponent;
