import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Schedule from "../model/schedule";

const execute = async (interaction: ChatInputCommandInteraction) => {
    if(!interaction.guildId) {
        interaction.reply('You can only execute this command from a server.');
        return;
    }
    const userId = interaction.user.id;
    const serverId = interaction.guildId;
    const name = interaction.options.get('name')?.value as string;
    try {
        const res = await Schedule.removeSubscriber(serverId, name, userId);
        if(res) {
            interaction.reply(`Unsubscribed from the check: ${name}.`);
            return;
        } else {
            interaction.reply(
                `Could not unsubscribe from the check: ${name},`
                + ` either it does not exist or you were not subscribed.`,
            );
            return;
        }

    } catch (err) {
        interaction.reply(
            'Something went wrong while trying to join the schedule.',
        );
        return;
    }
    return;
};

export default {
    data: new SlashCommandBuilder()
        .setName('unsubscribe')
        .addStringOption(option => option.setName('name').setDescription('name of the check').setRequired(true))
        .setDescription('Unsubscribe from a check'),
    execute,
};
