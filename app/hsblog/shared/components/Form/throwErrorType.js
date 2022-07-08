function throwErrorType(item, defineRenderFields) {
    const getDefineTypeKey = Object.keys(defineRenderFields);
    if (__DEV__) {
        const error = new Error(!item.type
            ? `You need to pass the type property: ${JSON.stringify(item)}`
            : `You need to use the defineRenderFields prop to define the render type of a "type".\nEg: <WilForm defineRenderFields={{ ${item.type}: "render${item.type}" }} render${item.type}={...} ... />.\nOr use the previously defined type ${JSON.stringify(getDefineTypeKey)}`);
        throw error.message;
    }
}
export default throwErrorType;
