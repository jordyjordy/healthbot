/* eslint-disable node/no-process-env */

export default {
    bot: {
        token: process.env.BOT_TOKEN ?? '',
        clientId: process.env.BOT_CLIENT_ID ?? '',
        clientSecret: process.env.BOT_CLIENT_SECRET ?? '',
        registerCommands: parseInt(process.env.REGISTER_SLASH_COMMANDS ?? '0'),
    },
    mongoDb: {
        url: process.env.MONGODB_URL ?? '',
    },
};
