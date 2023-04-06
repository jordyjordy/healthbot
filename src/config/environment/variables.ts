/* eslint-disable node/no-process-env */

export default {
    botToken: process.env.BOT_TOKEN ?? '' as string,
    botClientId: process.env.BOT_CLIENT_ID ?? '' as string,
    botClientSecret: process.env.BOT_CLIENT_SECRET ?? '' as string,
    registerCommands: parseInt(process.env.REGISTER_SLASH_COMMANDS ?? '0'),
};
