function checkPresence({ presence, required, value }) {
    return !!presence && !!required && value.length <= 0;
}
export default checkPresence;
