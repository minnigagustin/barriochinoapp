function getObjectFromFields(arr, value) {
    return arr.reduce((obj, item) => {
        return {
            ...obj,
            [item.name]: value,
        };
    }, {});
}
export default getObjectFromFields;
