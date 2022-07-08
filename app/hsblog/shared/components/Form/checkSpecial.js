function checkSpecial({ length, presence, special, value, required }) {
    return (!!special &&
        ((!length && value.length > 0 && required) ||
            (!length && !presence && value.length >= 0) ||
            (!required && value.length > 0) ||
            (!!length && !presence && value.length > 0) ||
            (!!length && !!presence && required && value.length > 0)));
}
export default checkSpecial;
