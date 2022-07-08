import { useDispatch } from 'react-redux';
export function Dispatcher(action) {
    const dispatch = useDispatch();
    return (...payload) => dispatch(action(...payload));
}
