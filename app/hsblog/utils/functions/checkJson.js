export default function checkJson(description) {
    if (!!description &&
        /^[\],:{}\s]*$/.test(description
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return typeof JSON.parse(description) === 'object' ? JSON.parse(description) : description.toString();
    }
    else {
        return description + '';
    }
}
