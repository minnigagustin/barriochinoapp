export default class Emitter {
    constructor() {
        this.events = {};
        this.id = 1;
    }
    emit(type, payload) {
        if (this.events[type]) {
            this.events[type].forEach(({ listener }) => {
                listener(payload);
            });
        }
    }
    on(type, listener) {
        const id = ++this.id;
        this.events = {
            ...this.events,
            [type]: [
                ...(this.events[type] || []),
                {
                    listener,
                    id,
                },
            ],
        };
        return id;
    }
    once(type, listener) {
        const id = ++this.id;
        this.events = {
            ...this.events,
            [type]: [{ listener, id }],
        };
        return id;
    }
    off(id) {
        this.events = Object.keys(this.events).reduce((obj, key) => {
            return {
                ...obj,
                [key]: this.events[key].filter(item => item.id !== id),
            };
        }, {});
    }
    offReference(type, listener) {
        if (this.events[type]) {
            this.events[type] = this.events[type].filter(item => {
                return item.listener !== listener;
            });
        }
    }
    offEvent(type) {
        if (this.events[type]) {
            this.events = Object.keys(this.events).reduce((obj, key) => {
                return {
                    ...obj,
                    ...(key === type ? {} : { [key]: this.events[key] }),
                };
            }, {});
        }
    }
}
const Event = new Emitter();
Event.emit('test', { name: 'abc' });
// Event.on('')
