function checkLength({ length, presence, special, value, required }) {
    return (!!length &&
        ((!presence && (value.length <= (length.minimum ?? -1) || value.length >= (length.maximum ?? Infinity))) ||
            (value.length > 0 && (value.length <= (length.minimum ?? -1) || value.length >= (length.maximum ?? Infinity))) ||
            (!!special && !required && value.length > 0 && (value.length <= (length.minimum ?? -1) || value.length >= (length.maximum ?? Infinity))) ||
            (required && value.length > 0 && (value.length <= (length.minimum ?? -1) || value.length >= (length.maximum ?? Infinity)))));
}
export default checkLength;
