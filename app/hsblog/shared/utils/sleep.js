export default function sleep(ms) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve();
            clearTimeout(timeout);
        }, ms);
        return timeout;
    });
}
