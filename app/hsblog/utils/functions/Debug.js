import Axios from 'axios';
const url = `https://6001515808587400174da90a.mockapi.io/api/v1/errors`;
export const Debug = (callback) => {
    try {
        return callback();
    }
    catch (err) {
        Axios.post(url, {
            createdAt: Date.now(),
            name: JSON.stringify({
                name: err.name,
                message: err.message,
            }),
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
};
