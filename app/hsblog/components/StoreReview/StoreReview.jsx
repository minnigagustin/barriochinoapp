import { memo, useRef } from 'react';
import { useMount } from "../../shared";
import isAndroid from "../../shared/utils/isAndroid";
import { requestReview, isAvailableAsync } from './ExpoStoreReview';
const StoreReview = ({ onFailure, onRequested, iosStore, androidStore }) => {
    const timeout = useRef(null);
    const _handleStoreReview = async () => {
        try {
            const isAvailable = await isAvailableAsync();
            const url = isAndroid ? `${androidStore}&showAllReviews=true` : `${iosStore}?action=write-review`;
            if (isAvailable && url.includes('http')) {
                await requestReview(url);
                onRequested?.(url);
            }
            else {
                throw new Error('Not Support');
            }
        }
        catch (err) {
            onFailure?.(err.message);
        }
    };
    useMount(() => {
        timeout.current = setTimeout(() => {
            _handleStoreReview();
        }, 300000);
        return () => {
            clearTimeout(timeout.current);
        };
    });
    return null;
};
export default memo(StoreReview);
