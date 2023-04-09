
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const execute = async (interaction: ChatInputCommandInteraction) => {

    /* eslint-disable max-len */
    const reply = `
This bot allows you to get automated messages are specific schedules. 
The best way to achieve this is with cron schedules, which are not super user friendly but quite powerful.
An guided website with example cron schedule can be found here: https://crontab.guru/#*/15_8-18_*_*_1-5.
The bot will only send checks if you are online or idle on your desktop or phone.
If you status is \`do not disturb\` or \`offline\` then the check will not be sent. 
If the check is configured to only send to desktop then the check will not be sent if you are only online on your phone.
    `;
    /* eslint-enable max-len */
    interaction.reply(reply);
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('howto')
        .setDescription('information on how to use the bot'),
    execute,
};
