export default function getPostDetailMax50(source) {
    const arr = Object.keys(source);
    const NUM_MAX = 50;
    return arr.reduce((obj, key, index) => {
        const value = source[key];
        return {
            ...obj,
            ...(index > arr.length - 1 - NUM_MAX ? { [key]: value } : {}),
        };
    }, {});
}
