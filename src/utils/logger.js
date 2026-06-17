import pino from 'pino';

const logger = pino({
    browser: {
        asObject: true
    },
    level: import.meta.env.MODE === 'production' ? 'info' : 'debug',
    base: {
        app: 'CineVip-POS-FrontEnd',
        env: import.meta.env.MODE
    }
})

export default logger;